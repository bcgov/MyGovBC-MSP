This folder contains following files to facilitate deploying ELK with http input to OpenShift:

* an instant-app template to generate ELK runtime artifacts
* customized ELK docker-images runnable on OpenShift

The prerequisites of the deployment are:

* minimum edit access to a project of OpenShift origin 1.3 or compatible cluster. This implies you know and have access to following URL end points:
  * OpenShift console, by default https://console.pathfinder.gov.bc.ca:8443/console/
  * OpenShift docker registry, by default docker-registry.pathfinder.gov.bc.ca
* has following software installed on the deployment client:
  * git
  * docker
  * oc

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
2. create OpenShift instant app. You can do so by clicking *elk* template from *Add to Project* in web console or by running
   
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

If everything goes well, you will be able to access the logstash http endpoint provided in the Overview page of OpenShift project for log collection and kibana URL for reporting dashboard.
