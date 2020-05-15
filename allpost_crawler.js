const fetch = require('node-fetch');
const base36 = require('base36');
const mysql = require('mysql2/promise');
const fs = require('fs');
const cheerio = require('cheerio')

/* AllPost Crawler Version */

let init_db = async function () {
    // create the connection to database
    const connection = await mysql.createConnection({
        "host":"localhost",
        "port":3306,
        "user":"root",
        "password":"db5566",
        "database":"stargazer",
        "connectionLimit":50,
        "debug": false
    });
    console.log('DB connected');
}

let plurk_id = 1440284082;
let postfix = base36.base36encode(plurk_id);
let plurk_url = `https://plurk.com/m/p/${postfix}`;


//init db
init_db();

//start fetching
console.log(`fetching ${plurk_url} ...`);

fetch(plurk_url)
    .then(res => res.text())
    .then(body => processFetchResult(body));

let processFetchResult = function (body) {
    //console.log(body);

    //debug
    fs.writeFileSync('./fetch_result.log', body);

    //load cheerio
    const $ = cheerio.load(body);
    let plurk_content = $(".plurk_content.clearfix");
    console.log(plurk_content.text());
    //@TODO: write to DB...?

    //done
    process.exit();
}

  // 数据库操作
  //let ret = await conn.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14]);

