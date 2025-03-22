FROM node:18.14.2

# Set terminal to xterm-256color
ENV TERM xterm-256color

# Update the package list
RUN apt-get update

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Start the application with conditional build for development
CMD if [ "$NODE_ENV" = "dev" ]; then \
    npm run dev; \
    else \
    npm start; \
    fi