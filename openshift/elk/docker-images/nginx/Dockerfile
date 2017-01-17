FROM nginx:mainline
COPY default.conf /etc/nginx/conf.d/
COPY DOCKER_RUN.sh /tmp
RUN chmod -R 0777 /tmp /var /run /etc
EXPOSE 8080 8081
USER 104
CMD ["/tmp/DOCKER_RUN.sh"]
