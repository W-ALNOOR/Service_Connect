
## Summary of changes ## Jose Mendez-

- Added Service resource (CRUD): model, controller, routes
  - `src/models/Service.js` — Service mongoose model
  - `src/controllers/serviceController.js` — create, read, update, delete handlers
  - `src/routes/serviceRoutes.js` — public and protected routes mounted at `/api/services`
- Registered services router in `src/app.js` (mounted at `/api/services`).
- Auth improvements for production-safe JWT handling:
  - `src/controllers/auth.controller.js` — signs tokens with RS256 when `JWT_PRIVATE_KEY` is provided; falls back to HS256 using `JWT_SECRET`.
  - `src/middleware/auth.js` — verifies tokens using RSA public key (`JWT_PUBLIC_KEY`) if present, otherwise verifies with `JWT_SECRET` (HS256).
- Server startup improvements:
  - `server.js` now provides a local MongoDB fallback for development and performs environment checks when `NODE_ENV=production` to enforce secure JWT configuration.
- Key generation support:
  - `scripts/generate_keys.js` — small Node script that generates an RSA 2048 keypair and prints escaped keys ready for `.env`.
- `.env.example` and a development `server/.env` (generated keys) were added for convenience. Please treat the included `.env` as development-only and replace with secure secrets in production.

## How to run (local development)
1. From project root:
```powershell
cd server
npm install
```
2. Ensure you have a `.env` in `server/`. You can copy the example:
```powershell
copy .env.example .env
notepad .env
```
3. If you want RS256 (recommended for production), populate `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` in `.env` with escaped PEM lines (the repo contains a development `.env` with generated keys). If you prefer HS256 for quick local testing, set `JWT_SECRET`.
4. Start the dev server:
```powershell
npm run dev
```
The server will print warnings if it falls back to local MongoDB or a development JWT secret.

## Production JWT recommendation
- Use RS256 (asymmetric) signing for production: sign tokens with a private key (`JWT_PRIVATE_KEY`) and verify with the public key (`JWT_PUBLIC_KEY`). Keep the private key secret and rotate keys periodically.
- If you must use HS256 (symmetric), use a long random `JWT_SECRET` (>= 32 characters) and keep it safe (e.g., vault, environment variable).

Key generation (Windows PowerShell) — example (already added in repo):
1. Run the script from `server/`:
```powershell
node .\scripts\generate_keys.js
```
2. The script prints two lines starting with `PRIVATE=` and `PUBLIC=` where `\n` is used for newlines. Paste those values into your `.env` as shown in `.env.example` with quotes around the value.

Security note: the repository currently contains a development `.env` with a generated keypair. Do NOT use these keys in production and consider rotating them.

## API endpoints
Base URL (default local): `http://localhost:4000`

- Auth
  - POST `/api/auth/register` — register a new user
  - POST `/api/auth/login` — login and receive a token

- Services
  - GET `/api/services` — list services (public)
  - GET `/api/services/:id` — get single service (public)
  - POST `/api/services` — create service (protected)
  - PUT `/api/services/:id` — update service (protected, provider only)
  - DELETE `/api/services/:id` — delete service (protected, provider only)

## Postman quick setup
Create a Postman Environment (e.g., `ServiceConnect Local`) and add variables:
- `baseUrl` = `http://localhost:4000`
- `token` = (empty initially)
- `serviceId` = (optional)

### Register (example)
POST {{baseUrl}}/api/auth/register
Headers: `Content-Type: application/json`
Body (raw JSON):
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password123",
  "role": "provider"
}
```
Expected response: JSON with `token` and `user`.

### Login (example)
POST {{baseUrl}}/api/auth/login
Body (raw JSON):
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```
Save the returned `token` into your Postman environment variable `token`.

### Use token for protected requests
In request headers add:
```
Authorization: Bearer {{token}}
```
Or use Postman's Authorization tab and set type to Bearer Token with value `{{token}}`.

### Create Service (protected)
POST {{baseUrl}}/api/services
Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
Body:
```json
{
  "title": "Lawn Mowing",
  "description": "Weekly lawn mowing",
  "category": "Gardening",
  "price": 35
}
```
Response: created service object with `_id` — save as `serviceId` if desired.

### Get All Services (public)
GET {{baseUrl}}/api/services

### Get by ID (public)
GET {{baseUrl}}/api/services/{{serviceId}}

### Update Service (protected, provider only)
PUT {{baseUrl}}/api/services/{{serviceId}}
Headers: `Authorization: Bearer {{token}}`
Body (example):
```json
{ "price": 40 }
```

### Delete Service (protected, provider only)
DELETE {{baseUrl}}/api/services/{{serviceId}}
Headers: `Authorization: Bearer {{token}}`

## Example Postman code snippets (cURL)

Register (cURL):
```bash
curl -X POST "{{baseUrl}}/api/auth/register" -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com","password":"password123","role":"provider"}'
```

Login (cURL):
```bash
curl -X POST "{{baseUrl}}/api/auth/login" -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"password123"}'
```

Create service (cURL):
```bash
curl -X POST "{{baseUrl}}/api/services" -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"title":"Lawn Mowing","description":"Weekly","category":"Gardening","price":35}'
```

Replace `<TOKEN>` with the token you obtained from login.



