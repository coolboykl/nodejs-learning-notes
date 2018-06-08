'use strict';

const chai = require('chai');
const fs = require('fs');
const expect = chai.expect;
const sensorParser = require('../lib/sensorCSVParser.js');
const pumpCSV = fs.readFileSync(`${__dirname}/mixpump_apr2018_setC.csv`);

describe('mixpumpParser parsing mixpump_apr2018_setC data', () => {
    const summaryData = sensorParser(pumpCSV);
    //console.log('npm test->' + JSON.stringify(summaryData));

    it('should be a function', () => {
        expect(sensorParser).to.be.a('function');
    });

    it('should parse mixpump csv file', () => {
       
        expect(summaryData).to.be.an('object');
        expect(summaryData).to.have.a.property('summary')
              .that.is.an('array');

        // First Data should be with Status 0, startime at 2018-04-14 15:26:41, 
    });

    it('checking the first record', () => {
        expect(summaryData.summary[0]).to.have.a.property('startTime')
            .that.is.an('string')
            .and.contains('2018-04-14 15:26:41');
    })
});

    //     const book = parseRDF(rdf);
    //     expect(book).to.be.an('object');
    //     expect(book).to.have.a.property('id', 132);
    //     expect(book).to.have.a.property('title','The Art of War');

    //     expect(book).to.have.a.property('authors')
    //         .that.is.an('array').with.lengthOf(2)
    //         .and.contains('Sunzi, active 6th century B.C.')
    //         .and.contains('Giles, Lionel');

    //     expect(book).to.have.a.property('subjects')
    //         .that.is.an('array').with.lengthOf(2)
    //         .and.contains('Military art and science -- Early works to 1800')
    //         .and.contains('War -- Early works to 1800');

    //     expect(book).to.have.a.property('lcc')
    //         .that.is.an('string')
    //         .and.contains(book.lcc.toUpperCase());
    //     expect(['I', 'O', 'W','X','Yaq']).not.to.be.containing(book.lcc);

    //     expect(book).to.have.a.property('downloads')
    //         .that.is.an('array').with.lengthOf(10)
    // })
// });