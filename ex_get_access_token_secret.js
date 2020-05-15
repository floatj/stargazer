'use strict';
const config = require('./config')
const Readline = require('readline');
//const { PlurkClient } = require('../lib/');
const { PlurkClient } = require('plurk2');
const req = require('request');
const utf8 = require('utf8');

//request access token & secret

//const client = new PlurkClient(config.c_token, config.c_secret, config.a_token, config.a_secret);
const client = new PlurkClient(config.c_token, config.c_secret);

Promise.resolve(client)
.then(client => client.getRequestToken())
.then(({ authPage }) => {
  console.log('Go to this page to verify:', authPage);
  const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return Promise.all([
    rl, readlineQuestionPromise(rl, 'Enter or paste verifier here: ')
  ]);
})
.then(([rl, verifier]) => {
  rl.close();
  return client.getAccessToken(verifier);
})
.then(client => {
  console.log('Login success\ntoken:', client.token, '\nsecret:', client.tokenSecret);
  // Get current user's profile
  return client.request('Users/me');
})
.then(profile => {
  console.log('My profile:', profile);
  // Get plurks just before 10 minutes from now
  return client.request('Polling/getPlurks', {
    offset: new Date(Date.now() - 10 * 60 * 1000)
  });
})
.then(info => {
  console.log('Read plurks before 10 minutes, count:', info.plurks.length);
  // Listen to comet channel
  client.startComet();
  client.on('comet', () => console.log('New comet data arrived...'));
  client.on('new_plurk', response => console.log('[New Plurk]', response));
  client.on('new_response', response => console.log('[New Response]', response));
  client.on('error', err => console.error('[Error]', err.stack || err));
})
.catch(err => console.error('Error:', err.stack || err, err.response.request));

function readlineQuestionPromise(readline, question) {
  return new Promise(resolve => readline.question(question, resolve));
}
