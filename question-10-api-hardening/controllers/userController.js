const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const { sendJson } = require('../utils/httpUtils');
const { createError } = require('../utils/errorHandler');

const filePath = path.join(__dirname, '../data/user.json');

async function readAllUsers() {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const users = JSON.parse(content);

        return users;
    } catch (error) {
        throw createError("Unable to load Users", 500);
    }
}

async function getAllUsers(req, res) {
    const users = await readAllUsers();
    sendJson(res, 200, {
        success: true,
        data: users
    });
}

async function getUserById(req, res, id) {
    if (!id) {
        throw createError("User ID is required", 400);
    } 
    if (typeof id !== 'string' || !id.trim()) {
        throw createError("User ID must be a non-empty string", 400);
    }

    const users = await readAllUsers();
    const user =  users.find(user => user.id === id);

    if(!user) {
        throw createError("User not found", 404);
    }
    sendJson(res, 200, {
        success: true,
        data: user
    });
}

function validateUser(data) {
    if (data === null || typeof data !== 'object' ||
        Array.isArray(data)
    ) {
        throw createError('User data must be a valid JSON object', 400);
    }
    if ( typeof data.name !== 'string' ||
        !data.name.trim()
    ) {
        throw createError('Name is required and must be a non-empty string', 400);
    }
    if ( typeof data.email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
        throw createError('A valid email address is required', 400);
    }
    return null;
}

async function saveUsers(users) {
    try {
        await fs.writeFile(filePath,JSON.stringify(users, null, 2));
    } catch {
        throw createError("Unable to save user", 500);
    }
}

async function createUser(req, res, data) {
    validateUser(data);

    const users = await readAllUsers();
    const emailExists = users.some(
        user => user.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (emailExists) {
        throw createError("Email already exists", 409);
    }

    const user = {
        id: randomUUID(),
        name: data.name.trim(),
        email: data.email.trim(),
    };

    users.push(user);
    await saveUsers(users);

    sendJson(res, 201, { success: true, data: user });
}

async function updateUser(req, res, id, data) {
    validateUser(data);

    const users = await readAllUsers();
    const index = users.findIndex( user => user.id === id);

    if (index === -1) {
        throw createError("User not found", 404);
    }

    users[index] = {
        id,
        name: data.name.trim(),
        email: data.email.trim(),
    };

    await saveUsers(users);
    sendJson(res, 200, { success: true, data: users[index] });
}

async function deleteUser(req, res, id) {
    const users = await readAllUsers();
    const index = users.findIndex( user => user.id === id);

    if (index === -1) {
        throw createError("User not found", 404);
    }
    users.splice(index, 1);
    await saveUsers(users);

    sendJson(res, 200, { success: true, message: "User deleted successfully" });
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    validateUser
}