'use strict';

const fs = require('fs');
const program = require('commander');
const pkg = require('./package.json');
const sensorCSVParser = require('./lib/sensorCSVParser');

program
    .version(pkg.version)
    .description(pkg.description)
    .option('-f, --filter [filter]', 'to filter the seson on/off data')
    .option('-c --col [col]', 'column to parse, column number always start with 1')
    .command('input <inputfile>')
    .description('sensor on-off data in csv file to parse.')
    .action((inputfile) => {
        //console.log(`Parsing sensor file =>` + inputfile + ',with filter ->' + program.filter + ',col-> ' + program.col);
        let csvfile = fs.readFileSync(inputfile);
        let parseRecordObj = null;
        if (program.col) {
            parseRecordObj = sensorCSVParser(csvfile, program.col - 1);
        } else {
            parseRecordObj = sensorCSVParser(csvfile);
        }
        // User enter's col always start with 1, but in node, our col always start wih 0
        //console.log(JSON.stringify(parseRecordOb));

        for (var index in parseRecordObj.summary) {
            var sensorData = parseRecordObj.summary[index];

            if (sensorData.status != '') {
                if (program.filter && program.filter === sensorData.status) {
                    console.log(sensorData.status + ',' + sensorData.startTime + ',' + sensorData.endTime + ',' + sensorData.duration);
                } else if (!program.filter) {
                    console.log(sensorData.status + ',' + sensorData.startTime + ',' + sensorData.endTime + ',' + sensorData.duration);

                }
            }
        }
    });
program.parse(process.argv);