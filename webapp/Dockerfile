# Use Node.js 16 as the base image for building the Angular application
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build --prod

# Start a new stage to serve the application
FROM nginx:alpine

# Copy the built application from the previous stage
COPY --from=build /app/dist/<your-angular-app-name> /usr/share/nginx/html

# Expose the default NGINX port
EXPOSE 4200

# Command to run NGINX
CMD ["nginx", "-g", "daemon off;"]