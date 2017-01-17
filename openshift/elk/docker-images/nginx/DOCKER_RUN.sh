#!/usr/bin/env bash
echo "admin:$(openssl passwd -crypt $KIBANA_PASSWORD)" > /etc/nginx/.htpasswd
nginx -g "daemon off;"
