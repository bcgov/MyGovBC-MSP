FROM hamiltont/docker-cron:latest
RUN apt-get update && apt-get -y install curl && apt-get clean && rm -rf /var/lib/apt/lists
COPY crontab /cron/
COPY cron-tasks.sh /cron/
RUN chmod -R 0777 /cron
