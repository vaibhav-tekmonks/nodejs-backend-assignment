# Question 10: API Hardening, Debugging, and Error Handling

## 1. Overview

- This project improves the reliability, security, and maintainability of a Node.js HTTP API.
- The implementation uses Node.js core modules and a modular structure without Express.js or Express middleware.
- The main objectives are to handle errors consistently, validate incoming requests, protect sensitive information, log useful request details, and test common failure scenarios.

## 2. Objectives

- Implement centralized error handling.
- Validate request parameters, headers, and JSON request bodies.
- Prevent sensitive information from appearing in error responses and logs.
- Log HTTP method, request path, response status code, and response time.
- Handle malformed HTTP requests, invalid JSON, and unexpected server errors.
- Test invalid inputs, missing resources, unauthorized requests, and unsupported HTTP methods.
- Document discovered issues, fixes, and test results.

## 3. Technologies Used

- Node.js
- Built-in `http` module for the HTTP server
- Built-in `fs/promises` module for file operations
- Built-in `path` module for file paths
- `curl` for API testing
- JSON files for storing data
- Existing authentication dependencies, such as `jsonwebtoken` and `bcryptjs`, where applicable
---

## 4. Architecture & File Structure

```
question-10-api-hardening/
├── server.js                      ← Entry point + global error handler
├── .env                           ← Secrets (JWT_SECRET, JWT_EXPIRES_IN)
├── .gitignore
├── routes/
│   ├── index.js                   ← Master router
│   ├── authRoutes.js              ← POST /api/auth/login
│   └── userRoutes.js              ← /api/users/* (protected CRUD)
├── controllers/
│   ├── authController.js          ← Login logic (bcrypt + JWT)
│   └── userController.js          ← User CRUD operations
├── middleware/
│   └── authMiddleware.js          ← JWT verification + RBAC
├── utils/
│   ├── errorHandler.js            ← createError() + handleError()
│   ├── httpUtils.js               ← sendJson() + readJsonBody()
│   └── requestLogger.js           ← Method/path/status/time logging
└── data/
    ├── accounts.json              ← Login credentials
    └── user.json                  ← User records
```

## 5. Implementation Journey

### Step 1: Reviewed the existing API

The existing authentication and user routes were reviewed to identify potential problems with invalid input, missing resources, authentication failures, and inconsistent responses.

The objective was to improve reliability without unnecessarily complicating the project or rewriting working functionality.

### Step 2: Implemented centralized error handling

Created `utils/errorHandler.js` to provide a common way to create and handle errors.

The `createError()` function creates errors with an HTTP status code.

The `handleError()` function determines the response status and returns a consistent JSON error response.

Example response:

```json
{
  "success": false,
  "error": {
    "message": "Invalid request"
  }
}
```

Expected client errors return an appropriate status code. Unexpected server errors return a generic message instead of exposing internal implementation details.

Route handlers, controllers, and middleware can throw errors that are handled centrally by `server.js`.

### Step 3: Connected error handling to the HTTP server

The main server uses a `try/catch` around the awaited route handler.

The flow is:

1. Receive an HTTP request.
2. Start request logging.
3. Pass the request to the routing module.
4. Execute the matching route, controller, and middleware.
5. Catch propagated errors.
6. Send the error to the centralized error handler.
7. Log the final response status and response time.

This avoids repeating error-response logic in every route.

### Step 4: Added request validation

Request validation checks that incoming data is in the expected format before the API processes it.

Validation includes:

- Required fields in the JSON request body.
- Correct data types for fields.
- Valid JSON syntax.
- Required headers, including the authentication header for protected routes.
- Appropriate `Content-Type` for JSON requests.
- Valid route parameters and user IDs.
- Supported HTTP methods.
- Maximum request-body size, if configured.

Invalid requests are rejected with an appropriate status code rather than being processed as valid data.

### Step 5: Improved authentication and authorization errors

Protected user routes require a valid authentication token.

Sensitive authentication details are not returned to the client.

### Step 6: Added request logging

Created `utils/requestLogger.js` to record request details.

Example log:

```text
GET /api/users | Status: 200 | Time: 2.14 ms
POST /api/auth/login | Status: 401 | Time: 1.05 ms
GET /api/unknown | Status: 404 | Time: 0.82 ms
```
- HTTP method
- Request path without query-string values
- HTTP status code
- Response time in milliseconds

### Step 7: Handled malformed requests and unexpected errors

The API handles malformed JSON and invalid request data through validation and centralized error handling.

Unexpected server errors returns a generic `500 Internal Server Error` response.

Where supported, malformed HTTP requests that fail before normal route handling are handled at the HTTP server level.

If a response has already started, the error handler avoids attempting to send a second response.

### Step 8: Tested the API

The API was tested using `curl` to cover successful requests and failure scenarios, including invalid input, missing resources, authentication failures, unsupported methods, and request-body validation.

The detailed test commands are included below.

## 6. Running the Project

### Prerequisites

- Node.js installed.
- Required project dependencies installed.
- JSON data files initialized.

Install the project dependencies from the repository root:

```bash
npm install
```

Then enter this directory and configure the environment variables required by the application, for example:

```text
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1h
```

Use the actual variable names expected by the application. Do not commit real secrets to Git.

From this directory, initialize `data/accounts.json` and `data/user.json` with `[]` if they do not already exist.


Replace `<ADMIN_PASSWORD>` and `<USER_PASSWORD>` with the corresponding local account passwords.

### Steps to set-up admin and user account
- To create and store a hashed password in `data/accounts.json`, use:
```
node -e "require('bcryptjs').hash('yourAdminPassword', 10).then(console.log)"
```
- Copy the resulting hash. Repeat for the regular user's password:
```
node -e "require('bcryptjs').hash('normalUserPass', 10).then(console.log)"
```
- Add both accounts to `data/accounts.json`, replacing the hash placeholders with the actual output:
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

From the `question-10-api-hardening` directory, start the server:

```bash
node server.js
```

Keep the server terminal open. Run the following commands in a second terminal.

## 7. API Testing

The commands below assume the server runs on `http://localhost:3000`.

Replace the example login credentials with an account from `data/accounts.json`. Replace user IDs and request fields as required by the implementation.

### 7.1 Authentication Tests

#### Test 1: Successful login

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'
```

Expected result: `200 OK` and a successful JSON response containing the authentication token.

#### Test 2: Missing required fields

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected result: `400 Bad Request` if missing-field validation uses status 400.

#### Test 3: Invalid credentials

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@example.com","password":"wrong"}'
```

Expected result: `401 Unauthorized` with a generic authentication error.

#### Test 4: Invalid JSON

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":'
```

Expected result: `400 Bad Request`.

#### Test 5: Missing Content-Type

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -d '{"email":"admin@example.com","password":"your_password"}'
```

Expected result: `415 Unsupported Media Type` if the route requires JSON.

#### Test 6: Unsupported login method

```bash
curl -i http://localhost:3000/api/auth/login
```

Expected result: `405 Method Not Allowed`, with `Allow: POST` where implemented.

### 7.2 Token and Authorization Tests

For protected-route tests, replace `paste_valid_token_here` with the token returned by login.

#### Test 7: Access protected route without a token

```bash
curl -i http://localhost:3000/api/users
```

Expected result: `401 Unauthorized`.

#### Test 8: Access protected route with a valid token

```bash
curl -i http://localhost:3000/api/users \
  -H "Authorization: Bearer paste_valid_token_here"
```

Expected result: `200 OK` and a list of users.

#### Test 9: Invalid token

```bash
curl -i http://localhost:3000/api/users \
  -H "Authorization: Bearer invalid-token"
```

Expected result: `401 Unauthorized`.

#### Test 10: Malformed Authorization header

```bash
curl -i http://localhost:3000/api/users \
  -H "Authorization: InvalidFormat abc"
```

Expected result: `401 Unauthorized`.

#### Test 11: Expired token

Use an expired token from a controlled test setup:

```bash
curl -i http://localhost:3000/api/users \
  -H "Authorization: Bearer paste_expired_token_here"
```

Expected result: `401 Unauthorized` when the supplied token is expired.

Note: The command itself does not expire the token. Use a token that is already expired to verify this scenario.

#### Test 12: Insufficient permissions

If user creation is restricted to administrators, use a valid token belonging to a non-admin account:

```bash

curl -i -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer paste_user_token_here" \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new-user@example.com"}'
```

Expected result: `403 Forbidden`.

### 7.3 User Resource Tests

#### Test 13: Retrieve a specific user

```bash
curl -i http://localhost:3000/api/users/964b9331-2a3f-47ae-8cd9-05200792cba1 \
  -H "Authorization: Bearer paste_valid_token_here"
```

Expected result: `200 OK` if the example UUID exists in `data/user.json`.

#### Test 14: Retrieve a nonexistent user

```bash
curl -i http://localhost:3000/api/users/00000000-0000-4000-8000-000000000000 \
  -H "Authorization: Bearer paste_valid_token_here"
```

Expected result: `404 Not Found`.

#### Test 15: Create a user

Use an email address that is not already present in `data/user.json`:

```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer paste_valid_token_here" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

Expected result: `201 Created` if the request is valid, the account has sufficient permissions, and the email is not already in use.

#### Test 16: Create a user with missing fields

```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer paste_valid_token_here" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected result: `400 Bad Request`.

#### Test 17: Create a user with invalid JSON

```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer paste_valid_token_here" \
  -H "Content-Type: application/json" \
  -d '{"name":'
```

Expected result: `400 Bad Request`.

#### Test 18: Create a user with the wrong Content-Type

```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer paste_valid_token_here" \
  -H "Content-Type: text/plain" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

Expected result: `415 Unsupported Media Type`.

#### Test 19: Unsupported user route method

```bash
curl -i -X DELETE http://localhost:3000/api/users \
  -H "Authorization: Bearer paste_valid_token_here"
```

Expected result: `405 Method Not Allowed` if DELETE is not supported for the collection route.

### 7.4 General Error-Handling Tests

#### Test 20: Unknown route

```bash
curl -i http://localhost:3000/api/does-not-exist
```

Expected result: `404 Not Found` with the consistent JSON error format.

#### Test 21: Oversized request body

The request-body limit is 1 MB:

```bash
python3 -c 'print("{\"data\":\"" + "a"*1100000 + "\"}")' |
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  --data-binary @-
```

Expected result: `413 Payload Too Large`.

#### Test 22: Verify request logging

```bash
curl -i http://localhost:3000/api/does-not-exist

curl -i http://localhost:3000/api/users

curl -i http://localhost:3000/api/users \
  -H "Authorization: Bearer paste_valid_token_here"
```

Expected result: The server terminal records the method, path, response status, and response time for each completed request.

#### Test 23: Verify generic unexpected-error response

Trigger a controlled unexpected error in a development-only test, then send the request that exercises it.

Expected result: `500 Internal Server Error` with a generic message such as:

```json
{
  "success": false,
  "error": {
    "message": "Internal server error"
  }
}
```

Remove the temporary test code after verification.

#### Test 24: Verify malformed HTTP request handling

Send a deliberately malformed HTTP request in a controlled local test.

Expected result: The server responds with `400 Bad Request` when possible and closes or handles the connection safely.

This test requires a raw TCP client; ordinary `curl` requests generally construct valid HTTP requests.

## 8. Test Results


| Test area | Expected result | Actual result |
|---|---|---|
| Successful login | 200 | Passed |
| Missing login fields | 400 | Passed |
| Invalid credentials | 401 | Passed |
| Malformed JSON | 400 | Passed (local API check) |
| Missing Content-Type | 415 | Passed |
| Unsupported login method | 405 | Pending verification |
| Missing token | 401 | Passed |
| Invalid token | 401 | Passed |
| Expired token | 401 | Pending verification |
| Insufficient permissions | 403 | Passed  |
| Existing user | 200 | Passed |
| Missing user | 404 | Passed  |
| Successful user creation | 201 | Passed |
| Invalid user body | 400 | Passed (malformed JSON) |
| Wrong Content-Type | 415 | Passed |
| Unsupported user method | 405 | Passed |
| Unknown route | 404 | Passed |
| Oversized request body | 413 | Passed |
| Request logging | Required fields logged | Passed|
| Unexpected error | Generic 500 response | Passed |
| Sensitive information protection | No secrets exposed | Passed (query and error-detail checks) |
