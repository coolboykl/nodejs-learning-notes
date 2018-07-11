'use strict';

const defineSupportCode = require('cucumber').defineSupportCode;
const assert = require('assert');

defineSupportCode(function ( {Given, Then,When}) {
    Given('I wants to use Kiple Wallet', function () {
        // To perform some initialization
        return true;
    });

    When('I proceed to create Wallet with {string} as my user name, {string} as my password and deposit {float} as my initial wallet balance', function (username, password, amount) {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });


    Then('My wallet is created with {string} as wallet primary userid, and {float} as wallet balance', function (username, amount) {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });
});