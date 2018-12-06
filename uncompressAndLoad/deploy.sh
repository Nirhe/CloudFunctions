gcloud beta functions deploy  uncompressAndLoad \
    --runtime nodejs6 \
    --env-vars-file env.yml \
    --trigger-bucket <gcs file bucket> \
    --entry-point decompressCSV \
    --source ./cloudFunction
