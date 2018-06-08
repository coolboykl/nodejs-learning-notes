'use strict';

const csvParse = require('csv-parse');
const DurationParser = require('duration');

module.exports = (rawCSVData, sensorFilter) => {

    var summaryData = {};
    var recordList = [];
    const csvParseOption = {
        cast_date: true,
        from: 2,
        trim: true
    }

   csvParse(rawCSVData, csvParseOption, (err, rawDataArray) => {

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
        summaryData.summary = recordList;
        for(var i = 0; i< recordList.length; i++) {
            if(sensorFilter && sensorFilter === recordList[i].status) {
                console.log(recordList[i].status + ',' + recordList[i].startTime + ',' + recordList[i].endTime + ',' + recordList[i].duration);
            } else if(!sensorFilter) {
                console.log(recordList[i].status + ',' + recordList[i].startTime + ',' + recordList[i].endTime + ',' + recordList[i].duration);
            }
        }
      
    });
    return summaryData;
}