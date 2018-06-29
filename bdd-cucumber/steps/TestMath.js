'use strict';

const defineSupportCode = require('cucumber').defineSupportCode;
const assert = require('assert');

defineSupportCode(function({ Given, Then, When }) {
    let answer = 0;
    Given('I start with {int}', input => {
      // Write code here that turns the phrase above into concrete actions
      // callback(null, 'pending');
      answer = input;
    });
    When('I add {int}', input => {
      // Write code here that turns the phrase above into concrete actions
      // callback(null, 'pending');
      answer += input
    });
    Then('I end up with {int}', expectedAnswer => {
      // Write code here that turns the phrase above into concrete actions
      assert.equal(answer, expectedAnswer);
      //callback(null, 'pending');
    });
  });