const {
    sendJson,
    readJsonBody
} = require('../utils/httpUtils');
const {
    createSession,
    deleteSession,
    getSession,
    getSessionId
} = require('../services/sessionService');

// Demo crendentials (for now)
const demoUser = {
    id: 1,
    username: "admin",
    password: "admin123"
}

async function handleAuthRoutes(req, res, pathname) {
    if(pathname === "/login") {
        if(req.method !== "POST") {
            sendJson(res, 405, {
                success: false,
                error: "Method not allowed"
            },
        {
            Allow: "POST"
        });
        return true;
        }

        if (!req.headers["content-type"]?.includes("application/json")){
            sendJson(res, 415, {
                success: false,
                error: "Content-Type must be application/json"
            });
            return true;
        }
        let body;
        try {
            body = await readJsonBody(req);
        } catch (error) {
            sendJson(res, error.statusCode || 400, {
                success: false,
                error: error.message
            });
            return true;
        }

        if( !body ||
            !body.username.trim() ||
            !body.password ||
            typeof body.username !== "string" ||
            typeof body.password !== "string"
        ) {
            sendJson(res, 400, {
                success: false,
                error: "Username and Password are required"
            });
            return true;
        }
        if( 
            body.username !== demoUser.username ||
            body.password !== demoUser.password
        ) {
            sendJson(res, 401, {
                success: false,
                error: "Invalid username or password"
            });
            return true;
        }
        // user is valid and creating session for that user
        const sessionId = createSession(demoUser);
        sendJson(res, 200, {
            success: true,
            message: "Login Successful",
            user: {
                id: demoUser.id,
                username: demoUser.username
            }
        }, {
            "Set-Cookie":
            `sessionId=${sessionId}; HttpOnly; SameSite=Strict; Path=/; Max-Age=900`
        });
        return true;
    }
    if(pathname === "/logout"){
        if(req.method !== "POST") {
            sendJson(res, 405, {
                success: false,
                error: "Method not allowed"
            }, {
                Allow: "POST"
            });
            return true;
        }

        const sessionId = getSessionId(req);
        deleteSession(sessionId);

        sendJson(res, 200, {
            success: true,
            message: "Logout Successful"
        }, {
            "Set-Cookie":
            "sessionId=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0"
        });
        return true;
    }
    return false;
}

module.exports = handleAuthRoutes;