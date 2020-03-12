FROM nginx:mainline
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /tmp/app/dist

# =================================================================================
# Fix up permissions
# ref: https://torstenwalter.de/openshift/nginx/2017/08/04/nginx-on-openshift.html
# - S2I sripts must be executable
# - Make sure nginx can read and write it's working directories.
# - The container dynamically configures nginx on startup
# - The application artifacts live in /tmp
# ---------------------------------------------------------------------------------
RUN chmod -R g+rwx $STI_SCRIPTS_PATH
RUN chmod g+rw /var/cache/nginx \ 
               /var/run \
               /var/log/nginx \
               /etc/nginx/nginx.conf \
               /tmp
# =================================================================================

# Nginx runs on port 8080 by default
EXPOSE 8080