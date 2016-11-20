FROM node:6.9.1

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN npm install -g gulp
RUN npm install -g phantomjs-prebuilt
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Expose app port
EXPOSE 8000

CMD ["gulp"]