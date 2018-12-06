'use strict';
const google = require('googleapis');
var fs = require('fs');
var zlib = require('zlib');
var request = require('request');
const BigQuery = require('@google-cloud/bigquery');
const Storage = require('@google-cloud/storage');




// Instantiates clients
const bigquery = new BigQuery({
    projectId: process.env.PROJECT_ID
});



exports.isCorrectFolder = function (file) {
    var fileName = file.name.substr(file.name.lastIndexOf('/')).toLowerCase().trim();
    var filePath = file.name.substr(0, file.name.lastIndexOf('/')).trim();
    var targetPaths = process.env.TRIGGER_FILE_PATHS.trim().split(',');

    for(var i = 0; i < targetPaths.length; i++){
        var targetPath = targetPaths[i].replace(`gs://${file.bucket}/`,'').trim();
        if(filePath == targetPath && fileName.includes('sales_forecast')) {
            return true;
        }
    }
    return false;
}



exports.decompressOutput = function(file){

    var storage = new Storage({projectId: process.env.PROJECT_ID});
    var tableId = getTableID(file);

    const metadata = {
        sourceFormat: 'CSV',
        skipLeadingRows: 1,
        autodetect: true,
        writeDisposition: 'WRITE_APPEND',
        fieldDelimiter: ';',
        allowJaggedRows:'TRUE'
    };

// Loads data from a Google Cloud Storage file into the table
    bigquery
        .dataset(process.env.DATASET_ID)
        .table(tableId)
        .load(storage.bucket(file.bucket).file(file.name), metadata)
        .then(results => {
            const job = results[0];

            // load() waits for the job to finish
            console.log(`Job ${job.id} completed.`);

            // Check the job's status for errors
            const errors = job.status.errors;
            if (errors && errors.length > 0) {
                    throw errors;
                }
                else if (job.status.state == 'DONE') {
                console.log(`Data has been successfully stored in ${process.env.PROJECT_ID}:${process.env.DATASET_ID}.${tableId}.`);
            }}

        ).catch(err => {
             console.error(`Error storing data from '${file.bucket}/${file.name}' in ${process.env.PROJECT_ID}:${process.env.DATASET_ID}.${tableId}:`, err);
        });



}

function getTableID(file) {
    var fileName = (file.name.split('/')).pop();
    if(fileName.includes('daily')){
       return process.env.RELEX_OUTPUT_DAILY_TABLE_NAME;
    }
    else if (fileName.includes('weekly')){
        return process.env.RELEX_OUTPUT_WEEKLY_TABLE_NAME;
    }

    return process.env.RELEX_OUTPUT_TABLE_NAME;
}



