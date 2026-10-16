# Question 4 — HTTP Methods, Headers, and Request Bodies

A modular Node.js HTTP server (no Express) that handles JSON user requests, validates input, and returns appropriate HTTP status codes.

## Requirements

- Node.js
- No external packages

## Run the server

From the repository root:

```bash
cd question-04-http-methods-requests
node server.js
```

The server listens at `http://localhost:3000`. Keep it running in this terminal and run the tests below from another.

## Routes

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Welcome response |
| `GET` | `/users` | List users |
| `POST` | `/users` | Create a user |
| `GET` | `/health` | Health status |

## Tests

Run each command in a terminal while the server is running. User data is stored in memory and resets when the server restarts.

### Test 1 — Create a user successfully

```bash
curl -i -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"Aman","email":"aman@example.com"}'
```

**Expected:** `201 Created`; the response includes the new user.

### Test 2 — Retrieve users

```bash
curl -i http://localhost:3000/users
```

**Expected:** `200 OK`; returns the original users and any users created since the server started.

### Test 3 — Invalid JSON

```bash
curl -i -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Aman","email":}'
```

**Expected:** `400 Bad Request`.

### Test 4 — Missing required field

```bash
curl -i -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Aman"}'
```

**Expected:** `400 Bad Request`.

### Test 5 — Missing content type

```bash
curl -i -X POST http://localhost:3000/users \
  -d '{"name":"Aman","email":"aman@example.com"}'
```

**Expected:** `415 Unsupported Media Type`.

### Test 6 — Wrong content type

```bash
curl -i -X POST http://localhost:3000/users \
  -H "Content-Type: text/plain" \
  -d '{"name":"Aman","email":"aman@example.com"}'
```

**Expected:** `415 Unsupported Media Type`.

### Test 7 — Unsupported method

```bash
curl -i -X DELETE http://localhost:3000/users
```

**Expected:** `405 Method Not Allowed`, with `Allow: GET, POST`.

### Test 8 — Unknown route

```bash
curl -i http://localhost:3000/products
```

**Expected:** `404 Not Found`.

### Test 9 — Oversized body

```bash
python3 -c 'print("{\"name\":\"" + "A"*1100000 + "\",\"email\":\"a@example.com\"}")' |
curl -i -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  --data-binary @-
```

**Expected:** `413 Content Too Large` (request bodies are limited to 1 MiB).

### Test 10 — Invalid email

```bash
curl -i -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Aman","email":"invalid-email"}'
```

**Expected:** `400 Bad Request`.

## Project structure

```text
question-04-http-methods-requests/
├── server.js
├── routes/userRoutes.js
├── controllers/userController.js
├── services/userService.js
├── validators/userValidator.js
├── utils/
│   ├── readRequestBody.js
│   └── sendJSON.js
└── data/users.js
```
