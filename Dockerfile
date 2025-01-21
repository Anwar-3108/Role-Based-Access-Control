# Use Ubuntu as the base image
FROM node:20.18-alpine3.21

# Set the working directory inside the container
WORKDIR /app

# Install required tools and Node.js v20.16.0
RUN apk add --no-cache \
    curl \
    && npm install -g npm@latest

# Verify Node.js and npm versions
RUN node -v && npm -v

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on (default: 3000)
EXPOSE 4141

# Specify the command to run your application
CMD ["node", "server.js"]
