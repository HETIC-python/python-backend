# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --include=dev
# RUN npm ci --omit=optional


# Copy project files
COPY . .

# Expose port 5173 (Vite's default port)
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]