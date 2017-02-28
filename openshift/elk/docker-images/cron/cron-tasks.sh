#!/usr/bin/env bash
set -x
date
echo \$RETENTION_MONTH=$RETENTION_MONTH
curl -sXDELETE http://elasticsearch:9200/logstash-`date -d "-$((${RETENTION_MONTH-3} + 1)) month" +%Y.%m`*
curl -sXPUT 'http://elasticsearch:9200/_snapshot/my_backup' -d '{
    "type": "fs",
    "settings": {
        "location": "my_backup",
        "compress": true
    }
}'
curl -sXDELETE "http://elasticsearch:9200/_snapshot/my_backup/snapshot_`date +%u`?pretty"
curl -sXPUT "http://elasticsearch:9200/_snapshot/my_backup/snapshot_`date +%u`?wait_for_completion=true&pretty"
