/**
 * Provide API end points on managing user
 */
'use strict';
const rp = require('request-promise');
const request = require('request');


const handleUserSearchRespose = (err, userObj) => {


};

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

        let emailAddr = req.body.userEmailAddr;
        searchUserByEmailAddr(emailAddr, (err, userObj) => {
            if (err) {
                console.log('Error->' + err);
                rp.post({
                        url,
                        body: req.body,
                        json: true
                    })
                    .then(esResBody => {
                        if (esResBody.result == "created") {
                            let successResult = {};
                            successResult.message = "User created";
                            successResult.userid = esResBody._id;
                            res.status(201).json(successResult);
                        }

                    })
                    .catch(({
                        error
                    }) => res.status(error.status || 502).json(error));
            } else {
                res.status(401).json({
                    error: 'User Exists Error'
                });
            }
        })

    });

    const searchUserByEmailAddr = (emailAddr, userSearchHandler) => {
        //console.log('Searching users base on email addres->' + emailAddr);
        const searchURL = url + `/_search?q=userEmailAddr:"${emailAddr}"`;
        //console.log('-->' + searchURL);

        const options = {
            url: searchURL,
            json: true,
        }
        try {
            let userObj = null;
            request(options, (err, res, body) => {
                if (body.hits.total == 1) {
                    userObj = body.hits.hits[0]._source;
                    //console.log(`---->${JSON.stringify(userObj)}`);
                    userSearchHandler(null, userObj)
                } else if (body.hits.total == 0) {
                    userSearchHandler(new Error('User Not found Error'));
                }
            });
        } catch (error) {
            console.error('Error->' + error);
        }
    };

    /**
     * To search user with given userEmailAddr
     */
    app.get('/api/users/search/email/:usrEmailAddr', (req, res) => {

        searchUserByEmailAddr(req.params.usrEmailAddr, (err, userObj) => {
            if (err) {
                 let error = {};
                error.code = 'user.not.found.error';
                error.message = `user ${req.params.usrEmailAddr} not found!`;
                res.status(401).json(error);
            } else {
                res.status(200).json(userObj);
            }
        });
    });

    /**
     * To perform initialization, to delete all users
     */
    app.delete('/api/users/_delete_all', async (req, res) => {
        const deleteURL = url + '/_delete_by_query';
        console.log('-->DeleteURL ->' + deleteURL);
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
             const deleteResp = await rp.post(options);
             const successResp = {};
             successResp.totalRecordDeleted = deleteResp.deleted;
             res.status(200).json(successResp);
        } catch (esResErr) {
            res.status(esResErr.statusCode || 502).json(esResErr.error);
        }

    });

    // /**
    //  * Set the specific bundle's name with the specific name
    //  * curl -X PUT https://baseURL/api/bundle/<id>/name/<name>
    //  */
    // app.put('/api/bundle/:id/name/:name', async (req, res) => {
    //     console.log(`Attemp to rename book bundle id->${req.params.id} to new name ${req.params.name}`);
    //     const bundleURL = `${url}/${req.params.id}`;
    //     const options = {
    //         url: bundleURL,
    //         json: true,
    //     }

    //     try {
    //         const bundle = (await rp(options))._source;
    //         bundle.name = req.params.name;

    //         options.body = bundle;
    //         const esResBody = await rp.put(options);
    //         res.status(200).json(esResBody);

    //     } catch (esResErr) {
    //         res.status(esResErr.statusCode || 502).json(esResErr.error);
    //     }
    // });

    // /**
    //  * Put a book into a bundle by its id
    //  * curl -X PUT http://baseURL/api/bundle/<id>/book/<pgid>
    //  */
    // app.put('/api/bundle/:id/book/:pgid', async (req, res) => {
    //     const bundleURL = `${url}/${req.params.id}`;
    //     const bookUrl = `http://${es.host}:${es.port}` +
    //         `/${es.books_index}/book/${req.params.pgid}`;

    //     try {
    //         const [bundleRes, bookRes] = await Promise.all([
    //             rp({
    //                 url: bundleURL,
    //                 json: true
    //             }),
    //             rp({
    //                 url: bookUrl,
    //                 json: true
    //             }),
    //         ])

    //         const {
    //             _source: bundle,
    //             _version: version
    //         } = bundleRes;
    //         const {
    //             _source: book
    //         } = bookRes;

    //         const idx = bundle.books.findIndex(book => book.id == req.params.pgid);

    //         if (idx === -1) {
    //             bundle.books.push({
    //                 id: book.id,
    //                 title: book.title,
    //             });
    //         }

    //         const esResBody = await rp.put({
    //             url: bundleURL,
    //             qs: {
    //                 version
    //             },
    //             body: bundle,
    //             json: true,
    //         })

    //         res.status(200).json(esResBody);

    //     } catch (esResErr) {
    //         res.status(esResErr.statusCode || 502).json(esResErr.error);
    //     }
    // });



    // /**
    //  * Remove a book into a bundle by its id
    //  * curl -X DELETE http://baseURL/api/bundle/<id>/book/<pgid>
    //  */
    // app.delete('/api/bundle/:id/book/:pgid', async (req, res) => {
    //     const bundleUrl = `${url}/${req.params.id}`;

    //     try {

    //       const {_source: bundle, _version: version} =
    //         await rp({url: bundleUrl, json: true});

    //       const idx = bundle.books.findIndex(book => book.id == req.params.pgid);
    //       if (idx === -1) {
    //         throw {
    //           statusCode: 409,
    //           error: {
    //             reason: 'Conflict - Bundle does not contain that book.',
    //           }
    //         };
    //       }

    //       bundle.books.splice(idx, 1);

    //       const esResBody = await rp.put({
    //         url: bundleUrl,
    //         qs: { version },
    //         body: bundle,
    //         json: true,
    //       });
    //       res.status(200).json(esResBody);
    //     } catch (esResErr) {
    //       res.status(esResErr.statusCode || 502).json(esResErr.error);
    //     }
    //   });

};