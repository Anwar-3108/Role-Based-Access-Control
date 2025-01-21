# Use Ubuntu as the base image
FROM ubuntu:20.04

# Set the working directory inside the container
WORKDIR /app

# Install required tools and Node.js v20.16.0
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

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
