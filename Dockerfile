FROM node:12.13.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose app port
EXPOSE 8080

CMD ["npm", "run", "gulp"]