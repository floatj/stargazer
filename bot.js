const { PlurkClient } = require('plurk2');
const req = require('request');
const utf8 = require('utf8');


const client = new PlurkClient(
'1qcCYl4MoPsv',
'kgYUKm2f8pRKTyzEvswjWdFQENlXIB8E',

'pMe201Z3IT5O',
'jool0jxdW5JpbhvjMWLR1gBw5wafjSW3'
);

/*
client.request('Users/me')
.then(profile => console.log(profile))
.catch(err => console.error(err));
*/

client.request('Realtime/getUserChannel')
.then(ret => handle(ret) )
.catch(
    err => console.error(err)
);

function handle(ret) { 
    console.log(ret['comet_server']);
    var req_url = ret['comet_server'];
    
    //long polling
    long_polling(req_url);
}

function long_polling(url) {

     console.log('\033[1;32mstart long polling!\033[m');
     req.get(url, function (err, ret, doc) {
        if (err) {
            console.log("\033[1;31mERROR!!!!\033[m");
            console.error(err);
        }
        if (ret) {
            console.log("long polling got response");
            //判斷是拿到 new_offset (需要調整 offset 再發一次) 還是結果
            if (doc.new_offset != null){
                console.log ("new offset is "+doc.new_offset);
            }

            //console.dir(doc);

            //do regex for document
            const regex = /CometChannel.scriptCallback\((.*)\);/gm;
            let m;
            
            while ((m = regex.exec(doc)) !== null) {
                console.log("apply regex...");
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                var con = JSON.parse(m[1]).data[0]['content'];
                var plurk_id = JSON.parse(m[1]).data[0]['plurk_id'];
                
                console.dir(con);
                const regex2 = /(.*)500(.*)/gm;
                const regex3 = /(.*)五百(.*)/gm;
                var done = false;

                while ((m = regex2.exec(con)) != null) {        
                    worker(plurk_id);
                    done = true;
                }
                while ((m = regex3.exec(con)) != null) {
                    worker(plurk_id);
                    done = true;
                }

                if (!done) {
                    console.log ("processing response...doc=");
                    console.dir(doc);
                }

            }

            /*
            //get new offset
            var jsondata = JSON.parse(doc);
            var offset = jsondata['new_offset'];
            console.log("\033[1;31m  New offset is "+offset+"\033[m");
            */
        }
     });
}

function worker(data) {
//    console.log ("\033[1;36mWorker : source is from "+data+"\033[m");

    //發噗
    var msg = "https://i.imgur.com/Koy2IpH.jpg";
    //"https://www.ptt.cc/bbs/Gossiping/M.1525342803.A.597.html";

    reply(msg, data);
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
