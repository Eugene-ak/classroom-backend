# classroom-backend

Express + TypeScript backend for the Classroom project.

## Tech Stack

- Node.js + Express
- TypeScript
- Drizzle ORM
- Neon/PostgreSQL

## Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL-compatible database (Neon recommended)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create environment file

Create `.env` in this directory (`classroom-backend/`):

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
PORT=3000
```

## Database Migrations

Generate migration files from schema changes:

```bash
pnpm db:generate
```

Apply migrations:

```bash
pnpm db:migrate
```

Drizzle config is defined in `drizzle.config.ts`.

## Run the Server

Development:

```bash
pnpm dev
```

Production build:

```bash
pnpm build
pnpm start
```

Default server URL: `http://localhost:3000`

## Available Scripts

- `pnpm dev` runs the server with `tsx`
- `pnpm build` compiles TypeScript to `dist/`
- `pnpm start` runs compiled output
- `pnpm db:generate` generates Drizzle migrations
- `pnpm db:migrate` applies Drizzle migrations

## API Endpoints

### Health

- `GET /`

Response:

```json
{ "message": "Classroom backend is running." }
```

### Subjects

- `GET /api/subjects`
- `POST /api/subjects` (currently placeholder)

#### `GET /api/subjects` query params

- `search`: filter by subject name or code
- `department`: filter by department name
- `page`: page number (default `1`)
- `limit`: page size (default `10`)

Example:

```http
GET /api/subjects?search=algo&department=Computer%20Science&page=1&limit=10
```

Success response shape:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

## Project Structure

- `src/index.ts` application entrypoint
- `src/routes/subjects.ts` subjects routes
- `src/db/index.ts` Drizzle DB client
- `src/db/schema/` table schema and relations
- `drizzle/` generated SQL migrations

## Notes

- `DATABASE_URL` is required at startup and for Drizzle commands.
- `POST /api/subjects` is not fully implemented yet.
