import express from 'express'; 
import bcrypt from "bcrypt";
import { Admin as AdminModel, Event, Registration } from '../db/db.js'; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();
export const adminRouter = express.Router();

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
        const refinedToken = token.split(" ")[1];
        const verified = jwt.verify(refinedToken, process.env.JWT_SECRET);
        req.admin = verified;
        next();
    } catch (error) {
        res.status(400).json({ msg: "Invalid token", success: false });
    }
};

// Middleware to check if Admin is an admin
const isAdmin = async (req, res, next) => {
    try {
        const adminUser = await AdminModel.findById(req.admin.id);
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ msg: "Access denied", success: false });
        }
        next();
    } catch (error) {
        res.status(500).json({ msg: "Server error", success: false });
    }
};

// Get all Admins
adminRouter.get('/', (req, res) => {
    res.json({ msg: 'Hello, from Admin server', success: true });
});

adminRouter.post('/signup', async (req, res) => {
    try {
        const parsedData = authSchema.safeParse(req.body);
        if (!parsedData.success) {
            const errorMessages = parsedData.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join("; ");
            return res.status(400).json({ msg: 'Invalid input', success: false, errors: errorMessages });
        }

        const { email, password } = parsedData.data;

        let existingAdmin = await AdminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ msg: 'Admin already exists', success: false });
        }

        const hashrounds = 10;
        const hashedPassword = await bcrypt.hash(password, hashrounds);

        const adminName = email.split("@")[0];
        const newAdmin = new AdminModel({ adminName, email, password: hashedPassword });
        await newAdmin.save();

        const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.status(201).json({ msg: 'Admin signed up successfully', success: true, token, admin: { id: newAdmin._id, adminName, email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

adminRouter.post('/signin', async (req, res) => {
    try {
        const parsedData = authSchema.safeParse(req.body);
        if (!parsedData.success) {
            const errorMessages = parsedData.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join("; ");
            return res.status(400).json({ msg: 'Invalid input', success: false, errors: errorMessages });
        }

        const { email, password } = parsedData.data;
        const adminUser = await AdminModel.findOne({ email });
        if (!adminUser) {
            return res.status(400).json({ msg: 'Invalid credentials', success: false });
        }

        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials', success: false });
        }

        const token = jwt.sign({ id: adminUser._id, email: adminUser.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.status(200).json({ msg: 'Admin logged in successfully', success: true, token, admin: { id: adminUser._id, adminName: adminUser.adminName, email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

adminRouter.get('/profile', authenticateToken, async (req, res) => {
    try {
        const adminUser = await AdminModel.findById(req.admin.id).select("-password");
        if (!adminUser) {
            return res.status(404).json({ msg: "Admin not found", success: false });
        }
        res.json({ success: true, admin: adminUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

adminRouter.get('/admins', authenticateToken, isAdmin, async (req, res) => {
    try {
        const admins = await AdminModel.find().select("-password");
        res.json({ success: true, admins });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

adminRouter.delete('/admins/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await AdminModel.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Admin deleted successfully', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

adminRouter.get('/events', authenticateToken, isAdmin, async (req, res) => {
    try {
        const registrations = await Registration.find().populate('admin', 'adminName email').populate('event', 'title date');
        res.json({ success: true, registrations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

adminRouter.post('/create-event', authenticateToken, async (req, res) => {
    try {
        const { title, description, date, time, location } = req.body;
        if (!title || !date || !time || !location) {
            return res.status(400).json({ msg: 'Missing required fields', success: false });
        }

        const newEvent = new Event({
            title, description, date, time, location, organizer: req.admin.id
        });
        await newEvent.save();

        res.status(201).json({ msg: 'Event created successfully', success: true, event: newEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});
