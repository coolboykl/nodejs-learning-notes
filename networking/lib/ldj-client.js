'use strict';

const EventEmitter = require('events').EventEmitter;

class LDJClient extends EventEmitter {
    constructor(stream) {
        if(!stream || stream === null) {
            throw Error('Stream is Null');
        }

        super();
        let buffer = '';
        // console.log(stream);
        stream.on('data', data => {
            buffer += data;
            let boundary = buffer.indexOf('\n');
            while (boundary !== -1) {
                const input = buffer.substring(0, boundary);
                buffer = buffer.substring(boundary + 1);
                // console.log(`input -> ${input}`);
                this.emit('message', JSON.parse(input));
                boundary = buffer.indexOf('\n');
            }
        });
    }

    static connect(stream) {
        return new LDJClient(stream);
    }
    
}

module.exports  = LDJClient;