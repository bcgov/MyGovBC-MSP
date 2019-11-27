# Readme - local-nginx

This folder is not for OpenShift itself. Rather, it is for setting up the nginx server on your local machine to try and closer replicate the OpenShift environment.  This allows you to rapidly test nginx configs without having to re-deploy to OpenShift for each change.

## Requirements

* Docker

## Files

* Dockerfile - An approximate recreation of the Dockerfile in openshift/templates/nginx-runtime/Dockerfile
* nginx.conf - The nginx config file that will be loaded by Docker. 
* dist - A copy of the Angular application.  If you wish to update this, run `npm run build` and replace the folder at openshift/local-nginx/dist

## Commands

  cd openshift/local-nginx
  docker build -t msp-nginx .
  docker run --name msp-container --rm -p 9999:9999 msp-nginx

If you wish to make another changes, press CTRL+C to stop the nginx container, then re-run the build and run commands.  (Alternatively, you may run `docker build -t msp-nginx . && docker stop msp-container`)
