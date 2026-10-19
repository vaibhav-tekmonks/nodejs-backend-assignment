# Question 05 - REST API with CRUD Operations

A basic REST API built with Node.js core modules without Express.

## Requirements

- Node.js
- No external packages

## Run the server

From the repository root:

```bash
cd question-05-rest-api
node server.js
```

The server listens at `http://localhost:3000`. Keep it running in this terminal and run the tests below from another.

## Routes

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Welcome response |
| `GET` | `/users` | List users |
| `POST` | `/users` | Create a user |
| `GET` | `/users/:id` | Get one user |
| `PUT` | `/users/:id` | Update a user |
| `DELETE` | `/users/:id` | Delete a user |
| `GET` | `/health` | Health status |

## Storage
Users are stored in data/users.json.

## Tests

### Test 1 — Create a user successfully

```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Aarav","email":"aarav@example.com","age":25}'
```

**Expected:** `201 Created`; the response includes the new user, Copy the generated ID.

### Test 2 — Get all users

```bash
curl http://localhost:3000/api/users
```

**Expected:** `200 OK`; returns the original users and any users created since the server started.

### Test 3 — Get one user

```bash
curl http://localhost:3000/api/users/PASTE_ID_HERE
```

### Test 4 — Update a user

```bash
curl -i -X PUT http://localhost:3000/api/users/PASTE_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"name":"Aarav Kumar","email":"aarav@example.com","age":26}'
```

### Test 5 — Delete a user

```bash
curl -i -X DELETE http://localhost:3000/api/users/PASTE_ID_HERE
```

## Error status codes
- 200: Successful operation
- 201: User created
- 400: Invalid input or JSON
- 404: User or endpoint not found
- 405: Unsupported HTTP method
- 413: Request body too large
- 500: Internal server error