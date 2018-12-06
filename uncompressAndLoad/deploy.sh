gcloud beta functions deploy  uncompressAndLoad \
    --runtime nodejs6 \
    --env-vars-file env.yml \
    --trigger-bucket dataflowdirectory \
    --entry-point decompressCSV \
    --source ./cloudFunction
