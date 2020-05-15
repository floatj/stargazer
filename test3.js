var utf8 = require('utf8');
//str = "\u6574\u7406\u8cc7\u6599\u593e\u771f\u7684\u597d\u96e3\u5594 <img class=\"emoticon_my\" src=\"https://emos.plurk.com/87969b048d3c423d5a7306397592cf2a_w48_h48.png\" width=\"48\" height=\"48\">";
str = "\u6574\u7406"

let dec = decodeURIComponent(str)
let esc = unescape(str);
console.log(dec)
console.log(esc)
let u8 = utf8.decode(str)
console.log(u8);
