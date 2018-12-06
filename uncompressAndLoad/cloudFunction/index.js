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
};