FROM elasticsearch:2
COPY purge-elasticsearch-index /etc/cron.daily
RUN chmod -R 0777 /usr /var /run /etc
USER 105
