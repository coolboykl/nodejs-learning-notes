/**
 * Provides API endpoints for searching the books index
 */
'use strict';
const request = require('request');
const rp = require('request-promise');
module.exports = (app, es) => {
    const esurl = `http://${es.host}:${es.port}/${es.books_index}/book/_search`;
    /**
     * Search for the books by matching a particular field value.
     * Example :/api/search/books/authors/Twain
     */
    app.get('/api/search/books/:field/:query', (req, res) => {
        console.log(`Searching books on ${req.params.field} ==  ${req.params.query} at ${esurl}`);
        const esReqBody = {
            size: 10,
            query: {
                match: {
                    [req.params.field]: req.params.query
                }
            },
        };

        const options = {
            url: esurl,
            json: true,
            body: esReqBody
        };

        console.log(`Searching books on ${req.params.field} ==  ${req.params.query} at ${esurl}`);
        console.log(' Option => ' + JSON.stringify(options));

        request.get(options, (err, esRes, esResBody) => {
            if (err) {
                res.status(502).json({
                    error: 'bad_gateway',
                    reason: err.code,
                });
                return;
            }
    
            if (esRes.statusCode != 200) {
                res.status(esRes.statusCode).json(esResBody);
                return;
            }
    
            res.status(200).json(esResBody.hits.hits.map(({_source}) => _source));
    
        });

    });

    
    /**
     * Example /api/suggest/authors/lipman
     */
    app.get('/api/suggest/:field/:query', (req, res) => {
        const esReqBody = {
            size: 0,
            suggest: {
                suggestions: {
                    text: req.params.query,
                    term: {
                        field: req.params.field,
                        suggest_mode: 'always',
                    },
                }
            }
           
        };


        rp({url:esurl, json: true, body: esReqBody})
            .then(esResBody => res.status(200).json(esResBody.suggest.suggestions))
            .catch(({error}) => res.status(error.status || 502).json(error));
        // const options = {url: esurl, json: true, body: esReqBody};
        // const promise = new Promise( (resolve, reject) => {
        //     request.get(options, (err, esRes, esResBody) => {
        //         if(err) {
        //             reject({error: err});
        //             return;
        //         }

        //         if(esRes.statusCode != 200) {
        //             reject({error: esResBody});
        //             return;
        //         }

        //         resolve(esResBody);
             
        //     });
        // });

        // promise
        //     .then(esResBody => res.status(200).json(esResBody.suggest.suggestions))
        //     .catch(({error}) => res.status(error.status || 502).json(error));
    });


};