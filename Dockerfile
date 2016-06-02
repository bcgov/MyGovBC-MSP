FROM node

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install bower
RUN npm install -g bower

# Install node and bower dependencies
RUN npm install

EXPOSE 9000
CMD [ "npm", "start" ]