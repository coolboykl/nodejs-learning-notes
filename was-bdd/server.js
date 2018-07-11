'use strict';
const express = require('express');
const morgan = require('morgan');
const nconf = require('nconf');
const bodyParser = require('body-parser');
const pkg = require('./package.json');

nconf.argv().env('__');
nconf.defaults({conf: `${__dirname}/config.json`});
nconf.file(nconf.get('conf'));

const app = express();
app.use(morgan('dev'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

require('./app/service/user_service.js')(app, nconf.get('es'));

// require('./lib/search.js')(app, nconf.get('es'));
// require('./lib/bundle.js')(app, nconf.get('es'));

app.listen(nconf.get('port'), () => {
    console.log('Wallet as Service Server Ready, Listening to Port:' + nconf.get('port') + ' Pkg version:' + pkg.version);
} );