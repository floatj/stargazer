const { PlurkClient } = require('plurk2');
const req = require('request');
//const utf8 = require('utf8');
const config = require('./config.js');
//test long polling 
//need to get access token & access token secret first!
const base36 = require('base36');


const client = new PlurkClient(config.c_token, config.c_secret, config.a_token, config.a_secret);
/*
client.request('Users/me')
.then(profile => console.log(profile))
.catch(err => console.error(err));
*/
const tg = require("./sendmsg")

function initComet() {
    client.request('Realtime/getUserChannel')
    .then(ret => handle(ret) )
    .catch(
        err => console.error(err)
    );
}

function handle(ret) { 
    console.log(ret['comet_server']);
    var req_url = ret['comet_server'];
    console.log('got comet server url = '+req_url);    
    //long polling
    long_polling(req_url);
}

function long_polling(url) {

     console.log('\033[1;32mstart long polling url = '+url+'\033[m');
     req.get(url, function (err, ret, rawbody) {
        if (err) {
            console.log("\033[1;31mERROR!!!!\033[m");
            console.error(err);
        }

        if (ret) {
            console.log("long polling got response = ");
            console.log("\033[1;30m");
            console.log(rawbody);
            console.log("\033[m");

            //handle rawbody 

            //wrap new line?
			var ret = rawbody.replace(/CometChannel.scriptCallback\(/g,'');
			ret = ret.replace(/\);/g,'');
			ret = ret.replace(/\n/g,'<br>');

			//console.log('raw=');
			//console.log(ret);

            //get plurk_id
            let re = /\"plurk_id\"\:\s(.*?)\,/;
            let plurk_id_ret = ret.match(re);
            let plurk_id = 0;
            let plurk_url = "";
            if (plurk_id_ret != null ){
                plurk_id = plurk_id_ret[1];
                let postfix = base36.base36encode(plurk_id);
                plurk_url = `https://plurk.com/m/p/${postfix}`;
            }

			//need to fix content issue before parse JSON
			re = /\"content\"\:\s\"(.*?)\",\s"content_raw":/;
			let fix_ret = ret.match(re);
            let content_fix = '';
            let content_decode = "";

            //if comet return value has content
            if (typeof fix_ret !== 'undefined' && fix_ret != null) {
		        content_fix = fix_ret[1];
                //let content_decoded = decodeURIComponent(content_fix);

                //set msg prefix (plurk_id and plurk_url)
                let prefix = `#${plurk_id} - ${plurk_url}`;
                console.log("\033[1;32m"+prefix+"\033[m");

                //log
                console.log(typeof content_fix)
                //if (typeof fix_ret[1] !== 'undefined') {
                //got content
    			console.log("\033[0;36m"+content_fix+"\033[m");
    			//console.log("\033[1;36m"+decodeURIComponent(content_fix)+"\033[m");

                //content_decode = decodeURIComponent(content_fix);
                content_decode = unescape(content_fix);
                //let cd2 = unescape(content_decode);

                console.log("\033[0;35m"+content_decode+"\033[m");

                //debug
                let str_parsed = JSON.parse('"' + content_decode + '"');
                console.log("\033[1;37m"+str_parsed+"\033[m");

                //send msg
                tg.sendMsg(prefix, str_parsed);
            }

            /*
            let re = /CometChannel\.scriptCallback\((.*)\)\;/gm
            let match_ret = rawbody.match(re);
            let new_offset = 0;
            let ret_json = {};

            console.log('match ret=');
            console.log(match_ret);
            console.log(match_ret.length);

            if (typeof match_ret[1] !== 'undefined') {
                ret_json = JSON.parse(match_ret[1])
                console.log('json = ');
                console.log(ret_json);
            }else {
                throw('regex failed! cannot parse CometChannel response rawbody!')
            }*/

            re = /\"new_offset\"\:\s(.*?)\,\"data\"/;
            let offset_ret = ret.match(re);
            let new_offset = (offset_ret != null && typeof offset_ret[1] !== 'undefined') ? offset_ret[1] : null ;
            console.log(`new_offset = ${new_offset}`);

            //check pattern 2
            if (new_offset == null) {
                re = /\{\"new_offset\"\:\s(.*?)\}/;
                offset_ret = ret.match(re);
                new_offset = typeof offset_ret[1] !== 'undefined' ? offset_ret[1] : null ;
                console.log(`pattern 2 new_offset = ${new_offset}`);
            }

            if (new_offset != null) {
                //use new offset long polling
                let new_url  = url.replace(/offset=(.*)/, `offset=${new_offset}`);
                console.log(`got new_offset = ${new_offset}, new_url = ${new_url}`);
                long_polling(new_url);

            }else {
                //retry init comet
                console.log("\033[1;31mcannot fetch new offset, retry initComet");
                initComet();
                //throw('cannot fetch new offset! long polling stop')
			}

            //console.log('long_polling request done');
        }
     });
}


//danger?
function worker(data) {
//    console.log ("\033[1;36mWorker : source is from "+data+"\033[m");

    //reply
     var msg = "https://i.imgur.com/Koy2IpH.jpg";
    //"https://www.ptt.cc/bbs/Gossiping/M.1525342803.A.597.html";

    //reply(msg, data);
}

function reply(msg, plurk_id) {

    console.log("\033[1;31mplurk id = "+plurk_id+"\033[m");

    const param = {'plurk_id': plurk_id, 'content': msg, 'qualifier': 'freestyle'};

    client.request('Responses/responseAdd', param)
    .then(ret => console.log('response Add ok! ret='+ret) )
    .catch(
        err => console.error(err)
    );
}

initComet();
