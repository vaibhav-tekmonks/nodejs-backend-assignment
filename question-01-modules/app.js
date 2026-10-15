const service = require('./recordService');

async function main() {
    try{
        // CREATE
        const newRecord = await service.createRecord({
            name: 'Sample Record 3',
            description: 'This is a sample record 3'
        });
        console.log('New record created:', newRecord);
        
        // READ ALL
        const allRecords = await service.getAllRecords();
        console.log('All records:', allRecords);

        // READ ONE
        const record = await service.getRecordById(newRecord.id);
        console.log('Record by ID:', record);

        // UPDATE
        const updatedRecord = await service.updateRecord(newRecord.id, {
            description: 'Updated description'
        });
        console.log('Updated:' , updatedRecord);

        // DELETE 
        const deletedRecord = await service.deleteRecord(newRecord.id);
        console.log('Deleted record:', deletedRecord);

        // READ ALL after deletion
        const recordsAfterDeletion = await service.getAllRecords();
        console.log('Records after deletion:', recordsAfterDeletion);

        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
}

main();