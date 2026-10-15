# Question 03: HTTP Server and Request Routing

A simple HTTP server built with Node.js's built-in `http` module. It checks each request's method and path, then returns a JSON response with an appropriate status code.

## Requirements

- Implement GET /, GET /users, and GET /health.
- Return JSON responses with the appropriate Content-Type header.
- Return HTTP 404 for unknown routes.
- Return HTTP 405 for unsupported methods on known routes.
- Handle server startup errors.

## Run the Server

From this directory, run:

```bash
node server.js
```

The server listens at [http://localhost:3000](http://localhost:3000). Keep the terminal open while making requests.

## Routes

| Method | Path | Result |
| --- | --- | --- |
| `GET` | `/` | Welcome message |
| `GET` | `/users` | Sample users and their count |
| `GET` | `/health` | Server health status |

All responses use the `application/json` content type. User data is stored in memory and resets when the server restarts.

## Try the Endpoints

Run these commands in another terminal:

```bash
curl -i http://localhost:3000/
curl -i http://localhost:3000/users
curl -i http://localhost:3000/health
```

Each supported request returns `200 OK`. For example, `/health` returns:

```json
{
  "success": true,
  "status": "OK",
  "message": "Server is running"
}
```
### Unknown Route
Example request:
```
curl -i http://localhost:3000/products
```
Expected status: ``` 404 Not Found ```

## Unsupported Methods

Example request:
```
curl -i -X POST http://localhost:3000/users
```
Expected status: ``` 405 Method Not Allowed ```

The response includes an `Allow: GET header`

## Request Handling and Errors

- An unknown path returns `404 Not Found`.
- A method other than `GET` on a known path returns `405 Method Not Allowed` and an `Allow: GET` header.
- Responses include a JSON error message for these cases.
- Server startup errors are logged, and the process exits with a failure status.

Try the error responses:

```bash
curl -i http://localhost:3000/products
curl -i -X POST http://localhost:3000/users
```

This server only supports the listed `GET` routes. It does not parse request bodies or modify user data.

## Expected Outcome

A working HTTP server that accepts requests, checks their paths and methods, processes supported routes, and returns clear JSON responses for successful and unsupported requests.
