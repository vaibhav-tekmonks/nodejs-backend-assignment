# Question 01 — Node.js Modules & File Operations

A small modular Node.js app for managing records in a local JSON file—no database required.

## Features

- Create, list, find, update, and delete records.
- Store records in `data.json` using Node.js file operations.
- Validate inputs and report missing records or invalid JSON.
- Keep storage (`fileStorage.js`) and record operations (`recordService.js`) in separate modules.

## Run

```bash
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