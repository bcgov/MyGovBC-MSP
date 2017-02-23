#!/usr/bin/env bash
echo "admin:$(openssl passwd -crypt $KIBANA_PASSWORD)" > /etc/nginx/.htpasswd
sed "s~%AccessControlAllowOrigin%~${AccessControlAllowOrigin:-*}~; s~%KibanaIpFilterRules%~${KibanaIpFilterRules}~" /tmp/default.conf.template > /etc/nginx/conf.d/default.conf
nginx -g "daemon off;"
