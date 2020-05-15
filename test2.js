
let str = 'CometChannel.scriptCallback({"new_offset": 20,"data": [{"plurk_id": 1439964211, "plurk": {"owner_id": 99999, "user_id": 99999, "plurk_id": 1439964211, "posted": "Thu, 07 May 2020 03:57:23 GMT", "plurk_type": 4, "is_unread": 0, "limited_to": null, "excluded": null, "coins": 0, "last_edited": "Thu, 07 May 2020 06:45:12 GMT", "id": 1439964211, "qualifier": "whispers", "content": "\u6211\u8981\u4f86\u8b1b\u4e00\u4f4d\u7e6a\u5708\u5927\u5927\u7684\u516b\u5366<br />\u6211\u662f\u4ed6\u7684\u7c89 \u8a8d\u8b58\u5927\u5927\u4e4b\u5f8c\u624d\u767c\u73fe\u4ed6\u771f\u7684\u5f88\u591a\u74dc\u53ef\u4ee5\u5403<br /><br class=\"double-br\" />\u597d\u8fa3\u6211\u77e5\u9053PVC\u4e0d\u662f\u9019\u6a23\u7528\u7684\u5df2\u7d93\u5f88\u591a\u4eba\u6307\u6559\u4e86<br />\u5403\u74dc\u9694\u4e00\u5c64 \u4e0d\u8981\u592a\u8f03\u771f <img class=\"emoticon_my\" src=\"https://emos.plurk.com/cbf32e6469ee146ad57996b896e30811_w45_h45.jpeg\" width=\"45\" height=\"45\"> \u6211\u8a8d\u932f\u63a5\u53d7\u7cfe\u6b63 <img class=\"emoticon_my\" src=\"https://emos.plurk.com/507e2aa930e0a27a1eb74595131a2db4_w48_h48.jpeg\" width=\"48\" height=\"48\">", "content_raw": "\u6211\u8981\u4f86\u8b1b\u4e00\u4f4d\u7e6a\u5708\u5927\u5927\u7684\u516b\u5366\n\u6211\u662f\u4ed6\u7684\u7c89 \u8a8d\u8b58\u5927\u5927\u4e4b\u5f8c\u624d\u767c\u73fe\u4ed6\u771f\u7684\u5f88\u591a\u74dc\u53ef\u4ee5\u5403\n\n\u597d\u8fa3\u6211\u77e5\u9053PVC\u4e0d\u662f\u9019\u6a23\u7528\u7684\u5df2\u7d93\u5f88\u591a\u4eba\u6307\u6559\u4e86\n\u5403\u74dc\u9694\u4e00\u5c64 \u4e0d\u8981\u592a\u8f03\u771f\u6211\u8a8d\u932f\u63a5\u53d7\u7cfe\u6b63", "lang": "en", "response_count": 863, "responses_seen": 0, "no_comments": 0, "porn": false, "publish_to_followers": true, "has_gift": false, "favorers": [], "favorite_count": 1334, "replurked": false, "replurker_id": 4615216, "replurkers": [], "replurkers_count": 822, "replurkable": true, "anonymous": true, "responded": 0, "mentioned": 0, "favorite": false}, "response_count": 863, "response": {"id": 7303791702, "user_id": 99999, "plurk_id": 1439964211, "qualifier": ":", "posted": "Thu, 07 May 2020 08:36:12 GMT", "content": "\u554a\u6de6\u6a19\u984c\u66b4\u96f7", "content_raw": "\u554a\u6de6\u6a19\u984c\u66b4\u96f7", "lang": "en", "last_edited": null, "handle": "fig5393", "editability": 0}, "user": {"99999": {"id": 99999, "uid": 99999, "has_profile_image": 1, "timeline_privacy": 0, "nick_name": "anonymous", "display_name": "\u0ca0_\u0ca0", "date_of_birth": null, "avatar": 30575739, "gender": 2, "karma": 99.99, "premium": true, "enable_2fa": 0, "verified_account": false, "dateformat": 0, "default_lang": "tr_ch", "friend_list_privacy": "public", "name_color": "AE00B0"}}, "type": "new_response"}]});';


var ret = str.replace(/CometChannel.scriptCallback\(/g,'');
ret = ret.replace(/\);/g,'');


ret = ret.replace(/\n/g,'<br>');

//console.log('raw=');
//console.log(ret);

//need to fix content issue before parse JSON
let re = /\"content\"\:\s\"(.*?)\",\s"content_raw":/;
let fix_ret = ret.match(re);
let content_fix = fix_ret[1];

console.log(content_fix);
