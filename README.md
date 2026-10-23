# Node.js Backend Assignment

**A hands-on journey from Node.js module to a hardened backend API.**

Work through the ten questions in order. Each one builds on core backend skills using Node.js—and, where noted, its built-in modules rather than a framework.

## Learning path

| # | Question | What gained from each problem |
|---|---|---|
| 01 | [How do modules and file operations fit together?](./question-01-modules/README.md) | Organize code into modules and build JSON-file CRUD operations. |
| 02 | [How does Node.js handle asynchronous work?](./question-02-async/README.md) | Compare callbacks, Promises, `async`/`await`, and event-loop scheduling. |
| 03 | [How do you create an HTTP server from scratch?](./question-03-http-server/README.md) | Route requests and return JSON with meaningful status codes. |
| 04 | [How do HTTP methods, headers, and bodies work?](./question-04-http-methods-requests/README.md) | Validate requests and handle JSON, content types, and errors. |
| 05 | [How do you build a REST API with CRUD?](./question-05-rest-api/README.md) | Create, read, update, and delete users through API routes. |
| 06 | [How can JWT authentication enforce user roles?](./question-06-auth-and-RBAC/README.md) | Authenticate requests and apply role-based access control. |
| 07 | [How does session authentication compare with JWTs?](./question-07-session-based-auth/README.md) | Create, protect, expire, and invalidate server-side sessions. |
| 08 | [How can streams and clustering improve throughput?](./question-08-streams-clustering/README.md) | Process files incrementally and distribute work across workers. |
| 09 | [How does Nginx serve and proxy a Node.js app?](./question-09-nginx/README.md) | Serve static assets and forward API traffic to a backend. |
| 10 | [How do you harden and debug an API?](./question-10-api-hardening/README.md) | Validate input, centralize errors, and add useful request logging. |

## Getting started

Install the project dependencies from the repository root:

```bash
npm install
```

Then open a question’s linked guide for setup and run instructions. Most exercises can be started from their own directory, for example:

```bash
cd question-03-http-server
node server.js
```

The HTTP server exercises commonly use port `3000`; stop one server before starting another. Questions 06 and 10 also need a local `JWT_SECRET` configuration—see their guides. Keep secrets out of source control.
