FROM nginx:mainline
COPY default.conf.template /tmp/default.conf.template
COPY DOCKER_RUN.sh /tmp
COPY nginx.conf /etc/nginx/
RUN chmod -R 0777 /tmp /var /run /etc
EXPOSE 8080 8081
USER 104
CMD ["/tmp/DOCKER_RUN.sh"]
