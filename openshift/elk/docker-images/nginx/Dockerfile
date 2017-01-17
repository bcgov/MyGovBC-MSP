FROM nginx:mainline
COPY default.conf /etc/nginx/conf.d/
RUN chmod -R 0777 /tmp /var /run
EXPOSE 8080 8081
USER 104
