FROM nginx:mainline
COPY ./s2i/bin/ /tmp/s2i/bin
COPY default.conf /etc/nginx/conf.d/
RUN chmod -R 0777 /tmp /var /run
LABEL io.openshift.s2i.scripts-url=image:///tmp/s2i/bin
EXPOSE 8080
USER 104