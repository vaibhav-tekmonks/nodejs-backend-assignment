const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const accountsFile = path.join(__dirname, '../data/accounts.json');

async function login(email, password) {
    const data = await fs.readFile(accountsFile, 'utf8');
    const accounts = JSON.parse(data);

    const account = accounts.find(
        user => user.email === email.trim()
    );
    if( !account ||
        !await bcrypt.compare(password, account.passwordHash)
    ) {
        return null;
    }

    const token = jwt.sign(
        { role: account.role},
        process.env.JWT_SECRET,
        {
            subject: account.id,
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        }
    );
    return token;
}

module.exports = login;