import express from 'express';
import { userRouter } from './user/user.js';
import { adminRouter } from './admin/admin.js';


const app = express();

// Middleware
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
