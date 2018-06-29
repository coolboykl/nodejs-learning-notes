'use strict';

module.exports = class User {
    constructor(userEmailAddr, userPassword) {
        this.userEmailAddr = userEmailAddr;
        this.userPassword = userPassword;
    }

    toJSON() {
        return ({
            emailAddr: this.userEmailAddr,
            password: this.userPassword
        });
    }
}
