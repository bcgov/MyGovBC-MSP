#!/usr/bin/env bash
echo "admin:$(openssl passwd -crypt $KIBANA_PASSWORD)" > /etc/nginx/.htpasswd
sed "s~%AccessControlAllowOrigin%~${AccessControlAllowOrigin:-*}~; s~%KibanaIpFilterRules%~${KibanaIpFilterRules}~; s~%RealIpFrom%~${RealIpFrom:-172.51.0.0/16}~g" /tmp/default.conf.template > /etc/nginx/conf.d/default.conf
nginx -g "daemon off;"
