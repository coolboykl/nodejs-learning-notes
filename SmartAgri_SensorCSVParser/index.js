'use strict';

const fs = require('fs');
const program = require('commander');
const pkg = require('./package.json');
const sensorCSVParser = require('./lib/sensorCSVParser');

program
    .version(pkg.version)
    .description(pkg.description)
    .option('-f, --filter [filter]', 'to filter the seson on/off data')
    .command('input <inputfile>')
    .description('sensor on-off data in csv file to parse.')
    .action( (inputfile) => {
        console.log(`Parsing sensor file =>` + inputfile + ',with filter ->' + program.filter);
        let csvfile = fs.readFileSync(inputfile);
        sensorCSVParser(csvfile, program.filter);
    });
program.parse(process.argv); 

