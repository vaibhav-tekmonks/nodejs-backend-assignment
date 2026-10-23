
function requestLogger(req, res) {
    const startTime = process.hrtime.bigint();
    const path = req.url.split("?")[0];

    res.on("finish", () => {
        const elapsed = process.hrtime.bigint() - startTime;
        const responseTime = Number(elapsed) / 1_000_000;

        console.log(
            `${req.method} ${path} | ` +
            `Status: ${res.statusCode} | ` +
            `Time: ${responseTime.toFixed(2)} ms`
        );
    });
}

module.exports = requestLogger;
