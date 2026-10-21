const crypto = require('crypto');

const sessions = new Map();
const SESSION_DURATION = 15 * 60 * 1000; // 15 min

function createSession(user) {
    const sessionId = crypto.randomBytes(32).toString("hex");

    sessions.set(sessionId, {
        userId : user.id,
        username : user.name,
        expiresAt : Date.now() + SESSION_DURATION
    });

    return sessionId;
}

function getSession(sessionId){
    if (!sessionId){
        return null;
    }

    const session = sessions.get(sessionId);
    if(!session){
        return null;
    }
    if (Date.now() >= session.expiresAt) {
        sessions.delete(sessionId);
        return null;
    }
    return session;
}

function deleteSession(sessionId){
    if (!sessionId){
        return null;
    }
    sessions.delete(sessionId);
}

function getSessionId(req) {
    const cookieHeader = req.headers.cookie || "";

    const cookie = cookieHeader
        .split(";")
        .map(item => item.trim())
        .find(item => item.startsWith("sessionId="));

    return cookie ? cookie.slice("sessionId=".length) : null;
}

module.exports = {
    createSession,
    getSession,
    deleteSession,
    getSessionId
};