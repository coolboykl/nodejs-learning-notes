'use strict';
const cheerio = require('cheerio');

module.exports = rdf => {
    const $ = cheerio.load(rdf);

    const book = {};
    // To parse <pgterms:ebook rdf:about="ebooks/132">
    book.id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', '');

    // To parse <dcterms:title>The Art of War</dcterms:title>
    book.title = $('dcterms\\:title').text();

    // To parse <pgterms:agent rdf:about="2009/agents/4349">
    //   <pgterms:name>Sunzi, active 6th century B.C.</pgterms:name>
    //  <pgterms:agent rdf:about="2009/agents/5101">
    // <pgterms:name>Giles, Lionel</pgterms:name>
    // console.log('--> ' + $('pgterms\\:agent  pgterms\\:name').toArray());
    book.authors = $('pgterms\\:agent pgterms\\:name').toArray().map(elem => $(elem).text());

    // Next, needs to parse the Book's subject
    // <dcterms:subject>
    //       <rdf:Description rdf:nodeID="Nc9d074c5f1ee4d4e90e8e5fb40fdfec9">
    //       <dcam:memberOf rdf:resource="http://purl.org/dc/terms/LCSH"/>
    //       <rdf:value>Military art and science -- Early works to 1800</rdf:value>
    //     </rdf:Description>
    //   </dcterms:subject>
    // <dcterms:subject>
    //   <rdf:Description rdf:nodeID="N8ce3250be4cd48cd843f5103495d5110">
    //     <dcam:memberOf rdf:resource="http://purl.org/dc/terms/LCSH"/>
    //     <rdf:value>War -- Early works to 1800</rdf:value>
    //   </rdf:Description>
    // </dcterms:subject>
    book.subjects = $('[rdf\\:resource$="/LCSH"]').parent()
        .find('rdf\\:value')
        .toArray().map(elem => $(elem).text());
    // .toArray().map(elem => {
    //     const testSubject = {};
    //     testSubject.subj = $(elem).text();
    //      return testSubject;
    // } );


    // <dcterms:subject>
    //   <rdf:Description rdf:nodeID="N9f03cc83783541fe80527da01a1c0f3f">
    //     <rdf:value>U</rdf:value>
    //     <dcam:memberOf rdf:resource="http://purl.org/dc/terms/LCC"/>
    //   </rdf:Description>
    // </dcterms:subject>
    book.lcc = $('[rdf\\:resource$="/LCC"]').parent()
        .find('rdf\\:value').text();

    // To parse downloads source
    //    <dcterms:hasFormat>
    //   <pgterms:file rdf:about="http://www.gutenberg.org/ebooks/132.html.images">
    //     <dcterms:extent rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">375823</dcterms:extent>
    //     <dcterms:modified rdf:datatype="http://www.w3.org/2001/XMLSchema#dateTime">2017-10-01T01:21:56.440639</dcterms:modified>
    //     <dcterms:isFormatOf rdf:resource="ebooks/132"/>
    //     <dcterms:format>
    //       <rdf:Description rdf:nodeID="Nc9a4da7c30a44625b3399078ea8a0221">
    //         <rdf:value rdf:datatype="http://purl.org/dc/terms/IMT">text/html</rdf:value>
    //         <dcam:memberOf rdf:resource="http://purl.org/dc/terms/IMT"/>
    //       </rdf:Description>
    //     </dcterms:format>
    //   </pgterms:file>
    // </dcterms:hasFormat>
    book.downloads = $('dcterms\\:hasFormat')
        .toArray().map(elem => {
            let downloadObj = {};
            downloadObj.url = $(elem).find('pgterms\\:file').attr('rdf:about');
            downloadObj.type = $(elem).find('rdf\\:value').text();
            return downloadObj;
        }); 

    return book;
};