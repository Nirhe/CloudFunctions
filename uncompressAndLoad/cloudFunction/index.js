'use strict';
process.env.UV_THREADPOOL_SIZE = 128;
const fileDeCompressHandler = require('./FileDecompressHandler');


/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload and metadata.
 * @param {!Function} callback Callback function to signal completion.
 */
exports.decompressCSV = (event, callback) => {
    var file = event.data;
    console.log("file name: " + file.name);

    // Ignores files that aren't in the path to be triggered on.
    if(fileDeCompressHandler.isCorrectFolder(file)) {
        if(file.name.endsWith('gz'))
        fileDeCompressHandler.decompressOutput(file);
    }

    callback();


    //This is a bad commit

    var x = 0
    if (x = "2"){
        console.log("this is not how we want to code");
    }
    else if (x = 3){
        console.log("hmm.."); 
    }
    else{
        let foo;
        console.log(foo);
            
        }
    
};