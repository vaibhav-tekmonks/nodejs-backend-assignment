const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, 'sample.txt');

// Synchronous file reading 
function readSynchronously() {
    console.log("\n--- Synchronous read ---");
    console.log("Before sync read");

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        console.log("Sync result", data.trim());
    }
    catch (error) {
        console.error("Sync read failed:", error.message);
    }
    console.log("After sync read");
}

// Callback-based asynchronous file reading
function readWithCallback() {
    console.log("\n--- Callback-based async read ---");
    console.log("Before callback read");
    
    fs.readFile(filePath, 'utf-8', (error, data) => {
        if (error) {
            console.error("Callback read failed:", error.message);
            return;
        }
        console.log("Callback result", data.trim());
    });
    console.log("After callback read");
}

// Promise with then/catch
function readWithPromise() {
    console.log("\n--- Promise-based async read ---");
    console.log("Before promise read");

    return fsPromises.readFile(filePath, 'utf-8')
        .then((data) => {
            console.log("Promise result", data.trim());
        })
        .catch((error) => {
            console.error("Promise read failed:", error.message);
        });
    // console.log("After promise read");
}

// Async/await
async function readWithAsyncAwait() {
    console.log("\n--- Async/await read ---");
    console.log("Before async/await read");

    try {
        const data = await fsPromises.readFile(filePath, 'utf-8');
        console.log("Async/await result", data.trim());
    } catch (error) {
        console.error("Async/await read failed:", error.message);
    }
    console.log("After async/await read");
}

// Event loop demo
function demonstrateEventLoop() {
  console.log("\n--- Event loop demonstration ---");
  console.log("1. Before scheduling I/O");

  return new Promise((resolve) => {
    fs.readFile(filePath, "utf8", (error) => {
      if (error) {
        console.error("Event loop I/O failed:", error.message);
        return resolve();
      }

      console.log("3. I/O callback");

      setTimeout(() => {
        console.log("6. setTimeout callback");
        resolve();
      }, 0);

      setImmediate(() => {
        console.log("5. setImmediate callback");
      });

      Promise.resolve().then(() => {
        console.log("4. Promise microtask");
      });
    });

    console.log("2. After scheduling I/O");
  });
}

// Run each demonstration function in sequence
async function main() {
    readSynchronously();
    try {
        readWithCallback();
    } catch (error) {
        console.error("Error in callback read:", error.message);
    }
    try {
        await readWithPromise();
    } catch (error) {
        console.error("Error in promise read:", error.message);
    }
    await readWithAsyncAwait();
    await demonstrateEventLoop();
    console.log("\nAll demonstrations completed.");
}

main().catch((error) => {
    console.error("Error in main:", error.message);
});
