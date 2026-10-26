# Question 01 — Node.js Modules & File Operations

A small modular Node.js app for managing records in a local JSON file—no database required.


## Architecture & File Structure

```
question-01-modules/
├── app.js            ← Entry point — orchestrates CRUD demo
├── fileStorage.js    ← Low-level file I/O (read/write JSON)
├── recordService.js  ← Business logic (CRUD functions)
├── test-storage.js   ← Quick smoke-test for the storage layer
└── data.json         ← Persistent JSON data store
```


## Features

- Create, list, find, update, and delete records.
- Store records in `data.json` using Node.js file operations.
- Validate inputs and report missing records or invalid JSON.
- Keep storage (`fileStorage.js`) and record operations (`recordService.js`) in separate modules.


##  How to Run

```bash
cd question-01-modules
node app.js
```

The demo in `app.js` runs the CRUD operations in sequence. It creates a sample record, reads and updates it, then deletes that sample; existing records are left untouched.

## Use the service

Require `recordService.js` from another Node.js file:

```js
const records = require('./recordService');

const allRecords = await records.getAllRecords();
console.log(allRecords);
```

Available methods: `createRecord(record)`, `getAllRecords()`, `getRecordById(id)`, `updateRecord(id, fields)`, and `deleteRecord(id)`. New records need a non-empty `name`; IDs and timestamps are generated automatically.