FROM node

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install node dependencies
COPY package.json /usr/src/app/
COPY bower.json /usr/src/app/
RUN npm install -g bower
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 9000
CMD [ "npm", "start" ]