const request = require("request");
const config = require('./config.js');

function getChannelbyKeyword(msg) {
    let channel = config.tg.chatid;  //default channel
    for (let keyword_channel_id in config.keyword) {
        console.log(`keyword_channel_id = ${keyword_channel_id}`);
        for (let keyword of config.keyword[keyword_channel_id]) {
            if (msg.includes(keyword)) {
                console.log(`match keyword = ${keyword}, override channel to ${keyword_channel_id}`);
                return { channel_id: keyword_channel_id,  keyword: keyword };
            }else {
                console.log(`mismatch keyword = ${keyword}`);
            }
        }
    }
    return { channel_id: channel, keyword: "N/A" };
}

function sendMsg(prefix, msg) {

    //get Channel (severity) by Keyword
    let { channel_id, keyword } = getChannelbyKeyword(msg);
    let send_text = `${prefix} match [${keyword}] - ${msg}`;
    let opt = {
        url: config.tg.api_url,
        method: 'POST',
        timeout: 5000,
        form: {chat_id: channel_id, text: send_text}

    }
    console.log(opt);

    request(opt, function(err,httpRes,body){
        if (!err) {
            console.log ("tg api response, body: "+body);
        }else {
            console.log ("cannot send tg, error: "+err);
        }

    })
}

module.exports = {
   sendMsg,
   getChannelbyKeyword
}
