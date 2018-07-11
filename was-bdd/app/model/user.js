'use strict';

module.exports = class User {
    constructor(userEmailAddr, userPassword, walletBalance) {
        this.userEmailAddr = userEmailAddr;
        this.userPassword = userPassword;
        this.walletBalance = walletBalance;
    }

    updateUserID(newID) {
        this.id  = newID;
    }

    toJSON() {
        return ({
            id: this.id,
            emailAddr: this.userEmailAddr,
            password: this.userPassword,
            walletBalance: this.walletBalance
        });
    }
}
