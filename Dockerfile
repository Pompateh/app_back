# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and NestJS CLI globally
RUN npm install -g @nestjs/cli && \
    npm install

# Copy the rest of the application code
COPY . .

# Build the application (if using TypeScript, this builds the dist folder)
RUN npm run build

# Expose the port (ensure this matches your .env PORT)
EXPOSE 3000

# Define environment variable for production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start:prod"]
