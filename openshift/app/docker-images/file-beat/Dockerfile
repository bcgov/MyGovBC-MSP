FROM prima/filebeat:5
COPY conf /etc/filebeat/conf/
CMD ["filebeat", "-e", "-path.config", "/etc/filebeat/conf", "-path.data", "/tmp", "-path.logs", "/tmp"]
