
function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.expose = Number.isInteger(statusCode)
        && statusCode >= 400
        && statusCode < 500;
    return error;
}

function handleError(error, req, res) {
    if (res.headersSent || res.destroyed) {
        res.destroy();
        return;
    }

    const statusCode = error
        && error.expose === true
        && Number.isInteger(error.statusCode)
        && error.statusCode >= 400
        && error.statusCode < 500
        ? error.statusCode
        : 500;

    const message = statusCode < 500
        && error.expose === true
        && typeof error.message === 'string'
        ? error.message
        : "Internal server error";

    console.error(
        `[ERROR] ${req.method} request | status=${statusCode}`
    );

    const { sendJson } = require("./httpUtils");
    sendJson(res, statusCode, {
        success: false,
        error: {
            message
        }
    });
}

module.exports = { createError, handleError };
