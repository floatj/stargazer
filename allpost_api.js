const { PlurkClient } = require('plurk2');
const req = require('request');
//const utf8 = require('utf8');
const config = require('./config.js');
const base36 = require('base36');
const client = new PlurkClient(config.c_token, config.c_secret, config.a_token, config.a_secret);
const tg = require("./sendmsg");
const mysql = require('mysql2');
var connection;

//init DB connection
function initDB() {
  connection = mysql.createConnection(config.db);
  console.log(`DB ${config.db.host} > ${config.db.database} connected`);
}

//fetch and process single plurk
function getSinglePlurk(plurk_id) {
    console.log(`fetching #${plurk_id} ...`);
    client.request('/APP/Timeline/getPlurk', { plurk_id: plurk_id })
    .then(ret => handle(ret, plurk_id) )
    .catch(
        err => {

          if (err.statusCode == 400 && err.error.error_text == "No permissions") {

              //plurk without permissions, stepping to next plurk_id
              console.log(`#${plurk_id} no permission`)

              //continue
              steppingNextPlurk(plurk_id);

          } else if (err.statusCode == 400 && err.error.error_text === "Plurk not found") {
              //plurk not found
              console.log(`#${plurk_id} not found`);

              //continue
              steppingNextPlurk(plurk_id);

          }else {
              //other error
              console.log('\033[1;31m');
              console.error(err);
              console.log('\033[m');

              //@TODO: if it's latest plurk need to handle
              throw err

          }
        }
    );
}

async function steppingNextPlurk(plurk_id) {
    //stepping
    console.log(`current plurk_id is ${plurk_id}`);
    plurk_id = plurk_id + 1
    console.log(`stepping plurk_id to ${plurk_id}`);

    //test loop
    getSinglePlurk(plurk_id);   
}

//handle each plurk process
async function handle(ret, plurk_id) { 
    let url = await getPlurkUrl(plurk_id);
    console.log("\033[1;33m"+url+"\033[m");

    let content = ret.plurk.content
    console.log("\033[1;37m"+content+"\033[m");

    //write to DB
    savePlurk(ret);
    
    //continue
    steppingNextPlurk(plurk_id);
}

//write to DB
async function savePlurk(plurk) {
    connection.execute('INSERT INTO plurk (plurk_id, content) VALUES (?, ?)', [plurk.plurk.plurk_id, plurk.plurk.content], (err, rows) => {
        //complete write to DB
        if (err != null) {
            if (! (err.code ===  'ER_DUP_ENTRY' && err.errno == 1062))
                console.error(err);
        }
        //if success
        //if (rows) console.log (rows);
    });
}

async function getProfile() {
    let profile = await client.request('Users/me');
    return profile;
    //  .then(profile => console.log(profile))
    //  .catch(err => console.error(err));
}

async function loadPlurkId() {
    var fs = require("fs");
    var filename = "./latest_plurk_id.txt";
    let latest_plurk_id = Number(fs.readFileSync(filename));
    return latest_plurk_id
}

//發一則廢噗之後馬上刪除，並取得最新的 Plurk ID
async function getPlurkIdbyPlurkAdd(user_id) {
    let ret_add  = await client.request('/APP/Timeline/plurkAdd', {content: 'test', qualifier: 'says', limited_to: [user_id]});
    let plurk_id = ret_add.plurk_id;
    let ret_del = await client.request('/APP/Timeline/plurkDelete', {plurk_id: plurk_id} );
    if (ret_del.success_text !== 'ok') throw 'cannot delete test plurk!'
    return plurk_id;
}

//get plurk url by plurk ID
async function getPlurkUrl(plurk_id) {
    return `https://plurk.com/m/p/${base36.base36encode(plurk_id)}`;
}

//entrypoint
async function Init() {
    let profile = await getProfile();
    //console.log(profile);
    let self_user_id = profile.id;

    //@TODO: post a private plurk (only self can view) to get latest plurk_id
    console.log(self_user_id);

    let plurk_id = await getPlurkIdbyPlurkAdd(self_user_id)

    //debug
    //process.exit();

    //DB init
    initDB();

    //load lasttime process Plurk ID
    //let plurk_id = loadPlurkId();

    console.log(`start from #${plurk_id}`);

    //get plurk
    getSinglePlurk(plurk_id);
}

Init();
