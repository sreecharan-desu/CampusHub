import express from 'express';
import { userRouter } from './user.js';
import { adminRouter } from './admin.js';


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);

app.get('/', (req, res) => {
    res.send('Hello from backend');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})

export default app;
