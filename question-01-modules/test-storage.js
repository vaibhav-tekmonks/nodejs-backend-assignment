const { readData, writeData } = require('./fileStorage');

async function main() {
    const records = await readData();
    console.log('Current records:', records);

    const newRecord = { id: records.length + 1, name: 'New Record' };
    records.push(newRecord);

    await writeData(records);
    console.log('New record added:', newRecord);

    const updatedRecords = await readData();
    console.log('Updated records:', updatedRecords);
}

main().catch( (error) => {
    console.error('Error:', error.message);
})