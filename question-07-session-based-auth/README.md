# Question 07 — Session-Based Authentication vs. JWT

## Objective

Demonstrate session-based authentication using Node.js core modules and compare it with JWT-based authentication without using Express.js.

## Implementation

- `server.js` — creates the HTTP server and routes requests.
- `routes/authRoutes.js` — handles login and logout.
- `routes/userRoutes.js` — protects the profile endpoint.
- `services/sessionService.js` — creates, retrieves, expires and deletes sessions.
- `utils/httpUtils.js` — handles JSON requests and responses.

## Run

```bash
node server.js
```

Server URL: `http://localhost:3000`

Demo credentials:
- Username: `admin`
- Password: `admin123`

These credentials are for demonstration only.

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/login` | Authenticate user and create a session |
| GET | `/profile` | Access protected profile |
| POST | `/logout` | Invalidate session |

## Run and test the application


**1. Access profile before login**

```bash
curl -i http://localhost:3000/profile
```
- Expected: 401 Unauthorized.

**2. Login successfully**

Use a cookie jar to save the session cookie for later requests.

```bash
curl -i -c cookies.txt \
  -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
- Expected: 200 OK, a successful login message, and a Set-Cookie response header containing sessionId.
- The -c cookies.txt option saves cookies received from the server.

**3. Login with incorrect credentials**

```bash
curl -i \
  -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'
```
- Expected: 401 Unauthorized.

**4. Access the protected profile after login**

```bash
curl -i -b cookies.txt \
  http://localhost:3000/profile
```
- Expected: 200 OK, with the authenticated user's ID and username.
- The -b cookies.txt option sends the saved cookie back to the server. The server finds the matching session and permits access.

**5. Login with incorrect credentials**

```bash
curl -i \
  -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'
```
- Expected: 401 Unauthorized.

**6. Logout**

```bash
curl -i -b cookies.txt \
  -X POST http://localhost:3000/logout
```
- Expected: 200 OK, a logout message, and a cookie-clearing Set-Cookie header.
- Now try the profile endpoint again:
```
curl -i -b cookies.txt \
  http://localhost:3000/profile
```
- Expected: 401 Unauthorized, because the session was deleted on the server. Even if the old session ID is manually sent again, it won't match an active session.

**7. Invalid JSON and wrong HTTP method**
```
curl -i -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":'
```

## Test scenarios

1. Access profile without login — expect `401`.
2. Login with valid credentials — expect `200`.
3. Login with invalid credentials — expect `401`.
4. Access profile with a valid session cookie — expect `200`.
5. Logout and access profile again — expect `401`.
6. Send invalid JSON — expect `400`.
7. Use an unsupported HTTP method — expect `405`.
8. Access an unknown route — expect `404`.

## Session vs. JWT

Session-based authentication stores user session information on the server and identifies the session through a cookie. JWT authentication verifies a signed token containing claims such as the user ID and expiration time.

Server-side sessions are straightforward to invalidate on logout. Stateless JWTs do not normally require a server-side session lookup, but immediate revocation requires additional mechanisms.

## Limitations

This question 7 assignment uses in-memory session storage and hardcoded demo credentials for learning.
