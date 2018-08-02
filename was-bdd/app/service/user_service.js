/**
 * Provide API end points on managing user
 */
'use strict';
const rp = require('request-promise');
const request = require('request');
const sleep = require('thread-sleep');


module.exports = (app, es) => {
    const url = `http://${es.host}:${es.port}/${es.was_index}/users`;

    /**
     * To create new user
     * curl -X POST http://BaseURL/api/users
     * body : 
     *    { userBody}
     */

    app.post('/api/users', async (req, res) => {
        //console.log('--->' + JSON.stringify(req.body));
        //res.status(201).json({'sdf':'hihi'});
        console.log('[1. In App Post]->Attempt to create new user with email->' + req.body.userEmailAddr);

        let emailAddr = req.body.userEmailAddr;
        await searchUserByEmailAddr(emailAddr, (err, userObj) => {
            if (err) {
                rp.post({
                        url,
                        body: req.body,
                        json: true
                    })
                    .then(esResBody => {
                        console.log(`[2. In App Post]---->${JSON.stringify(esResBody)}`)
                        // sleep(250);
                        if (esResBody.result == "created") {
                            let successResult = {};
                            successResult.message = "User created";
                            successResult.userid = esResBody._id;
                            successResult.userEmailAddr = emailAddr;
                            res.status(201).json(successResult);
                        }

                    })
                    .catch(({
                        error
                    }) => res.status(error.status || 502).json(error));
            } else  {
                console.log(`[3. In App Post] User Exists Error->${JSON.stringify(userObj)}`);
                res.status(401).json({
                    error: 'User Exists Error'
                });
            }
        })

    });

    const searchUserByEmailAddr = (emailAddr, userSearchHandler) => {
        //console.log('Searching users base on email addres->' + emailAddr);
        const searchURL = url + `/_search?q=userEmailAddr:"${emailAddr}"`;
        console.log('[1. In Search By User Email] Search User By Email Addr URL' + searchURL);

        const options = {
            url: searchURL,
            json: true,
        }
        try {
            let userObj = null;
            request(options, (err, res, body) => {
                if (body.hits.total == 1) {
                    userObj = body.hits.hits[0]._source;
                    console.log(`[2. In Search By User Email - Internal]->${JSON.stringify(userObj)}`);
                    userSearchHandler(null, userObj)
                } else if (body.hits.total == 0) {
                    userSearchHandler(new Error(`User email ${emailAddr} not found Error`));
                }
            });
        } catch (error) {
            console.error('Search User User Error->' + error);
        }
    };

    /**
     * To search user with given userEmailAddr
     */
    app.get('/api/users/search/email/:usrEmailAddr', async (req, res) => {
       await searchUserByEmailAddr(req.params.usrEmailAddr, (err, userObj) => {
           console.log(`[1. API-Search] ${req.params.usrEmailAddr} ${err} ${userObj}`);
            if (err) {
                let error = {};
                error.code = 'user.not.found.error';
                error.message = `user ${req.params.usrEmailAddr} not found!`;
                console.log(`[2. API-Search], throw User ${req.params.usrEmailAddr} not Found Error`);
                res.status(401).json(error);
            } else {
                console.log(`[3. API-Search] return userObj->${JSON.stringify(userObj)}`);
                res.status(200).json(userObj);
            }
        });
    });

    /**
     * To perform initialization, to delete all users
     */
    app.delete('/api/users/_delete_all', async (req, res) => {
        const deleteURL = url + '/_delete_by_query?conflicts=proceed&pretty';
        const deleteAllReqBody = {
            query: {
                match_all: {}
            }
        }

        const options = {
            url: deleteURL,
            body: deleteAllReqBody,
            json: true,
        }
        try {
             const deleteResp =   await rp.post(options);
             const successResp = {};
             successResp.totalRecordDeleted = deleteResp.deleted;
             console.log('[In App Delete], success delete user record->' + JSON.stringify(successResp));
             res.status(200).json(successResp);
        } catch (esResErr) {
            console.log('[In App Delete], delete user error->' + JSON.stringify(esResErr));
            res.status(esResErr.statusCode || 502).json(esResErr.error);
        }

    });

  

};