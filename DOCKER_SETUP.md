# Docker Development Setup for Nix Store Admin

This guide will help you set up and run the Nix Store Admin (Vendure) application using Docker Compose for development.

## Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose
- Git (for cloning the repository)

## Quick Start

1. **Copy the environment file:**

   ```bash
   cp env.example .env.development
   ```

2. **Start the development environment:**

   ```bash
   docker-compose up -d
   ```

3. **View logs:**

   ```bash
   docker-compose logs -f server
   ```

4. **Access the application:**
   - Vendure Admin UI: http://localhost:3000/admin
   - Vendure Shop API: http://localhost:3000/shop-api
   - Vendure Admin API: http://localhost:3000/admin-api
   - pgAdmin (Database UI): http://localhost:8080
   - Elasticsearch: http://localhost:9200

## Default Credentials

- **Admin Panel:**

  - Username: `admin`
  - Password: `admin123`

- **pgAdmin:**
  - Email: `admin@vendure.io`
  - Password: `admin123`

## Services Overview

### Main Services

- **server**: Main Vendure application server with hot reloading
- **worker**: Background job processor
- **database**: PostgreSQL 15 database
- **redis**: Redis for caching and sessions

### Optional Services

- **elasticsearch**: Search functionality (can be disabled if not needed)
- **pgAdmin**: Web-based PostgreSQL administration tool

## Environment Configuration

### Development Environment

The development environment uses `.env.development` file. Key configurations:

- Hot reloading enabled
- Database synchronization enabled
- GraphQL Playground enabled
- Debug mode enabled

### Environment Variables

Copy `env.example` to `.env.development` and modify as needed:

```bash
# Core settings
NODE_ENV=development
PORT=3000

# Database
DB_HOST=database
DB_NAME=vendure
DB_USERNAME=postgres
DB_PASSWORD=password

# Admin credentials
SUPERADMIN_USERNAME=admin
SUPERADMIN_PASSWORD=admin123
```

## Common Commands

### Development

```bash
# Start all services
docker-compose up -d

# Start with logs
docker-compose up

# Stop all services
docker-compose down

# Rebuild services
docker-compose build

# View logs
docker-compose logs -f [service-name]

# Execute commands in container
docker-compose exec server yarn [command]
```

### Database Operations

```bash
# Access PostgreSQL directly
docker-compose exec database psql -U postgres -d vendure

# Create database backup
docker-compose exec database pg_dump -U postgres vendure > backup.sql

# Restore database backup
docker-compose exec -T database psql -U postgres vendure < backup.sql

# Reset database (WARNING: This will delete all data)
docker-compose down -v
docker-compose up -d database
```

### Debugging

```bash
# Shell access to server container
docker-compose exec server sh

# Check service status
docker-compose ps

# View resource usage
docker stats

# Restart specific service
docker-compose restart server
```

## Development Workflow

1. **Code Changes**: Files are mounted as volumes, so changes are reflected immediately
2. **Database Changes**: Set `DB_SYNCHRONIZE=true` in development for automatic schema updates
3. **Installing Dependencies**:
   ```bash
   docker-compose exec server yarn add [package-name]
   ```

## Production Deployment

For production, use the production override:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change port mappings in docker-compose.yml if ports are already in use

2. **Database connection issues**:

   - Ensure database service is running: `docker-compose ps database`
   - Check database logs: `docker-compose logs database`

3. **Permission issues**:

   - On Linux/macOS, you might need to adjust file permissions
   - Run: `sudo chown -R $USER:$USER .`

4. **Out of disk space**:
   - Clean up Docker volumes: `docker system prune -v`
   - Remove unused containers: `docker container prune`

### Performance Optimization

- **Memory**: Elasticsearch can be memory-intensive. Adjust `ES_JAVA_OPTS` in docker-compose.yml
- **File watching**: If you experience high CPU usage, consider excluding `node_modules` from file watchers
- **Database performance**: For large datasets, consider tuning PostgreSQL configuration

## Directory Structure

```
.
├── docker-compose.yml          # Main development compose file
├── docker-compose.prod.yml     # Production overrides
├── Dockerfile                  # Production Docker image
├── Dockerfile.dev             # Development Docker image
├── env.example                # Environment variables template
└── DOCKER_SETUP.md            # This file
```

## Security Notes

- Default credentials are for development only
- Change all passwords in production
- The `.env` files are gitignored for security
- pgAdmin is only enabled in development mode

## Need Help?

- Check the logs: `docker-compose logs`
- Verify service health: `docker-compose ps`
- For Vendure-specific issues, check the [Vendure documentation](https://vendure.io/docs/)
