#!/usr/bin/env bash
# get node id
nodeId=$(curl -s localhost:9200/_nodes/_local/name?pretty|sed '4q;d'|sed -n 's/.*"\(.*\)".*/\1/p')

addNodeToExclusionFilter(){
  # get current excluded ids
  excludedIds=$(curl -s localhost:9200/_cluster/settings?pretty|sed -n '/_id/{p;q;}'|sed -n 's/.*: "\(.*\)".*/\1/p')
  # update excluded ids variable
  if [[ $excludedIds != *$nodeId* ]]; then
    excludedIds=$excludedIds,$nodeId
    # update excluded id settings
    curl -XPUT localhost:9200/_cluster/settings?pretty -H 'Content-Type: application/json' -d"
    {
      \"transient\" : {
        \"cluster.routing.allocation.exclude._id\" : \"$excludedIds\"
      }
    }
    "
  fi
}
addNodeToExclusionFilter

# wait for doc count goes down to 0
while : ; do
    docCnt=$(curl -s localhost:9200/_nodes/_local/stats/indices/docs?pretty|sed -n '/count/{p;q;}'|sed -n 's/.*\"count" :\(.*\),.*/\1/p')
    echo $docCnt
    [[ $docCnt -gt 0 ]] || break
    addNodeToExclusionFilter
    sleep 2
done
