# Stage 1: Build the static React assets
FROM node:18-alpine AS builder
WORKDIR /app
# Copy package files and install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install
# Copy the rest of the app source code
COPY . .
# Build the production files into the 'build' folder
RUN npm run build

# Stage 2: Serve the application with Nginx (lightweight HTTP server)
FROM nginx:alpine
# Copy the build output from the builder stage to Nginx's public directory
COPY --from=builder /app/build /usr/share/nginx/html
# Expose the port Nginx runs on (default 80)
EXPOSE 80
# Nginx starts automatically
CMD ["nginx", "-g", "daemon off;"]