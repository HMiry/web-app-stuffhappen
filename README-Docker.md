# Docker Setup - Quick Start

Simple commands to run the application using Docker.

## Run the Application

```bash
# Start everything
docker-compose up -d
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Stop the Application

```bash
docker-compose down
```

## View Logs (if needed)

```bash
docker-compose logs -f
```
## Alternative: Run with Live Logs

```bash
# Run in foreground to see logs directly
docker-compose up
```

That's it! The database is automatically created when starting. 