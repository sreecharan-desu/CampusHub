const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello from backend');
});

app.get('/health-check', (req, res) => {
    res.send('Health check OK');
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
