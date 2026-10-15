const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, 'data.json');

async function readData() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const records = JSON.parse(data);

        if (!Array.isArray(records)) {
            throw new Error('Invalid data: expected a JSON array');
        }
        return records;
    } catch (error) {
        if (error.code ==='ENOENT') {
            return [];
        }

        if (error instanceof SyntaxError) {
            throw new Error('Invalid JSON format in data.json');
        }

        throw error;
    }
}

async function writeData(records) {
    if (!Array.isArray(records)) {
        throw new Error('Invalid data: expected an array');
    }

    const data = JSON.stringify(records, null, 2);
    await fs.writeFile(filePath, data, 'utf-8');
}

module.exports = {
    readData,
    writeData
}