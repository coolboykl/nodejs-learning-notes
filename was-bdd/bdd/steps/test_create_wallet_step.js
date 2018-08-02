'use strict';

const defineSupportCode = require('cucumber').defineSupportCode;
// require('cucumber');

const assert = require('assert');
const nconf = require('nconf');
const request = require('request');
const rp = require('request-promise');
const sleep = require('thread-sleep');
nconf.argv().env('__');
nconf.defaults({
    conf: `${__dirname}/test_env.json`
});
nconf.file(nconf.get('conf'));
const baseURL = nconf.get('user_service_baseURL');

defineSupportCode(function ({
    Given,
    Then,
    When
}) {

    const userArrayList = [];

    Given('I wants to test on creation of new wallet, I should ensure system reset all user recoerds', async () => {
        const deleteAllUserURL = baseURL + '/_delete_all';
        const options = {
            url: deleteAllUserURL,
            json: true,
        }

        await rp.delete(options).then(esResBody => {
            console.log(' ------- 1.In Reset User->' + JSON.stringify(esResBody));
            sleep(350);
            assert(esResBody.totalRecordDeleted >= 0);
            // assert.equal("User created", esResBody.message);
        }).catch(({
            error
        }) => {
            throw error;
        });

    });



    When('I proceed to create Wallet with {string} as my user name, {string} as my password and deposit {float} as my initial wallet balance',
        async (username, password, amount) => {
           // Write code here that turns the phrase above into concrete actions
            const newUserReqBody = {
                userEmailAddr: username,
                userPassword: password,
                walletBalance: amount,
            }
             await rp.post({
                    url: baseURL,
                    body: newUserReqBody,
                    json: true,
                }).then(esResBody => {
                    console.log('---In Create User->' + JSON.stringify(esResBody));
                    sleep(800);
                    assert.equal("User created", esResBody.message);  

                }).catch( ({ error} ) => {
                    console.log('---In Create User, error->' + JSON.stringify(error));
                });
            
        });


    Then('My wallet is created with {string} as wallet primary userid, and {float} as wallet balance',
         async (email, amount) => {
           
            const searchUserURL = baseURL + '/search/email/' + email;
           
            const options = {
                url: searchUserURL,
                json: true,
            };


            const resBody = await rp(options);
            console.log('[In Then My Wallet]->' + JSON.stringify(resBody));
            assert.equal(email, resBody.userEmailAddr);
            assert.equal(amount, resBody.walletBalance);
                   
                  
                    // try {
                    //     const esResBody = await rp(options);
                    //     res.status(200).json(esResBody);

            // await request.get(options, (err, res, body) => {
            //     console.log('In Then My Wallet-->' + JSON.stringify(res) + ' ||||| ' + JSON.stringify(body));
            //     if (res.body) {
            //         assert.equal(email, res.body.userEmailAddr);
            //         assert.equal(amount, body.walletBalance);
            //     }

            // });

    

        });
});