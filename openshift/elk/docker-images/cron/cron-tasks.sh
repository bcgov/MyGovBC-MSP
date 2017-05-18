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

# snapshots
curl -sXDELETE "http://elasticsearch:9200/_snapshot/my_backup/snapshot_`date +%u`?pretty"
curl -sXPUT "http://elasticsearch:9200/_snapshot/my_backup/snapshot_`date +%u`?wait_for_completion=true&pretty"

# reset shard allocation filter
while : ; do
    relo=$(curl -s elasticsearch:9200/_cat/health|cut -f9 -d ' ')
    echo $relo
    [[ $relo -gt 0 ]] || break
    sleep 2
done
curl -sXPUT elasticsearch:9200/_cluster/settings?pretty -H 'Content-Type: application/json' -d'
{
  "transient" : {
    "cluster.routing.allocation.exclude._id" : ""
  }
}
'
