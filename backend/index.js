import express from 'express';
import cors from 'cors';
import {mainRouter} from './routes/mainRoute.js';

const app = express();
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send("Hello from backend");
});

app.use("/api/v1/", mainRouter);

async function startServer() {
    try {
        app.listen(5000, () => {
            console.log("Listening on port 5000....");
        });
    } catch (error) {
        console.error("Error deleting records:", error);
    }
}

startServer();
