'use strict';

const net = require('net');
const netPort = 60300;

const client = net.connect({port: netPort});

client.on('data', data=> {
    const message = JSON.parse(data);
    if(message.type === 'watching') {
        console.log(`Now watchving: ${message.file}`);
    } else if (message.type === 'changed') {
        const date = new Date(message.timestamp);
        console.log(`File changed: ${date}`);
    } else {
        console.log(`Unrecognize message type ${message.type}`);
    }
});