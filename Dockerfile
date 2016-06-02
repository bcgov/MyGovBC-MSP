FROM node

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install node dependencies
COPY package.json /usr/src/app/
RUN npm install 
RUN npm install -g bower

# Install bower dependencies
COPY bower.json /usr/src/app/
RUN bower install --allow-root

# Bundle app source
COPY . /usr/src/app

EXPOSE 9000
CMD [ "npm", "start" ]