# Question 06: Authentication and Role-Based Authorization

A Node.js HTTP API that authenticates users with JWTs and restricts user-management operations by role.

---

## Architecture & File Structure

```
question-06-auth-and-RBAC/
├── server.js                    ← Entry point, JWT_SECRET validation
├── .env                         ← JWT_SECRET and JWT_EXPIRES_IN
├── .gitignore                   
├── routes/
│   ├── index.js                 ← Master router — dispatches to sub-routers
│   ├── authRoutes.js            ← POST /login
│   └── userRoutes.js            ← CRUD routes (protected)
├── middleware/
│   └── auth.js                  ← authenticateToken() + authorizeRoles()
├── services/
│   ├── authService.js           ← Login logic (bcrypt + JWT)
│   └── userService.js           ← User CRUD
├── utils/
│   └── httpUtils.js             ← sendJson + readJsonBody
└── data/
    ├── accounts.json            ← Login credentials (email, passwordHash, role)
    └── users.json               ← User records for CRUD
```
---

## Features

- `POST /login` verifies an email and password and returns a signed JWT.
- JWTs expire after `JWT_EXPIRES_IN` (one hour by default).
- `GET /users` and `GET /users/:id` require a valid bearer token.
- Only users with the `admin` role can create users with `POST /users`.
- Missing, invalid, and expired tokens are rejected. Authenticated users without the required role receive `403 Forbidden`.

## Run locally

From the repository root, install the dependencies:

```bash
npm install
```

Create `question-06-auth-and-RBAC/.env` with a private signing secret:

```env
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1h
```
also create `question-06-auth-and-RBAC/data/accounts.json` and `question-06-auth-and-RBAC/data/users.json` with `[]`.

Keep `.env` private; do not commit the signing secret. Start the API:

```bash
cd question-06-auth-and-RBAC
node server.js
```

The server listens at `http://localhost:3000`. The login accounts are in `data/accounts.json`; that file stores password hashes, so use the corresponding plaintext passwords configured for your local test accounts.

## Routes

| Method | Path | Access |
| --- | --- | --- |
| `POST` | `/login` | Public |
| `GET` | `/users` | Any authenticated user |
| `GET` | `/users/:id` | Any authenticated user |
| `POST` | `/users` | Admin |

## Test with curl

Replace `<ADMIN_PASSWORD>` and `<USER_PASSWORD>` with the corresponding local account passwords.

### Steps to set-up admin and user account
- To create and store the hashed password in accounts.json file use the below cmd:
```
node -e "require('bcryptjs').hash('yourAdminPassword, 10).then(console.log)"
```
- Copy the resulting hash. Repeat for the regular user's password:
```
node -e "require('bcryptjs').hash('normalUserPass', 10).then(console.log)"
```
- Now add both accounts to data/accounts.json, replacing the hash placeholders with the actual output:
```
[
  {
    "id": "account-admin-1",
    "email": "admin@example.com",
    "passwordHash": "PASTE_ADMIN_HASH_HERE",
    "role": "admin"
  },
  {
    "id": "account-user-1",
    "email": "user@example.com",
    "passwordHash": "PASTE_USER_HASH_HERE",
    "role": "user"
  }
]
```


**1. Log in as admin and save the token:**

```bash
ADMIN_TOKEN=$(curl -sS -X POST http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"<ADMIN_PASSWORD>"}' \
  | node -pe 'JSON.parse(require("fs").readFileSync(0, "utf8")).token')
```

**2. Log in as a regular user:**

```bash
USER_TOKEN=$(curl -sS -X POST http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"<USER_PASSWORD>"}' \
  | node -pe 'JSON.parse(require("fs").readFileSync(0, "utf8")).token')
```

**3. Check protected access and role restrictions:**

```bash
# Authenticated read: expected 200
curl -i http://localhost:3000/users \
  -H "Authorization: Bearer $USER_TOKEN"

# No token: expected 401
curl -i http://localhost:3000/users

# Regular user attempting an admin operation: expected 403
curl -i -X POST http://localhost:3000/users \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"test.user@example.com"}'

# Admin operation: expected 201
curl -i -X POST http://localhost:3000/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"test.user@example.com"}'
```

**4. Test invalid credentials and invalid tokens:**

```bash
# Invalid credentials: expected 401
curl -i -X POST http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"wrong-password"}'

# Invalid token: expected 401
curl -i http://localhost:3000/users \
  -H 'Authorization: Bearer not-a-valid-token'
```

**5. Test token expiration:** temporarily set `JWT_EXPIRES_IN=1s` in `.env` and restart the server. Generate a fresh admin token using step 1, then wait two seconds and retry a protected request. The request should return `401` with `Token expired`.

```bash
sleep 2
curl -i http://localhost:3000/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```