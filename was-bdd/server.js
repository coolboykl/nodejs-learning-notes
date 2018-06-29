'use strict';
const express = require('express');
const morgan = require('morgan');
const nconf = require('nconf');
const pkg = require('./package.json');

nconf.argv().env('__');
nconf.defaults({conf: `${__dirname}/config.json`});
nconf.file(nconf.get('conf'));

const app = express();
app.use(morgan('dev'));


// require('./lib/search.js')(app, nconf.get('es'));
// require('./lib/bundle.js')(app, nconf.get('es'));

app.listen(nconf.get('port'), () => {
    console.log('WAS Server Ready, Listening to Port:' + nconf.get('port') + ' Pkg version:' + pkg.version);
} );