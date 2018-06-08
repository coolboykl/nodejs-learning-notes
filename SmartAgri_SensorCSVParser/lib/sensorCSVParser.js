'use strict';

const csvParse = require('csv-parse/lib/sync');
const DurationParser = require('duration');

module.exports = (rawCSVData) => {

    const parsedRecordObj = {};
    const recordList = [];
    const csvParseOption = {
        cast_date: true,
        from: 2,
        trim: true
    }

    let rawDataArray = csvParse(rawCSVData, csvParseOption);
    // console.log('####->' + rawDataArray);
    let rawDataFlag = rawDataArray[0][1];
    let startTimeStr = rawDataArray[0][0];
    let endTimeStr = '';
    for (let index = 0; index < rawDataArray.length; index++) {
        let rawData = rawDataArray[index];
        if (rawDataFlag !== rawData[1]) {
            endTimeStr = rawData[0];
            let startTime = new Date(startTimeStr);
            let endTime = new Date(endTimeStr);
            let duration = new DurationParser(startTime, endTime);
            let record = {};
            record.status = rawDataFlag;
            record.startTime = startTimeStr;
            record.endTime = endTimeStr;
            record.duration = duration.day + ':' + duration.hour + ":" + duration.minute;
            recordList.push(record);
            //console.log(JSON.stringify(record));
            //console.log(rawDataFlag + `,` + startTimeStr + ',' + endTimeStr + ',' + duration.day + ':' + duration.hour + ':' + duration.minute);
            rawDataFlag = rawData[1];
            startTimeStr = rawData[0];
        }
    }
    parsedRecordObj.summary = recordList;
    return parsedRecordObj;
}