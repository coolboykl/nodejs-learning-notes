"use strict";

const csvParse = require("csv-parse/lib/sync");
const DurationParser = require("duration");

module.exports = (rawCSVData, col = 1) => {
  const parsedRecordObj = {};
  const recordList = [];
  let startTimeStr = "";
  let endTimeStr = "";
  let rawDataFlag = -1;
  const csvParseOption = {
    cast_date: true,
    from: 2,
    trim: true
  };

  try {
    let rawDataArray = csvParse(rawCSVData, csvParseOption);
    // console.log('#### col -> ' + col);
    rawDataFlag = rawDataArray[0][col];
    startTimeStr = rawDataArray[0][0];
    endTimeStr = "";
    for (let index = 0; index < rawDataArray.length; index++) {
      let rawData = rawDataArray[index];
      // console.log('Time->' + rawData[0]);
      if (rawDataFlag !== rawData[col] && rawData[col] != "") {
        endTimeStr = rawData[0];
        let startTime = new Date(startTimeStr);
        let endTime = new Date(endTimeStr);
        let duration = new DurationParser(startTime, endTime);
        let record = {};
        record.status = rawDataFlag;
        record.startTime = startTimeStr;
        record.endTime = endTimeStr;
        record.duration =
          duration.day + ":" + duration.hour + ":" + duration.minute;
        recordList.push(record);
        //console.log(JSON.stringify(record));
        //console.log(rawDataFlag + `,` + startTimeStr + ',' + endTimeStr + ',' + duration.day + ':' + duration.hour + ':' + duration.minute);
        rawDataFlag = rawData[col];
        startTimeStr = rawData[0];
      }
    }
  } catch (error) {
    console.log(`Error parsing data, startTime->${startTimeStr}, endTime->${endTimeStr}...`);

  }
  parsedRecordObj.summary = recordList;
  return parsedRecordObj;
};