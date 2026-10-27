const cluster = require('cluster');
const os = require('os');
const { Worker } = require('worker_threads');

const WORKER_COUNT = Math.min(4, os.cpus().length);

if(cluster.isPrimary){
    console.log(`Primary process started: ${process.pid}`);
    console.log(`Starting ${WORKER_COUNT} workers...`);

    for(let i = 0; i< WORKER_COUNT; i++){
        const worker = cluster.fork();
        console.log(
            `Worker started: PID=${worker.process.pid}, ID=${worker.id}`
        );
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(
            `Worker ${worker.process.pid} exited. ` +
            `Code: ${code}, Signal: ${signal}`
        );

        // Restart workers that crashed or were terminated
        // by a signal, but do not restart normal exits.
        if (code !== 0 || signal) {
            console.log("Restarting worker in 1 second...");

            setTimeout(() => {
                const newWorker = cluster.fork();
                console.log(
                    `Replacement worker started: PID=${newWorker.process.pid}, ` +
                    `ID=${newWorker.id}`
                );
            }, 1000);
        }
    });
} else {
    require('./cluster-worker');
}