const { PlurkClient } = require('plurk2');

const client = new PlurkClient('CONSUMER_TOKEN', 'CONSUMER_TOKEN_SECRET', 'ACCESS_TOKEN', 'ACCESS_TOKEN_SECRET');

client.request('Users/me')
.then(profile => console.log(profile))
.catch(err => console.error(err));
