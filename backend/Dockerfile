# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the backend
CMD ["npm", "run", "dev"]
