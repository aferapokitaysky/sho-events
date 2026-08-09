#!/bin/sh
set -e

CERT_PATH="/etc/letsencrypt/live/shoevents.org/fullchain.pem"

if [ -f "$CERT_PATH" ]; then
    cp /etc/nginx/templates/ssl.conf /etc/nginx/conf.d/default.conf
else
    cp /etc/nginx/templates/http.conf /etc/nginx/conf.d/default.conf
fi

exec nginx -g "daemon off;"
