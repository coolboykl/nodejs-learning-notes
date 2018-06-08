'use strict';

const chai = require('chai');
const fs = require('fs');
const expect = chai.expect;
const sensorParser = require('../lib/sensorCSVParser.js');

describe('parsing mixpump_apr2018_setC data without filter', () => {
    const pumpCSV = fs.readFileSync(`${__dirname}/mixpump_apr2018_setC.csv`);
    const parseRecordObj = sensorParser(pumpCSV);
    //console.log('npm test->' + JSON.stringify(parseRecordObj));

    it('should be a function', () => {
        expect(sensorParser).to.be.a('function');
    });

    it('should parse mixpump csv file', () => {
       
        expect(parseRecordObj).to.be.an('object');
        expect(parseRecordObj).to.have.a.property('summary')
              .that.is.an('array').with.lengthOf(8);
    });

    it('checking the first record, start time, end time, and duration', () => {
        var firstRecord = parseRecordObj.summary[0];
        expect(firstRecord).to.have.a.property('startTime')
            .that.is.an('string')
            .and.contains('2018-04-14 15:26:41');

        expect(firstRecord).to.have.a.property('duration')
            .that.is.an('string')
            .and.contains('0:16:38');
    })
});


describe('parsing mixpump_apr2018_setA', () => {
    const pumpCSV = fs.readFileSync(`${__dirname}/mixpump_apr2018_setA.csv`);
    const parseRecordObj = sensorParser(pumpCSV);
    //console.log('npm test->' + JSON.stringify(parseRecordObj));

    it('should parse mixpump csv file', () => {
       
        expect(parseRecordObj).to.be.an('object');
        expect(parseRecordObj).to.have.a.property('summary')
              .that.is.an('array').with.lengthOf(10);
    });

    it('checking the first record, start time, end time, and duration', () => {
        var firstRecord = parseRecordObj.summary[0];
        expect(firstRecord).to.have.a.property('startTime')
            .that.is.an('string')
            .and.contains('2018-04-09 00:10:34');

        expect(firstRecord).to.have.a.property('duration')
            .that.is.an('string')
            .and.contains('0:8:3');
    })
});
