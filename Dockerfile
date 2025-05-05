# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the application (if using TypeScript, this builds the dist folder)
RUN npm run build

# Expose the port (ensure this matches your .env PORT)
EXPOSE 3001

# Define environment variable for production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start:prod"]
