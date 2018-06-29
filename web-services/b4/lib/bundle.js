/**
 * Provide API end points on managing Bundle
 */
'use strict';
const rp = require('request-promise');

module.exports = (app, es) => {
    const url = `http://${es.host}:${es.port}/${es.bundles_index}/bundle`;

    /**
     * To create new Bundle
     * curl -X POST http://BaseURL/api/bundle?name=<name>
     * BUNDLE ID =  wvz9NWQB1rX-nD7If6gR - myBundle
     */

    app.post('/api/bundle', (req, res) => {
        const bundle = {
            name: req.query.name || '',
            books: [],
        };

        rp.post({
                url,
                body: bundle,
                json: true
            })
            .then(esResBody => res.status(201).json(esResBody))
            .catch(({
                error
            }) => res.status(error.status || 502).json(error));
    });


    /**
     * Retrieve a given bundle
     * curl http://<host>:<port>/api/bundle/<id>
     */
    app.get('/api/bundle/:id', async (req, res) => {

        console.log('Attemp to get Book Bundle->' + req.params.id);
        const options = {
            url: `${url}/${req.params.id}`,
            json: true,
        };

        try {
            const esResBody = await rp(options);
            res.status(200).json(esResBody);
        } catch (esResErr) {
            res.status(esResErr.statusCode || 502).json(esResErr.error);
        }
    });

    /**
     * Set the specific bundle's name with the specific name
     * curl -X PUT https://baseURL/api/bundle/<id>/name/<name>
     */
    app.put('/api/bundle/:id/name/:name', async (req, res) => {
        console.log(`Attemp to rename book bundle id->${req.params.id} to new name ${req.params.name}`);
        const bundleURL = `${url}/${req.params.id}`;
        const options = {
            url: bundleURL,
            json: true,
        }

        try {
            const bundle = (await rp(options))._source;
            bundle.name = req.params.name;

            options.body = bundle;
            const esResBody = await rp.put(options);
            res.status(200).json(esResBody);

        } catch (esResErr) {
            res.status(esResErr.statusCode || 502).json(esResErr.error);
        }
    });

    /**
     * Put a book into a bundle by its id
     * curl -X PUT http://baseURL/api/bundle/<id>/book/<pgid>
     */
    app.put('/api/bundle/:id/book/:pgid', async (req, res) => {
        const bundleURL = `${url}/${req.params.id}`;
        const bookUrl = `http://${es.host}:${es.port}` +
            `/${es.books_index}/book/${req.params.pgid}`;

        try {
            const [bundleRes, bookRes] = await Promise.all([
                rp({
                    url: bundleURL,
                    json: true
                }),
                rp({
                    url: bookUrl,
                    json: true
                }),
            ])

            const {
                _source: bundle,
                _version: version
            } = bundleRes;
            const {
                _source: book
            } = bookRes;

            const idx = bundle.books.findIndex(book => book.id == req.params.pgid);

            if (idx === -1) {
                bundle.books.push({
                    id: book.id,
                    title: book.title,
                });
            }

            const esResBody = await rp.put({
                url: bundleURL,
                qs: {
                    version
                },
                body: bundle,
                json: true,
            })

            res.status(200).json(esResBody);

        } catch (esResErr) {
            res.status(esResErr.statusCode || 502).json(esResErr.error);
        }
    });



    /**
     * Remove a book into a bundle by its id
     * curl -X DELETE http://baseURL/api/bundle/<id>/book/<pgid>
     */
    app.delete('/api/bundle/:id/book/:pgid', async (req, res) => {
        const bundleUrl = `${url}/${req.params.id}`;
    
        try {
    
          const {_source: bundle, _version: version} =
            await rp({url: bundleUrl, json: true});
    
          const idx = bundle.books.findIndex(book => book.id == req.params.pgid);
          if (idx === -1) {
            throw {
              statusCode: 409,
              error: {
                reason: 'Conflict - Bundle does not contain that book.',
              }
            };
          }
    
          bundle.books.splice(idx, 1);
    
          const esResBody = await rp.put({
            url: bundleUrl,
            qs: { version },
            body: bundle,
            json: true,
          });
          res.status(200).json(esResBody);
        } catch (esResErr) {
          res.status(esResErr.statusCode || 502).json(esResErr.error);
        }
      });

    /**
     * Delete a bundle entirely
     * curl -X DELETE http://<host>:<port>/api/bundle/<id>
     */
    app.delete('/api/bundle/:id', async (req, res) => {
        const bundleURL = `${url}/${req.params.id}`;
        const options = {
            url: bundleURL,
            json: true,
        }
        try {
            const bundleRes = await (rp.delete(options));
            res.status(200).json(bundleRes);
        } catch (esResErr) {
            res.status(esResErr.statusCode || 502).json(esResErr.error);
        }
    })


};