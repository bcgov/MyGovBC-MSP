FROM node

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
RUN npm install --production
RUN npm install -g bower
RUN bower install --allow-root

EXPOSE 9000
CMD [ "npm", "start" ]