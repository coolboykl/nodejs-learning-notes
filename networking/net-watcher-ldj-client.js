'use strict';

const netClient = require('net').connect({port:60300});
const ldjClient = require('./lib/ldj-client.js').connect(netClient);


ldjClient.on('message', message=> {
    console.log(`the message ->${message}`);
    if(message.type === 'watching') {
        console.log(`Now watchving: ${message.file}`);
    } else if (message.type === 'changed') {
        console.log(`File changed: ${new Date(message.timestamp)}`);
    } else {
        console.log(`Unrecognize message type ${message.type}`);
    }
});