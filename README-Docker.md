# Docker Setup for Stuff Happens 

This project has been fully dockerized with both backend and frontend services. You can run the application in both development and production modes.

## Prerequisites

Make sure you have Docker and Docker Compose installed:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start (Production)

Run the entire application with one command:

```bash
docker-compose up -d
```

This will:
- Build and start the backend server on port `3001`
- Build and start the frontend on port `80`
- Set up database persistence with Docker volumes

**Access the application:**
- Frontend: http://localhost
- Backend API: http://localhost:3001

## Development Mode

For development with hot-reloading:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This will:
- Start the backend with nodemon for automatic restarts
- Start the frontend with Vite dev server for hot-reloading
- Mount source code as volumes for live editing

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Available Commands

### Production
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ this will delete the database)
docker-compose down -v

# Rebuild images
docker-compose up --build -d
```

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild development images
docker-compose -f docker-compose.dev.yml up --build -d
```

## Services

### Backend (server)
- **Port:** 3001
- **Technology:** Node.js + Express
- **Database:** SQLite (persisted in Docker volume)
- **Features:** 
  - Health checks
  - Database persistence
  - Auto-restart on failure

### Frontend (client)
- **Port:** 80 (production) / 5173 (development)
- **Technology:** React + Vite
- **Server:** Nginx (production) / Vite dev server (development)
- **Features:**
  - Client-side routing support
  - Gzip compression
  - Static asset caching
  - Security headers

## Database Management

The SQLite database is automatically persisted using Docker volumes. To initialize or seed the database:

```bash
# Initialize database (production)
docker-compose exec server npm run db:init

# Seed database (production)
docker-compose exec server npm run db:seed

# For development environment
docker-compose -f docker-compose.dev.yml exec server npm run db:init
docker-compose -f docker-compose.dev.yml exec server npm run db:seed
```

## Troubleshooting

### Port Conflicts
If you get port conflicts, you can modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Change host port to 8080
```

### Database Issues
If you need to reset the database:
```bash
docker-compose down -v
docker-compose up -d
```

### View Container Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f client
```

### Access Container Shell
```bash
# Backend container
docker-compose exec server sh

# Frontend container (production)
docker-compose exec client sh
```

## File Structure

```
├── server/
│   ├── Dockerfile              # Production backend image
│   ├── Dockerfile.dev          # Development backend image
│   ├── .dockerignore          # Files to exclude from build
│   └── ...                    # Backend source code
├── client/
│   ├── Dockerfile              # Production frontend image
│   ├── Dockerfile.dev          # Development frontend image
│   ├── nginx.conf             # Nginx configuration
│   ├── .dockerignore          # Files to exclude from build
│   └── ...                    # Frontend source code
├── docker-compose.yml          # Production orchestration
├── docker-compose.dev.yml      # Development orchestration
└── README-Docker.md           # This file
```

## Security Notes

- The production setup uses multi-stage builds for smaller images
- Nginx is configured with security headers
- Database files are properly secured within the container
- Only necessary ports are exposed

## Performance

- Frontend uses multi-stage build for optimized production images
- Static assets are cached and compressed
- Database persistence ensures data survives container restarts
- Health checks ensure services are always available 