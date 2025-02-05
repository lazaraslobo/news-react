# Stage 1: Build the React application
FROM node:18.17.1 AS build

# Set the working directory
WORKDIR /app

# Set npm config to increase timeout and use a different registry
RUN npm config set fetch-timeout 60000 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set registry https://registry.npmjs.org/ \
    && npm install -g npm@latest

# Clear npm cache
RUN npm cache clean --force

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built React application from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy Nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80
