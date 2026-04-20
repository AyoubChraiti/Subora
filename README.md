# Subora

Subora is a full-stack SaaS starter monorepo for tracking subscriptions, built with FastAPI, React, and PostgreSQL.

## Stack

- Backend: FastAPI (Python) + SQLAlchemy + Pydantic
- Frontend: React (Vite) + TailwindCSS
- Database: PostgreSQL

## Project Structure

subora/
├── backend/
├── frontend/
└── README.md

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm 9+
- PostgreSQL 14+

## Environment Variables

From the project root:

1. Copy `.env.example` to `.env`
2. Update values as needed

Important defaults:

- `DATABASE_URL=postgresql+psycopg2://subora:subora_password@localhost:5432/subora`
- `BACKEND_PORT=8000`
- `FRONTEND_PORT=3000`
- `VITE_API_BASE_URL=http://localhost:8000`

## Local Database Setup

Create a local PostgreSQL role and database that match `.env` values:

```sql
CREATE ROLE subora WITH LOGIN PASSWORD 'subora_password';
ALTER ROLE subora CREATEDB;
CREATE DATABASE subora OWNER subora;
```

If you already have a database/user, just update `DATABASE_URL` in `.env`.

## Run Backend Locally

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend URL: http://localhost:8000

Health check: http://localhost:8000/health

## Run Frontend Locally

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: http://localhost:3000

## Notes

- Tables are created automatically on backend startup.
- The subscriptions endpoint currently returns a placeholder empty list for UI wiring.

## Next Steps

- Add auth routes and JWT token creation/validation.
- Add CRUD endpoints for subscriptions.
- Add migrations with Alembic.
- Replace placeholder dashboard data with real backend queries.
