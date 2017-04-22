#!/usr/bin/env bash
# get node id
nodeId=$(curl -s localhost:9200/_nodes/_local/name?pretty|sed '4q;d'|sed -n 's/.*"\(.*\)".*/\1/p')
# get current excluded ids
excludedIds=$(curl -s localhost:9200/_cluster/settings?pretty|sed -n '/_id/{p;q;}'|sed -n 's/.*: "\(.*\)".*/\1/p')
# update excluded ids variable
excludedIds=$excludedIds,$nodeId
# update excluded id settings
curl -XPUT localhost:9200/_cluster/settings?pretty -H 'Content-Type: application/json' -d"
{
  \"transient\" : {
    \"cluster.routing.allocation.exclude._id\" : \"$excludedIds\"
  }
}
"
docCnt=1
while [ $docCnt -gt 0 ]
do
echo $docCnt
sleep 2
#get current doc count on local node
docCnt=$(curl -s localhost:9200/_nodes/_local/stats/indices/docs?pretty|sed -n '/count/{p;q;}'|sed -n 's/.*\"count" :\(.*\),.*/\1/p')
done
