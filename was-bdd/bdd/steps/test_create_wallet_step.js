'use strict';

const defineSupportCode = require('cucumber').defineSupportCode;
const assert = require('assert');

defineSupportCode(function ( {Given, Then,When}) {
    Given('I wants to use Kiple Wallet', function () {
        // Noting to do here, return true
        return true;
    });

    When('I wants proceed to create Wallet with {string} as my user name, {string} as my password and {int} as my wallet balance', function (string, string2, int) {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });


    Then('My wallet is created with {string} as wallet primary userid, and {int} as wallet balance', function (string, int) {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });
});