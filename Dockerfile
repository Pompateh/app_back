# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies)
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
RUN apk add --no-cache python3 make g++

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm install --production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy the uploads directory directly from the build context
COPY ./uploads /app/uploads

# Ensure read permissions for all users on the uploads directory and its contents
RUN chmod -R +r /app/uploads

# Expose the port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000
ENV CORS_ORIGIN=https://wearenewstalgiaa.netlify.app

# Declare DATABASE_URL as a build argument
ARG DATABASE_URL

# Debug: Print DATABASE_URL during build to check if it's set
# Using ARG DATABASE_URL for the echo command context
RUN echo "DEBUG (Build Arg): DATABASE_URL is: $DATABASE_URL"

# Start the application
CMD ["/bin/sh", "-c", "npm run start:prod"]
