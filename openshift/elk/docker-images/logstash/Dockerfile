FROM logstash:2
RUN chmod -R 0777 /usr /var /run /etc
COPY logstash.conf /etc/logstash/conf.d/
CMD ["-f", "/etc/logstash/conf.d/logstash.conf"]
EXPOSE 8080 28777
USER 65534
