# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
bun install

# Run in development (watch mode)
bun run dev

# Run in production
bun run start
```

There are no tests configured. No linter is configured.

## Environment Variables

Create a `.env` file with these required variables:

```
PORT=3000
DB_HOST=
DB_PORT=3306
DB_NAME=
DB_USER=
DB_PASS=
JWT_SECRET=
JWT_EXPIRES_IN=7d     # optional, defaults to "7d"
UPLOAD_DIR=uploads    # optional, defaults to "uploads"
NODE_ENV=development
```

All variables except `PORT`, `JWT_EXPIRES_IN`, `UPLOAD_DIR`, and `NODE_ENV` are required and will throw at startup if missing.

## Architecture

Express 5 + Sequelize + MySQL backend for tokenized document management. Uses Bun as the runtime. Entry point is [index.ts](index.ts), which authenticates the DB, syncs models with `alter: true`, then starts the server.

### Request Flow

```
Request → Express middleware → /api router → domain router → authenticate middleware
→ requirePersona middleware → controller → service → Sequelize model → MySQL
```

All routes are under `/api`. Error handling uses a centralized `errorHandler` middleware that knows about `ZodError` (validation) and custom errors created via `createError(message, status)`.

### Domain Modules

Each domain has: `routes/`, `controllers/`, `services/`, `validators/` files.

- **auth** — register/login, issues JWT with `{ userId, persona, wallet }` payload
- **collections** — creator-owned groupings of documents
- **documents** — the core resource; file upload via multer (10MB limit, stored in `UPLOAD_DIR`); documents transition from `status: "pending"` to `"minted"` via `PATCH /:id/mint`
- **viewers** — viewer access management (grant/revoke/sign)
- **access** — access logs per document

### Persona-Based Authorization

Three personas: `creator`, `owner`, `viewer`. The `requirePersona(...personas)` middleware gates routes by persona from the JWT. Key permission splits:

- `creator` — creates collections, uploads documents, mints documents
- `owner` — lists documents by `ownerWallet`, manages viewer access, views access logs
- `viewer` — signs/accesses shared documents

### Data Model Relationships

```
User (creator) → Collection → Document → DocumentShare → User (viewer)
                                       → AccessLog → User (viewer)
```

All IDs are UUIDs. `Document.ownerWallet` links to a blockchain wallet address. The mint fields (`tokenId`, `contractAddress`, `txHash`) are populated when a document is minted on-chain.

### Conventions

- Import paths use `.js` extensions (ESM, `"type": "module"`)
- Model files use `declare` fields (Sequelize TypeScript pattern)
- Services throw via `createError()` from `middleware/error.ts`; controllers catch via the global error handler
- Validation happens in controllers using Zod schemas from `validators/`
- Uploaded files are served statically at `/uploads/:filename`
