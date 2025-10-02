FROM node:22-alpine

WORKDIR /app

# Accept build-time environment
ARG ENV=qa

# Set environment variable to pass into Vite
ENV NODE_ENV=$ENV

# Copy package.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Force reinstall esbuild to ensure version consistency
RUN npm uninstall esbuild && npm install esbuild@0.25.9

# Copy the rest of the application
COPY . .

# Copy correct env file based on build arg
RUN cp .env.$ENV .env

# Build the application
RUN npm run build

# Install serve to run the static site
RUN npm install -g serve

# Expose the port for serving the application
EXPOSE 8080

# Command to run the application using serve
CMD ["serve", "-s", "dist", "-l", "8080"]