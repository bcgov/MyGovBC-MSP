FROM node:4

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install bower and gulp
RUN npm install -g bower
RUN npm install -g gulp

# Install node dependencies
RUN npm install

# Install bower dependencies
RUN bower install --allow-root

# Build client
RUN gulp build:client

EXPOSE 9000
CMD [ "npm", "start" ]
