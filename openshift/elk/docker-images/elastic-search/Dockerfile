FROM elasticsearch:2
COPY elasticsearch.yml /usr/share/elasticsearch/config
COPY preStop.sh /tmp/
RUN chmod -R 0777 /usr /var /run /etc /tmp
USER 105
