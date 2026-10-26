# Question 09: Nginx Configuration and Reverse Proxy

## Objective

Configure Nginx to serve static files and forward API requests to a Node.js HTTP server without using Express.js.

## Technologies

- Node.js built-in `http` module
- Nginx
- Linux
- curl

---

## File Structure

```
question-09-nginx/
├── server.js                  ← Node.js API server (port 3000)
├── public/
│   ├── index.html             ← Static HTML page
│   └── style.css              ← Static CSS
├── nginx/
│   └── question-09.conf       ← Nginx configuration file
└── README.md
```

## Architecture

- Nginx listens on port 80.
- Node.js listens on `127.0.0.1:3000`.
- Nginx serves static files from `/var/www/question-09`.
- Requests starting with `/api/` are forwarded to Node.js.
- Nginx forwards the Host, client IP, proxy chain, and original protocol headers.

## 📋 Nginx Setup Commands (For Reference)

```bash
# Install Nginx
sudo apt update && sudo apt install nginx

# Copy static files
sudo mkdir -p /var/www/question-09
sudo cp -r /PATH_TO_PROJECT_FOLDER/public/. /var/www/question-09/

# Create Nginx config
sudo cp nginx/question-09.conf /etc/nginx/sites-available/question-09

# Enable the site
sudo ln -s /etc/nginx/sites-available/question-09 /etc/nginx/sites-enabled/question-09

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Run the Application

Start the Node.js server from the project directory:

```bash
node server.js
```

Enable and start Nginx:

```bash
sudo systemctl enable --now nginx
```


## Test Cases

| Test | Expected result |
|---|---|
| `GET /` | 200 OK — HTML page |
| `GET /style.css` | 200 OK — CSS file |
| `GET /api/hello` | 200 OK — JSON API response |
| `GET /api/missing` | 404 Not Found — JSON error |

## Reverse Proxy 

A reverse proxy accepts client requests and forwards selected requests to a backend server. In this assignment, Nginx serves static files directly and forwards API requests to Node.js.

## Troubleshooting

- 502 Bad Gateway: Check whether Node.js is running on port 3000.
- 403 Forbidden: Check static-file permissions.
- 404 Not Found: Verify the static directory and requested route.
- Configuration error: Run `sudo nginx -t`.

## Expected Outcome

A working Nginx configuration that serves static files, forwards API requests to Node.js, forwards relevant request headers, and returns appropriate responses.
