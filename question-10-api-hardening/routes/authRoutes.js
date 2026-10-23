
const login = require("../controllers/authController");
const { readJsonBody, sendJson } = require("../utils/httpUtils");
const { createError } = require("../utils/errorHandler");

async function handleAuthRoutes(req, res, pathname) {
    if (pathname !== "/api/auth/login") {
        return false;
    }

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        throw createError("Method not allowed", 405);
    }

    const contentType = req.headers["content-type"] || "";

    if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
        throw createError("Content-Type must be application/json", 415);
    }

    const body = await readJsonBody(req);

    if (
        !body ||
        typeof body.email !== "string" ||
        !body.email.trim() ||
        typeof body.password !== "string" ||
        !body.password
    ) {
        throw createError("Email and password are required", 400);
    }

    const token = await login(body.email, body.password);

    if (!token) {
        throw createError("Invalid email or password", 401);
    }

    sendJson(res, 200, {
        success: true,
        message: "Login successful",
        token
    });

    return true;
}

module.exports = handleAuthRoutes;
