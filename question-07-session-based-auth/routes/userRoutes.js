const { sendJson } = require('../utils/httpUtils');

const {
    getSession,
    getSessionId
} = require('../services/sessionService');

function handleUserRoutes(req, res, pathname) {
    if (pathname !== "/profile") {
        return false;
    }
    if(req.method !== "GET") {
        sendJson(res, 405, {
            success: false,
            error: "Method not allowed"
        }, {
            Allow: "GET"
        });
        return true;
    }

    const sessionId = getSessionId(req);
    const session = getSession(sessionId);

    if(!session) {
        sendJson(res, 401, {
            success: false,
            error: "Please login first"
        });
        return true;
    }
    sendJson(res, 200, {
        success: true,
        message: "Protected profile accessed successfully",
        user: {
            id: session.userId,
            username: session.username
        }
    });
    return true;
}

module.exports = handleUserRoutes;