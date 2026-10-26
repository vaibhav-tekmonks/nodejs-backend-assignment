# Question 02: Asynchronous Programming and the Event Loop

**Tags:** `Node.js` `Asynchronous Programming` `Callbacks` `Promises` `Async/Await` `Event Loop` `Error Handling`

A working Node.js program that demonstrates asynchronous execution and error handling through file operations.

## Learning Objectives

- Compare synchronous and asynchronous file reading.
- Demonstrate callbacks, Promises, and `async`/`await`.
- Observe how I/O, Promise microtasks, and timers are scheduled by the event loop.
- Handle file operation errors without leaving them unhandled.


## File Structure

```
question-02-async/
├── index.js      ← All demonstrations in one file
└── sample.txt    ← Test file for I/O operations
```

## Run the Program

From this directory, run:

```bash
node index.js
```

The program reads `sample.txt` using several approaches, demonstrates event-loop scheduling, and prints a completion message.

## Demonstrations

| Concept | What the program shows |
| --- | --- |
| Synchronous I/O | Execution waits for the file read to finish. |
| Callback | The result is handled when the asynchronous read completes. |
| Promise | The result and read errors are handled with `.then()` and `.catch()`. |
| `async`/`await` | Promise-based file reading is written in a sequential style with `try`/`catch`. |
| Event loop | Shows I/O callbacks, Promise microtasks, `setImmediate()`, and timers. |
| Error handling | Each file-reading approach handles read errors, and `main()` handles unexpected errors. |


## Terminal Outcome
 

- --- Synchronous read ---
- Before sync read
- Sync result Hello from Node.js asynchronous programming!
This file is used to compare sync and async file operations.
- After sync read

- --- Callback-based async read ---
- Before callback read
- After callback read

- --- Promise-based async read ---
Before promise read
- Callback result Hello from Node.js asynchronous programming!
This file is used to compare sync and async file operations.
- Promise result Hello from Node.js asynchronous programming!
This file is used to compare sync and async file operations.

- --- Async/await read ---
- Before async/await read
- Async/await result Hello from Node.js asynchronous programming!
This file is used to compare sync and async file operations.
- After async/await read

``` 
--- Event loop demonstration ---
1. Before scheduling I/O
2. After scheduling I/O
3. I/O callback
4. Promise microtask
5. setImmediate callback
6. setTimeout callback 
```

All demonstrations completed.