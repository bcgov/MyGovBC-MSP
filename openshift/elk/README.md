# ELK Cluster on OpenShift

##Overview
This folder contains following files to facilitate deploying ELK cluster to OpenShift

* an instant-app template to generate OpenShift artifacts
* customized ELK docker images runnable on OpenShift

The ELK has these features
* Logstash [HTTP input](https://www.elastic.co/blog/introducing-logstash-input-http-plugin)
* scalable Elasticsearch cluster
* local ephemeral storage for Elasticsearch data to improve performance. Performance of OpenShift GlusterFS persistent volume has been found unacceptable to hold search index, as supported by this [Elasticsearch blog](https://www.elastic.co/blog/performance-considerations-elasticsearch-indexing)
* configurable data lifespan, by default 3 months
* daily backup of Elasticsearch data to persistent storage with 7-day retention
* uses nginx to proxy Logstash input and Kibana with following access controls
  * basic authentication for Kibana
  * allow only POST request to Logstash input
  * CORS support for Logstash input
* based on official elastic docker images 

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
    # Following the output, run this command to configure your shell:
    eval $(docker-machine env)
    ```
  * oc

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
2. create OpenShift instant app. You can do so by clicking *elk* template from *Add to Project* in web console or, if you accept default values for all parameters, by running

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
   ```

4. Wait for the first Elasticsearch pod to be fully up, then scale up the cluster to 5 pods (or more). If doing so too soon, contention may arise between the pods vying to be the first and sole master.   

If everything goes well, you will be able to access the Logstash http endpoint provided in the Overview page of OpenShift project for log collection and kibana URL for reporting dashboard.

##Operation
Because Elasticsearch data is on ephemeral storage, due care is needed to avoid bringing down or corrupt the cluster. By default each piece of data has 1 replica (i.e. 2 copies on separate pods). If two or more pods are taken down in a short period such that the cluster doesn't have enough time to recover in between, partial data loss may occur. Therefore only scale down 1 pod at a time and leave enough recovery window for the next. 
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
