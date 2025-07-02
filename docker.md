# Docker Setup for PixBay Application

This document outlines the Docker setup for the PixBay application, focusing on a development workflow where the backend services (server, PostgreSQL, Redis) run in Docker containers, while the frontend (Vite + React) is run locally for faster development cycles.

## Overview

The application is structured as a monorepo with a client (React) and a server (Node.js/Express). To provide a consistent and reproducible development environment for the backend, Docker Compose is used to manage the server, database, and Redis instances.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)
*   [Node.js](https://nodejs.org/en/download/) (v20 or higher recommended for client development)
*   [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

## Setup and Running the Application

Follow these steps to get the PixBay application running:

### 1. Configure Environment Variables

Create a `.env` file in the root directory of the project. This file will contain sensitive information and configuration specific to your environment. You can use the `.env.example` file as a template.

```bash
cp .env.example .env
```

Edit the newly created `.env` file and fill in the required values. For development, the following values are typically used:

```
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@db:5432/pixbay
CLERK_PUBLISHABLE_KEY=pk_test_
CLERK_SECRET_KEY=sk_test_
NODE_ENV=development
REDIS_URL=redis://redis:6379
```

**Important Notes on Ports:**

*   **PostgreSQL (DB):** The database container's internal port is `5432`. It is exposed on your host machine at `5433` to avoid conflicts with any local PostgreSQL installations. Your server connects to it via `db:5432` (the service name and internal port).
*   **Redis:** The Redis container's internal port is `6379`. It is exposed on your host machine at `6380`. Your server connects to it via `redis:6379`.
*   **Server:** The Node.js server runs on port `5000` both inside the container and on your host machine.

### 2. Start the Backend Services (Docker)

From the root directory of your project, run the following command to build and start the server, database, and Redis containers:

```bash
docker compose up --build --remove-orphans
```

*   `docker compose up`: Starts the services defined in `docker-compose.yml`.
*   `--build`: Rebuilds the Docker images. Use this when you make changes to the `Dockerfile` or project dependencies.
*   `--remove-orphans`: Removes containers for services that are no longer defined in the `docker-compose.yml` (e.g., if you previously had a client service in Docker and removed it).

This command will output logs from all three services. Wait until you see messages indicating that the `db` and `redis` services are ready, and the `server` is listening on port `5000`.

### 3. Start the Frontend Application (Local)

In a **separate terminal**, navigate to the client application directory and start the Vite development server:

```bash
cd apps/client
npm install # If you haven't already
npm run dev
```

This will start the frontend application, typically accessible at `http://localhost:5173`.

### 4. Access the Application

Once both the backend services and the frontend application are running, you can access the PixBay application in your web browser at:

[http://localhost:5173](http://localhost:5173)

### 5. Stopping the Services

To stop the Docker containers, press `Ctrl+C` in the terminal where `docker compose up` is running. To remove the containers and associated networks/volumes (useful for a clean start), you can run:

```bash
docker compose down -v
```

This setup provides a robust and efficient development environment for the PixBay application.