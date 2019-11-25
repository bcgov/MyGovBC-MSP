FROM nginx:mainline
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /tmp/app/dist

# Fix up permissions
RUN chmod -R 0777 /tmp /var /run /etc /mnt

# Nginx runs on port 8080 by default
EXPOSE 8080