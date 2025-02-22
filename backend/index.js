const express = require('express');


const app = express();

app.get('/health-check', (res) => {    
    res.send('Health ckeck OK');
});


app.listen(3000, () => {    
    console.log('Server running on port 3000');
});