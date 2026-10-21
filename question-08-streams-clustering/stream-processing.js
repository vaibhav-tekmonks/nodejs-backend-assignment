
const fs = require("fs");
const path = require("path");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");

const dataDirectory = path.join(__dirname, "data");
const inputFile = path.join(dataDirectory, "large-input.txt");
const outputFile = path.join(dataDirectory, "processed-output.txt");

// Converts every incoming chunk to uppercase.
const uppercaseTransform = new Transform({
    transform(chunk, encoding, callback) {
        callback(null, chunk.toString().toUpperCase());
    }
});

async function processLargeFile() {
    try {
        const readableStream = fs.createReadStream(inputFile, {
            encoding: "utf8"
        });

        const writableStream = fs.createWriteStream(outputFile);

        console.log("File processing started...");

        await pipeline(
            readableStream,
            uppercaseTransform,
            writableStream
        );

        console.log("---".repeat(27));
        console.log("File processing completed successfully.");
        console.log("Output file:", outputFile);
    } catch (error) {
        console.error("File processing failed:", error.message);
        process.exitCode = 1;
    }
}

processLargeFile();
