# ELK Cluster on OpenShift

## Overview
This folder contains following files to facilitate deploying ELK cluster to OpenShift

* an instant-app template to generate OpenShift artifacts
* customized ELK docker images runnable on OpenShift

The ELK has these features
* Logstash [HTTP input](https://www.elastic.co/blog/introducing-logstash-input-http-plugin) for client browser-side logging
* Logstash [syslog input](https://www.elastic.co/guide/en/logstash/2.4/plugins-inputs-syslog.html) on TCP and UDP port 5514 for internal project-scoped server-side logging
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

## Deployment

### Prerequisites 
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

### Procedure
The deployment consists of these steps

1. deploy template

   ```
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

   * If you are deploying for the first time, which usually to a dev environment/project, run

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
      you can also run above commands when you want to rebuild the images.
   * Otherwise, if you already have the images in the cluster and want to promote the images from one environment/project to another, say from dev env to test env, then you can deploy the images to the target environment/project through tagging
     ```
     $ oc tag <yourprojectname-dev>/os-elasticsearch:latest <yourprojectname-test>/os-elasticsearch:latest
     $ oc tag <yourprojectname-dev>/os-logstash:latest <yourprojectname-test>/os-logstash:latest
     $ oc tag <yourprojectname-dev>/os-kibana:latest <yourprojectname-test>/os-kibana:latest
     $ oc tag <yourprojectname-dev>/elk-nginx:latest <yourprojectname-test>/elk-nginx:latest
     $ oc tag <yourprojectname-dev>/elk-cron:latest <yourprojectname-test>/elk-cron:latest
     ```
     This ensures the images are binary identical across environments/projects.
   
4. Wait for the first Elasticsearch pod to be fully up, then scale up the cluster to 5 pods (or more). If doing so too soon, contention may arise between the pods vying to be the first and sole master.
5. Auto-scale Elasticsearch. Set min to # of pods brought up in last step.

If everything goes well, you will be able to access the Logstash http endpoint provided in the Overview page of OpenShift project for log collection and kibana URL for reporting dashboard.

## Elasticsearch Cluster Operation

### Data Integrity 
Because Elasticsearch data is on ephemeral storage, due care is needed to avoid bringing down or corrupt the cluster. By default each piece of data has 1 replica (i.e. 2 copies) on separate pods. Number of replicas can be adjusted for [existing indices](https://www.elastic.co/guide/en/elasticsearch/guide/current/replica-shards.html) and for future created indices via [templates](http://stackoverflow.com/questions/24553718/updating-the-default-index-number-of-replicas-setting-for-new-indices).

 Assuming the replica is *N*, then if *N+1* or more pods are taken down in a short period such that the cluster doesn't have enough time to recover in between, partial data loss may occur. Therefore only kill no more than *N* pods at a time and leave enough recovery window for the next.
 
 To determine the recovery window, log into one of the surviving pods and run command
  
  ```
  I have no name!@elasticsearch-34-cq6jg:/usr/share/elasticsearch$ curl localhost:9200/_cat/health?v
  epoch      timestamp cluster status node.total node.data shards pri relo init unassign pending_tasks max_task_wait_time active_shards_percent
  1491328738 17:58:58  my-elk  yellow          4         4    159  61    0    8       16            20               7.3s                 86.9%
  ```
 If the `status` is yellow as shown above, then the cluster is in the middle of recovering. When cluster finished recovering, run same command will output
 
 ```
I have no name!@elasticsearch-34-cq6jg:/usr/share/elasticsearch$ curl localhost:9200/_cat/health?v
epoch      timestamp cluster status node.total node.data shards pri relo init unassign pending_tasks max_task_wait_time active_shards_percent
1491328750 17:59:10  my-elk  green           4         4    183  61    2    0        0             1                  -                100.0%
```
 note unassigned shard count is 0.
 
 The above check is applicable to manual pod killing. During a rolling update, the pod killing rate is determined by deploymentConfig *maxUnavailable* and pod readinessProbe's *initialDelaySeconds* parameter. As data volumn increases, recovery time will also increases, therefore *initialDelaySeconds* needs to be adjusted accordingly.   
 
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

1. deploy a new empty cluster by following the procedure above. Disable the route or scale down logstash pods to 0 to disallow input.
2. login to a Elasticsearch pod by running `oc exec -it <pod_name> bash`. In the pod run following commands

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
4. keep running `curl localhost:9200/_cat/health?v` to check unassigned shard count until it's down to 0 and status is green.
3. re-enable the route or scale up logstsh pod count back
