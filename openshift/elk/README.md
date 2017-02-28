# ELK Cluster on OpenShift

##Overview
This folder contains following files to facilitate deploying ELK cluster to OpenShift

* an instant-app template to generate OpenShift artifacts
* customized ELK docker images runnable on OpenShift

The ELK has these features
* Logstash [HTTP input](https://www.elastic.co/blog/introducing-logstash-input-http-plugin) for client browser-side logging
* Logstash [syslog input](https://www.elastic.co/guide/en/logstash/2.4/plugins-inputs-syslog.html) for internal server-side logging
* scalable Elasticsearch cluster
* local ephemeral storage for Elasticsearch data to improve performance. Performance of OpenShift GlusterFS persistent volume has been found unacceptable to hold search index, as supported by this [Elasticsearch blog](https://www.elastic.co/blog/performance-considerations-elasticsearch-indexing)
* configurable data lifespan, by default 3 months
* daily backup of Elasticsearch data to persistent storage with 7-day retention
* uses nginx to proxy Logstash input and Kibana with following access controls
  * basic authentication for Kibana
  * customizable client ip filter rules for Kibana
  * allow only POST request to Logstash input
  * CORS support for Logstash input with configurable Access-Control-Allow-Origin
* based on official docker images from respective product vendor 

##Deployment

###Prerequisites 
The prerequisites of the deployment are

* minimum edit access to a project of OpenShift origin 1.3 or compatible cluster. This implies you know and have access to following URL end points
  * OpenShift console, commands below defaults to https://console.pathfinder.gov.bc.ca:8443/console/ 
  * OpenShift docker registry, commands below defaults to docker-registry.pathfinder.gov.bc.ca
* has following software installed on the deployment client
  * git
  * docker. This further implies you have the provisioning tools such as docker machine installed on non-linux clients and started by executing, for example 
  
    ```
    docker-machine start
    docker-machine env
    # Following the output instruction, for example run this command to configure your shell:
    eval $(docker-machine env)
    ```
  * [oc](https://docs.openshift.com/container-platform/latest/cli_reference/get_started_cli.html)

###Procedure
The deployment consists of these steps

1. deploy template

   ```sh
   $ git clone https://github.com/bcgov/MyGovBC-msp.git
   $ cd MyGovBC-msp
   $ oc login -u <username> https://console.pathfinder.gov.bc.ca:8443
   $ oc project <yourprojectname>
   $ oc create -f openshift/elk/templates/elk.yaml
   ```
   After this step you will find an instant app template called *elk* available in the project
2. create OpenShift instant app. You can do so by clicking *elk* template from *Add to Project* in web console (preferred) or, if you accept default values for all parameters, by running

   ```sh
   $ oc process elk|oc create -f-
   ```  
   
3. deploy docker image

   ```sh
   $ docker login  -u <username> -p `oc whoami -t` docker-registry.pathfinder.gov.bc.ca
   $ docker build -t os-elasticsearch openshift/elk/docker-images/elastic-search
   $ docker tag os-elasticsearch docker-registry.pathfinder.gov.bc.ca/<yourprojectname>/os-elasticsearch
   $ docker push docker-registry.pathfinder.gov.bc.ca/<yourprojectname>/os-elasticsearch
   $ docker build -t os-logstash openshift/elk/docker-images/logstash
   $ docker tag os-logstash docker-registry.pathfinder.gov.bc.ca/<yourprojectname>/os-logstash
   $ docker push docker-registry.pathfinder.gov.bc.ca/<yourprojectname>/os-logstash
   $ docker build -t os-kibana openshift/elk/docker-images/kibana
   $ docker tag os-kibana docker-registry.pathfinder.gov.bc.ca/<yourprojectname>/os-kibana
   $ docker push docker-registry.pathfinder.gov.bc.ca/<yourprojectname>/os-kibana
   $ docker build -t elk-nginx openshift/elk/docker-images/nginx
   $ docker tag elk-nginx docker-registry.pathfinder.gov.bc.ca/<yourprojectname>/elk-nginx
   $ docker push docker-registry.pathfinder.gov.bc.ca/<yourprojectname>/elk-nginx
   $ docker build -t elk-cron openshift/elk/docker-images/cron
   $ docker tag elk-cron docker-registry.pathfinder.gov.bc.ca/<yourprojectname>/elk-cron
   $ docker push docker-registry.pathfinder.gov.bc.ca/<yourprojectname>/elk-cron
   ```

4. Wait for the first Elasticsearch pod to be fully up, then scale up the cluster to 5 pods (or more). If doing so too soon, contention may arise between the pods vying to be the first and sole master.   

If everything goes well, you will be able to access the Logstash http endpoint provided in the Overview page of OpenShift project for log collection and kibana URL for reporting dashboard.

## Elasticsearch Cluster Operation

### Data Integrity 
Because Elasticsearch data is on ephemeral storage, due care is needed to avoid bringing down or corrupt the cluster. By default each piece of data has 1 replica (i.e. 2 copies on separate pods). Number of replicas can be adjusted for [existing indices](https://www.elastic.co/guide/en/elasticsearch/guide/current/replica-shards.html) and for future created indices via [templates](http://stackoverflow.com/questions/24553718/updating-the-default-index-number-of-replicas-setting-for-new-indices).

 Assuming the replica is *N*, then if *N+1* or more pods are taken down in a short period such that the cluster doesn't have enough time to recover in between, partial data loss may occur. Therefore only scale down no more than *N* pods at a time and leave enough recovery window for the next.
 
### Pod Count
Although Elasticsearch cluster can survive under as few as one pod, to maintain a healthy resilient cluster following factors needs to be taken into account to determine minimum pod count

  1. no less than *N+1* for a replica of *N*
  2. expected load
  3. if data volume is large and the number of OpenShift hosts is limited, the pod count should be equal, or a multiple of,  OpenShift host count in order to distribute data more or less evenly among the hosts
  4. quota

### Persistent Volume Claim Mount Check And Fix
All pods connect to a PVC mounted at `/var/backups` for nightly backup. If any of the pods lost the connection, backup will fail. By design this shouldn't happen as there is a liveness probe for this PVC mount and the pod is killed if the liveness check fails. However, in case the problem happens, it is manifested in the log of pod `elk-cron` if the last backup contains something like

```
+ curl -sXDELETE 'http://elasticsearch:9200/_snapshot
/my_backup/snapshot_2?pretty'
{"acknowledged":true}{"error":{"root_cause":[{"type
":"repository_verification_exception",
"reason":"[my_backup] [jtzho-ALS-644Z-DeA2p0g, 
'RemoteTransportException[[Exploding Man][172.51.40
.51:9300][internal:admin/repository/verify]]; nested: 
ElasticsearchException[failed to create blob container];
nested: NotSerializableExceptionWrapper
[file_system_exception: /var/backups/my_backup: 
Transport endpoint is not connected];'], 
...
```
If you see such error message, login to the console of each elasticsearch container and  issue command `ls /var/backups`. If you see
```
ls: cannot access /var/backups: Transport endpoint is not connected
```
then kill the pod. You need to go through each pod. When killing a pod, make sure to leave enough recovery window from last kill, as mentioned before.

### Cluster Recovery
If Elasticsearch cluster is crashed, data can be restored from the most recently nightly backup. But data from last backup till now is lost permanently. To restore,

1. Deploy a new empty cluster by following the procedure above. Disable the route to disallow input.
2. Login to a Elasticsearch pod by running `oc exec -it <pod_name> bash`. In the pod run following commands

  ```
  $ # register backup repo
  $ curl -XPUT 'http://localhost:9200/_snapshot/my_backup' -d '{
      "type": "fs",
      "settings": {
          "location": "my_backup",
          "compress": true
      }
  }'
  $
  $ # close all indices
  $ curl -XPOST 'localhost:9200/_all/_close?pretty'
  $
  $ # restore; replace <most_recent_snapshot_id> with 
  $ # most recent snapshot id in /var/backups/my_backup/
  $ # this is usually the week day id of today or yesterday.
  $ curl -XPOST 'localhost:9200/_snapshot/my_backup/snapshot_<most_recent_snapshot_id>/_restore?pretty&wait_for_completion'
  $
  $ # re-open all indices
  $ curl -XPOST 'localhost:9200/_all/_open?pretty'
  ```
3. re-enable the route
