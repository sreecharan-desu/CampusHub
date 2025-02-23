import express from 'express'; import bcrypt from "bcrypt"
import { User, Event, Registration } from '../db/db.js'; import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();
export const userRouter = express.Router();

// Zod schema for input validation
const authSchema = z.object({
    email: z.string().min(5).max(255).email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "Access denied", success: false });



    try {
        const verified = jwt.verify(refinedToken, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ msg: "Invalid token", success: false });
    }
};

// Get all users
userRouter.get('/', (req, res) => {
    res.json({ msg: 'Hello, from user server', success: true });
});

userRouter.post('/signup', async (req, res) => {
    try {
        const parsedData = authSchema.safeParse(req.body);
        if (!parsedData.success) {
            const errorMessages = parsedData.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join("; ");
            return res.status(400).json({ msg: 'Invalid input', success: false, errors: errorMessages });
        }

        const { email, password } = parsedData.data;

        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists', success: false });
        }

        // Hash the password
        const hashrounds = 10;
        const hashedPassword = await bcrypt.hash(password, hashrounds);

        const username = email.split("@")[0];
        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ msg: 'User signed up successfully', success: true, token, user: { id: newUser._id, username, email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

userRouter.post('/signin', async (req, res) => {
    try {
        const parsedData = authSchema.safeParse(req.body);
        if (!parsedData.success) {
            const errorMessages = parsedData.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join("; ");
            return res.status(400).json({ msg: 'Invalid input', success: false, errors: errorMessages });
        }

        const { email, password } = parsedData.data;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials', success: false });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials', success: false });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ msg: 'User logged in successfully', success: true, token, user: { id: user._id, username: user.username, email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

// Get user profile (Protected Route)
userRouter.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found", success: false });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

// Get all events
userRouter.get('/events', async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'username email');
        res.status(200).json({ success: true, events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

// Register for an event (Protected Route)
userRouter.post('/register-event', authenticateToken, async (req, res) => {
    try {
        const { eventId } = req.body;
        if (!eventId) {
            return res.status(400).json({ msg: 'Event ID is required', success: false });
        }

        const registration = new Registration({ user: req.user.id, event: eventId });
        await registration.save();

        res.status(200).json({ msg: 'User registered for event successfully', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});
