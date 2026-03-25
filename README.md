# Subora

Subora is a full-stack SaaS starter monorepo for tracking subscriptions, built with FastAPI, React, PostgreSQL, and Docker Compose.

## Stack

- Backend: FastAPI (Python) + SQLAlchemy + Pydantic
- Frontend: React (Vite) + TailwindCSS
- Database: PostgreSQL
- Infrastructure: Docker + Docker Compose

## Project Structure

subora/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md

## Backend Structure

backend/
├── app/
│   ├── main.py
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── db/

Highlights:

- Health endpoint: GET /health
- Versioned API base: /api/v1
- PostgreSQL via DATABASE_URL environment variable
- JWT-ready auth service placeholder in app/services/auth.py
- Initial schema includes users and subscriptions tables

## Frontend Structure

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx

Highlights:

- Dashboard page titled Subora
- Placeholder subscriptions list UI
- API service wired to backend via VITE_API_BASE_URL

## Environment Variables

1. Copy .env.example to .env
2. Update values as needed

Core variables:

- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_PORT
- DATABASE_URL
- BACKEND_PORT
- FRONTEND_PORT
- VITE_API_BASE_URL

## Run with Docker Compose

From project root:

1. cp .env.example .env
2. docker compose up --build

Services:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Backend Health: http://localhost:8000/health
- PostgreSQL: localhost:5432

## Notes

- Backend waits for PostgreSQL health before startup.
- Tables are created automatically on backend startup.
- Current subscriptions endpoint returns a placeholder empty list for UI wiring.

## Next Steps

- Add auth routes and JWT token creation/validation.
- Add CRUD endpoints for subscriptions.
- Add migrations with Alembic.
- Replace placeholder dashboard data with real backend queries.
