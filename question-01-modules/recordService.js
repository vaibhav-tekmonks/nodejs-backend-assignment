const { readData, writeData } = require('./fileStorage');
const { randomUUID } = require('crypto');

async function createRecord(record) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
        throw new Error('Invalid record: expected an object');
    }
    if( typeof record.name !== 'string' || record.name.trim() === '') {
        throw new Error('Invalid record: name is required and must be a non-empty string');
    }
    const records = await readData();

    const newRecord = {
        ...record,
        name: record.name.trim(),
        id : randomUUID(),
        
        createdAt: new Date().toISOString()
    }

    records.push(newRecord);
    await writeData(records);
    return newRecord;
}

async function getAllRecords() {
    const records = await readData();
    return records;
}

async function getRecordById(id) {
    if (typeof id !== 'string' || id.trim() === '') {
        throw new Error('Invalid id: expected a non-empty string');
    }
    const records = await readData();
    const record = records.find(r => r.id === id);
    if (!record) {
        throw new Error(`Record with id ${id} not found`);
    }
    return record;
}

async function updateRecord(id, updatedFields) {
    if (typeof id !== 'string' || id.trim() === '') {
        throw new Error('Invalid id: expected a non-empty string');
    }
    if (!updatedFields || typeof updatedFields !== 'object' || Array.isArray(updatedFields)) {
        throw new Error('Invalid updatedFields: expected an object');
    }
    if (updatedFields.name !== undefined &&
        (typeof updatedFields.name !== 'string' || !updatedFields.name.trim())) {
        throw new Error('Name must be a non-empty string');
    }

    const records = await readData();
    const recordIndex = records.findIndex(r => r.id === id);
    if (recordIndex === -1) {
        throw new Error(`Record with id ${id} not found`);
    }

    const updatedRecord = {
        ...records[recordIndex],
        ...updatedFields,
        updatedAt: new Date().toISOString()
    };

    records[recordIndex] = updatedRecord;
    await writeData(records);
    return updatedRecord;
}

async function deleteRecord(id) {
    if (typeof id !== 'string' || id.trim() === '') {
        throw new Error('Invalid id: expected a non-empty string');
    }
    const records = await readData();
    const recordIndex = records.findIndex(r => r.id === id);
    if (recordIndex === -1) {
        throw new Error(`Record with id ${id} not found`);
    }

    const deletedRecord = records.splice(recordIndex, 1)[0];
    await writeData(records);
    return deletedRecord;
}

module.exports = {
    createRecord,
    getAllRecords,
    getRecordById,
    updateRecord,
    deleteRecord
}