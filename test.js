const regex = /CometChannel.scriptCallback\((.*)\);/gm;
const str = `CometChannel.scriptCallback({"new_offset": 10,"data": [{"replurkers":[],"coins":0,"responses_seen":0,"qualifier":"is","replurkers_count":0,"replurker_id":null,"response_count":0,"anonymous":false,"replurkable":false,"last_edited":null,"porn":false,"id":1375575005,"favorite_count":0,"is_unread":0,"lang":"tr_ch","content":"\\u4e0b\\u53bb\\u9818500!!!","content_raw":"\\u4e0b\\u53bb\\u9818500!!!","user_id":3252177,"plurk_type":1,"limited_to":"|4499004||3252177|","replurked":false,"favorite":false,"longitude":null,"no_comments":0,"favorers":[],"plurk_id":1375575005,"excluded":null,"latitude":null,"posted":"Thu, 03 May 2018 09:03:45 GMT","type":"new_plurk","has_gift":false,"owner_id":3252177}]});`;
let m;

while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    var con = JSON.parse(m[1]).data[0]['content'];

    console.dir(con);

//    console.dir(con);
        
    // The result can be accessed through the `m`-variable.
/*
    m.forEach((match, groupIndex) => {
        console.log('Found match, group '+groupIndex+': \033[1;33m'+match+'\033[m');
    });
*/
}

