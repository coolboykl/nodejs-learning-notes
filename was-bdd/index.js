'use strict';

const User = require('./app/model/user.js');

const aUser = new User("khoo.james@gmail.com", "password");
console.log(JSON.stringify(aUser.toJSON()) );
