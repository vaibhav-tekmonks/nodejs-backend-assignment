const users = require('../data/users');
const { randomUUID } = require('crypto');

function getAllUsers() {
    return users;
}

function createUser(data) {
    const newUser = {
        id: randomUUID(),
        name: data.name.trim(),
        email: data.email.trim()
    };
    users.push(newUser);
    return newUser;
}

module.exports = {
    getAllUsers,
    createUser
};