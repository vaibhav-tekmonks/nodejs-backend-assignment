# Question 08: Streams, Performance, and Clustering

## Overview

Question 8 demonstrates how to process large files efficiently using Node.js streams and how to distribute incoming HTTP requests across multiple worker processes using the built-in `cluster` module.

## Objectives

- Read large files using streams instead of loading the entire file into memory.
- Process data incrementally and write the output to another file.
- Handle stream errors and completion events.
- Use Node.js clustering to distribute HTTP requests across multiple worker processes.
- Detect worker failures and restart failed workers.

## Technologies Used

- Node.js
- `fs` — File system operations and file streams
- `path` — File path handling
- `stream` — Transform streams and stream processing
- `stream/promises` — Promise-based stream pipeline
- `http` — HTTP server and request handling
- `cluster` — Multiple worker processes
- `os` — CPU information

## Architecture & File Structure

```
question-08-streams-clustering/
├── stream-processing.js     ← Stream-based file processing
├── cluster-server.js        ← Primary process — forks workers
├── cluster-worker.js        ← HTTP server per worker
└── data/
    ├── large-input.txt      ← Source file (large text)
    └── processed-output.txt ← Generated output
```

**File descriptions:**

- `stream-processing.js` — Reads the input file in chunks, converts text to uppercase, and writes the processed data to an output file.
- `cluster-server.js` — Starts the primary process, creates worker processes, monitors worker exits, and restarts failed workers.
- `cluster-worker.js` — Creates an HTTP server in each worker and handles incoming requests.
- `data/large-input.txt` — Input file for stream processing.
- `data/processed-output.txt` — Generated output file.

## 1. Streams and Large File Processing

### Implementation

The stream-processing program uses three streams:

1. **Readable stream:** Reads the input file incrementally using `fs.createReadStream()`.
2. **Transform stream:** Converts incoming text chunks to uppercase.
3. **Writable stream:** Writes processed chunks to the output file using `fs.createWriteStream()`.

The streams are connected using `pipeline()` from `stream/promises`.

### How to Run

From the project directory, create a sample input file:

```bash
printf 'hello nodejs\nstream processing\nlarge file demo\n' \
  > data/large-input.txt
```

Run the program:

```bash
node stream-processing.js
```

### Expected Output

```text
File processing started...
File processing completed successfully.
Output file: .../data/processed-output.txt
```

The output path depends on the location of the project.

### Verify the Output

```bash
cat data/processed-output.txt
```

Expected file content:

```text
HELLO NODEJS
STREAM PROCESSING
LARGE FILE DEMO
```

### Error Handling

The program handles errors such as:

- Input file not found.
- File permission errors.
- Errors while reading or writing the file.
- Stream processing failures.

The `pipeline()` promise rejects if a stream fails, and the `catch` block reports the error and sets a non-zero process exit code.

### Test with a Large File

On Linux, generate a larger input file:

```bash
yes "nodejs stream processing test" | head -c 50M \
  > data/large-input.txt
```

Run the stream processor again:

```bash
node stream-processing.js
```

This test demonstrates incremental file processing without loading the complete input file into a single JavaScript string.

## 2. Blocking and Non-Blocking Operations

### Blocking Operations

A blocking operation prevents the JavaScript execution thread from continuing until the operation completes.

Example:

```javascript
const fs = require("node:fs");

const data = fs.readFileSync("data/large-input.txt", "utf8");

console.log("File reading completed");
```

### Non-Blocking Operations

A non-blocking operation allows JavaScript to continue executing while waiting for an asynchronous operation to complete.

Example:

```javascript
const fs = require("node:fs");

fs.readFile("data/large-input.txt", "utf8", (error, data) => {
    if (error) {
        console.error(error.message);
        return;
    }

    console.log("File reading completed");
});

console.log("This may execute before file reading completes");
```

### Why Streams Are Useful

Non-blocking operations do not automatically reduce memory consumption. For example, `fs.readFile()` still loads the complete file into memory when reading succeeds.

Streams process data incrementally, making them suitable for large files and helping avoid excessive memory usage.

## 3. Node.js Clustering

### Implementation

The clustering demonstration uses Node.js's built-in `cluster` module to create multiple worker processes.

The primary process starts workers, while each worker creates an HTTP server that handles requests on port `3000`.

The worker count is limited to a maximum of four in this demonstration.

### How to Run

Start the clustering application:

```bash
node cluster-server.js
```

Example terminal output:

```text
Primary process started: 12340
Starting 4 workers...
Worker 12341 listening on port 3000
Worker 12342 listening on port 3000
Worker 12343 listening on port 3000
Worker 12344 listening on port 3000
```

The process IDs shown above are examples. Actual output will vary depending on the system.

### Available Endpoints

| Method | Endpoint | Expected status | Description |
|---|---|---|---|
| GET | `/` | 200 OK | Returns a greeting and worker process ID |
| GET | `/health` | 200 OK | Returns health status and worker process ID |
| GET | `/unknown` | 404 Not Found | Returns a route-not-found error |

### Test Using Browser or Postman

**Home endpoint**

```text
GET http://localhost:3000/
```

Example response:

```json
{
  "message": "Hello from a cluster worker!",
  "processId": 12342
}
```

**Health endpoint**

```text
GET http://localhost:3000/health
```

Example response:

```json
{
  "status": "OK",
  "processId": 12342
}
```

**Invalid endpoint**

```text
GET http://localhost:3000/unknown
```

Expected response:

```json
{
  "error": "Route not found"
}
```

Expected status: `404 Not Found`.

### Test Multiple Requests

Run the following command in another terminal:

```bash
for i in $(seq 1 10); do
    curl -s http://localhost:3000/
    echo
done
```

Inspect the `processId` in each response. Different worker processes may handle different requests.

Request distribution is not guaranteed to be perfectly even.

### Worker Failure Handling

The primary process listens for worker exit events. When a worker exits abnormally or is terminated by a signal, the primary process waits one second and starts a replacement worker.

To test worker recovery:

1. Start the cluster application.
2. Identify a worker PID from the terminal output.
3. In another terminal, terminate that worker:

```bash
kill -9 <WORKER_PID>
```

Replace `<WORKER_PID>` with an actual worker PID, not the primary process PID.

4. Check the original terminal for the worker exit and restart messages.
5. Test `http://localhost:3000/health` again.

The endpoint should respond through an available worker.

**Note:** This command forcibly terminates a process and is intended only for controlled testing.

## 4. Key Concepts Learned

- Streams process large files incrementally instead of buffering the entire file.
- Transform streams modify data as it passes through a pipeline.
- `pipeline()` connects streams and provides promise-based completion and error handling.
- Blocking operations prevent the JavaScript execution thread from continuing.
- Non-blocking I/O allows other work to proceed while waiting for I/O.
- Clustering enables multiple Node.js worker processes to handle incoming connections.
- The primary process can monitor worker failures and start replacements.
- Cluster workers have separate memory spaces; ordinary JavaScript variables are not automatically shared.
---
