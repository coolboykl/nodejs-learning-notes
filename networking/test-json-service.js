'use strict';

const server = require('net').createServer(connection => {
    console.log("subscriber connected");

    const firstChunk = '{"type":"changed","timest';
    const secondChunk = 'amp":1526467421563}\n';
    
    // send the first chunk
    connection.write(firstChunk);

    const timer = setTimeout(()=> {
        connection.write(secondChunk);
        connection.end();

    },100);

    connection.on('end', ()=> {
        clearTimeout(timer);
        console.log('Subscriber disconnected');
    });
});

server.listen(60300, function() {
     console.log('Test server listening for subscribers....');
});