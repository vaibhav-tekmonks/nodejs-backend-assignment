const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const filePath = path.join(__dirname, '../data/users.json');

async function getAllUsers() {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
}

async function getUserById(id) {
    const users = await getAllUsers();
    return users.find(user => user.id === id);
}

function validateUser(data) {
    if (data === null || typeof data !== 'object' ||
        Array.isArray(data)
    ) {
        return 'User data must be a valid JSON object';
    }
    if ( typeof data.name !== 'string' ||
        !data.name.trim()
    ) {
        return 'Name is required and must be a non-empty string';
    }
    if ( typeof data.email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
        return 'A valid email address is required';
    }
    return null;
}

async function saveUsers(users) {
    await fs.writeFile(filePath,JSON.stringify(users, null, 2));
}

async function createUser(data) {
    const error = validateUser(data);
    if (error) {
    const err = new Error(error);
    err.statusCode = 400;
    throw err;
    }

    const users = await getAllUsers();

    const user = {
        id: randomUUID(),
        name: data.name.trim(),
        email: data.email.trim(),
    };

    users.push(user);
    await saveUsers(users);

    return user;
}

async function updateUser(id, data) {
    const error = validateUser(data);
    if (error) {
    const err = new Error(error);
    err.statusCode = 400;
    throw err;
    }

    const users = await getAllUsers();
    const index = users.findIndex( user => user.id === id);

    if (index === -1) return null;

    users[index] = {
        id,
        name: data.name.trim(),
        email: data.email.trim(),
    };

    await saveUsers(users);
    return users[index];
}

async function deleteUser(id) {
    const users = getAllUsers();
    const index = users.findIndex( user => user.id === id);

    if (index === -1) return false;
    users.splice(index, 1);
    await saveUsers(users);

    return true;
}

module.exports = {
    getAllUsers,
    getUserById,
    validateUser,
    saveUsers,
    createUser,
    updateUser,
    deleteUser
}