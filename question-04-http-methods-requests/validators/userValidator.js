function validateUser(data) {
    if (data === null || typeof data !== 'object' ||
        Array.isArray(data)
    ) {
        return 'Request body must be a valid JSON object';
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

module.exports = validateUser;