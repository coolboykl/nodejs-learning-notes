'use strict';
const cheerio = require('cheerio');

module.exports = rdf => {
    const $ = cheerio.load(rdf);

    const book = {};
    book.id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', '');
    book.title = $('dcterms\\:title').text();
    book.authors = $('pgterms\\:agent pgterms\\:name').toArray().map(elem => $(elem).text());

  
    book.subjects = $('[rdf\\:resource$="/LCSH"]').parent()
        .find('rdf\\:value')
        .toArray().map(elem => $(elem).text());

    book.lcc = $('[rdf\\:resource$="/LCC"]').parent()
        .find('rdf\\:value').text();


    book.downloads = $('dcterms\\:hasFormat')
        .toArray().map(elem => {
            let downloadObj = {};
            downloadObj.url = $(elem).find('pgterms\\:file').attr('rdf:about');
            downloadObj.type = $(elem).find('rdf\\:value').text();
            return downloadObj;
        }); 


    return book;
};
