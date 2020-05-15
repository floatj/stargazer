const base36 = require('base36');
let plurk_id = 1439314380;
let postfix = base36.base36encode(plurk_id); 
let plurk_url = `https://plurk.com/m/p/${postfix}`;
