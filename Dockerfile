# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install turbo globally
RUN npm install -g turbo

# Copy root package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy workspaces package.json files
COPY apps/server/package.json ./apps/server/
COPY apps/client/package.json ./apps/client/
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Copy prisma schema before installing dependencies
COPY apps/server/prisma ./apps/server/prisma

# Install all dependencies
RUN npm install

# Copy the rest of the monorepo source code
COPY . .

# Build the entire project
RUN turbo run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy production dependencies from builder
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/apps/server/package.json ./apps/server/

# Copy prisma schema before installing dependencies
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma

# Install production dependencies for the server
RUN npm install --production

# Copy the built server code from the builder stage
COPY --from=builder /app/apps/server/src ./apps/server/src

# Expose the port the app runs on
EXPOSE 5000

# Command to run the server
CMD ["npm", "start", "--workspace=server"]
