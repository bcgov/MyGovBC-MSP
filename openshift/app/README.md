# Deploy MSP application to OpenShift

## Overview
This folder contains following artifacts to facilitate deploying MSP app to OpenShift:

* 2 instant-app templates adopting s2i build strategy with binary source input, one for build and one for deployment.
* a nginx-based builder image

OpenShift is expected to be setup this way:
* 1 project for build. This project is identified by *\<yourprojectname-tools\>* below. All build related activities take place in this project.
* 1 or more projects for runtime environments such as *-dev*, *-test* etc, identified by *<yourprojectname-\<env\>>* below. All deployment activities and runtime artifacts are contained in respective projects.

## Dependencies
The Nginx serves as the web server for the SPA frontend app as well as proxy to following backend API services:
* [MSP Service](https://github.com/bcgov/MyGovBC-msp-service)
* [Captcha](https://github.com/bcgov/MyGovBC-captcha-service)
* [ELK Logging](https://github.com/bcgov/MyGovBC-MSP/tree/master/openshift/elk). (Note: the module also comes with a nginx proxy. But it is this nginx that is used to proxy browser logging events. elk-nginx only proxies Kibana web app.)

To setup entire MSP runtime and CI environment, follow instructions in respective modules to deploy them to OpenShift first. 

## Environment Setup
The prerequisites of the deployment are:

* minimum edit access to a project of OpenShift origin 1.3 or compatible cluster. This implies you know and have access to following URL end points:
  * OpenShift console, by default https://console.pathfinder.gov.bc.ca:8443/console/
  * OpenShift docker registry, by default docker-registry.pathfinder.gov.bc.ca
* has following software installed on the deployment client:
  * git
  * docker. This further implies you have the provisioning tools such as docker machine installed on non-linux clients and started by executing, for example 
            
              ```
              docker-machine start
              docker-machine env
              # Following the output instruction, for example run this command to configure your shell:
              eval $(docker-machine env)
              ```
  * [oc](https://docs.openshift.com/container-platform/latest/cli_reference/get_started_cli.html)

The deployment consists of these steps

1. deploy template

   ```sh
   $ git clone https://github.com/bcgov/MyGovBC-msp.git
   $ cd MyGovBC-msp
   $ oc login -u <username> https://console.pathfinder.gov.bc.ca:8443
   $ docker login  -u <username> -p `oc whoami -t` docker-registry.pathfinder.gov.bc.ca
   $ oc project <yourprojectname-tools>
   $ oc create -f openshift/app/templates/s2i-binary-src-build.yaml
   $ oc project <yourprojectname-<env>>
   $ oc create -f openshift/app/templates/s2i-binary-src-deploy.yaml
   ```
   After this step you will find an instant app template called *mygovbc-client-build* available in the *tools* project and *mygovbc-client-deploy* in the runtime environment project.  
2. create OpenShift instant app by clicking *mygovbc-client-build* and *mygovbc-client-deploy* template from *Add to Project* in web console of respective projects (Tip: you may need to click *See all* link in Instant Apps section to reveal the template). For this msp project, set *Name* parameter to *msp*, which is different from default value *mygovbc-client*.

    Some parameters can be adjusted after app is created. For example, following *mygovbc-client-deploy* parameters are used to config Nginx by setting corresponding environment variables in *msp* deployment config:
    * *OpenShift Cluster IP Range* set env *RealIpFrom*
    * *Additional real_ip_from Rules* set env *AdditionalRealIpFromRules*. The reason to define this environment variable in addition to *RealIpFrom*, is that *RealIpFrom* serves more purposes than ngx_http_realip_module - it is also used to skip OpenShift internal heartbeat requests from logging due to frequency of occurrence. 
    * *Ip Filter Rules* set env *IpFilterRules*, which is used for pre-launch access control.
3. deploy docker images

   ```sh
   $ docker build -t s2i-nginx openshift/app/docker-images/s2i-nginx
   $ docker tag s2i-nginx docker-registry.pathfinder.gov.bc.ca/<yourprojectname-tools>/s2i-nginx
   $ docker push docker-registry.pathfinder.gov.bc.ca/<yourprojectname-tools>/s2i-nginx  
   ```   
4. build runtime image

   ```
   $ npm install
   $ npm run build
   $ # bolt source code SHA-1 into index.html
   $ sed -i s~%MSP_APP_SHA1%~`git rev-parse HEAD`~ dist/index.html
   $ oc project <yourprojectname-tools>
   $ oc start-build msp --from-dir=dist/ -Fw
   ```
The last step can be easily automated using Jenkins to enable CI. Jenkins should have same set of CLI listed in prerequisites. If you use default Jenkins hosted by OpenShift, which is recommended, oc is already installed. In such case you only need to install and configure [NodeJS Plugin](https://wiki.jenkins-ci.org/display/JENKINS/NodeJS+Plugin) to meet all prerequisites. To setup Jenkins hosted by OpenShift, in \<yourprojectname-tools\>, click *Add to Project* and select *jenkins-persistent*.

Proper authorization is needed for Jenkins to launch build. If Jenkins is in the same project \<yourprojectname-tools\>, no further configuration is required. Otherwise, run following command to grant access to Jenkins service account:

```
oc project <yourprojectname-tools>
oc policy add-role-to-group edit system:serviceaccount:<jenkins_project>:<jenkins_service_name>
```
where \<jenkins_project\> and \<jenkins_service_name\> need to be substituted properly.

If everything goes well, you will be able to access the web app using the URL provided in the Overview page of OpenShift project.

## Deployment
When you setup Jenkins to automate the last step in previous section with a webhook, every GitHub commit will trigger a build. The output of the build is a docker image with tag *\<yourprojectname-tools\>/msp:latest*. To apply this image to a runtime environment, run
 
```
oc tag <yourprojectname-tools>/msp:latest <yourprojectname-<env>>/msp:latest
```
Usually, \<env\> referred to by the command is *dev*. The command can be combined with the build commands (last step in previous section) to keep *dev* env up-to-date with code. 

### Change Propagation
To promote runtime image from one environment to another, for example from *dev* to *test*, run

```
oc tag <yourprojectname-tools>/msp:latest <yourprojectname-test>/msp:latest <yourprojectname-tools>/msp:test
```
The above command will deploy the latest/dev runtime image to *test* env. The purpose of tagging runtime image of *test* env in both \<yourprojectname-test\>/msp:latest and \<yourprojectname-tools\>/msp:test is to use \<yourprojectname-tools\>/msp:test as backup such that in case the image stream \<yourprojectname-test\>/msp, which is used by *test* runtime pods, is deleted inadvertently, it can be recovered from \<yourprojectname-tools\>/msp:test.

The command can be setup as a Jenkins task to faciliate using Jenkins to orchestrate deployment of entire application, as is the case.
