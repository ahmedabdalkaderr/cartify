# Use a Node.js base image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the development port
EXPOSE 3000

# Command to run the app in development mode
CMD ["npm", "run", "start:dev"]
