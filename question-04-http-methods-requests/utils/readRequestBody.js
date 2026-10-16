const MAX_BODY_SIZE = 1024 * 1024; // 1 MB

function readRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        let tooLarge = false;

        req.on('data', (chunk) => {
            if (tooLarge) {
                return;
            }

            body += chunk;

            if (Buffer.byteLength(body) > MAX_BODY_SIZE) {
                tooLarge = true;
                const error = new Error('Request body is too large');
                error.statusCode = 413;
                reject(error);
            }
        });

        req.on('end', () => {
            if (tooLarge) {
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch {
                const error = new Error('Invalid JSON in request body');
                error.statusCode = 400;
                reject(error);
            }
        });

        req.on('error', reject);
    });
}

module.exports = readRequestBody;