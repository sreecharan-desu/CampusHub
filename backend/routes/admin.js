const express = require('express');
const bcrypt = require('bcrypt');
const { Admin: AdminModel, Event, Registration, User } = require('../db/db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { z } = require('zod');


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

const sendEventEmails = async (event) => {
    try {
        const users = await User.find().select("email");
        if (!users.length) {
            console.log("No users found. Skipping email notifications.");
            return;
        }

        const emails = users.map(user => user.email);
        console.log(`Sending emails to: ${emails.join(", ")}`);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emails,
            subject: `New Event: ${event.title}`,
            text: `A new event "${event.title}" is happening on ${event.date} at ${event.time} in ${event.location}. Don't miss it!`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Emails sent successfully:", info.response);
    } catch (error) {
        console.error("Error sending emails:", error);
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
        const username = email.split("@")[0];
        const adminName = email.split("@")[0];
        const newAdmin = new AdminModel({ username, adminName, email, password: hashedPassword });
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

// Get all events
adminRouter.get('/events', authenticateToken, isAdmin, async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'adminName email');
        res.json({ success: true, events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

// Get users registered for a particular event
adminRouter.get('/event/:eventId/registrations', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { eventId } = req.params;
        const registrations = await Registration.find({ event: eventId }).populate('user', 'adminName email');
        res.json({ success: true, registrations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

// Delete an event
adminRouter.delete('/delete-event/:eventId', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { eventId } = req.params;
        await Event.findByIdAndDelete(eventId);
        await Registration.deleteMany({ event: eventId });
        res.json({ success: true, msg: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

adminRouter.post('/create-event', authenticateToken, async (req, res) => {
    try {
        const { title, description, date, time, location, imageUrl, videoUrl } = req.body;
        if (!title || !date || !time || !location) {
            return res.status(400).json({ msg: 'Missing required fields', success: false });
        }

        const newEvent = new Event({
            title,
            description,
            date,
            time,
            location,
            organizer: req.admin.id,
            attendees: [],
            imageUrl,
            videoUrl
        });
        await newEvent.save();

        await sendEventEmails(newEvent);


        res.status(201).json({ msg: 'Event created successfully', success: true, event: newEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});

adminRouter.put('/edit-event/:id', authenticateToken, async (req, res) => {
    try {
        const { title, description, date, time, location, imageUrl, videoUrl } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, {
            title, description, date, time, location, imageUrl, videoUrl
        }, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ msg: "Event not found", success: false });
        }

        await sendEventEmails(updatedEvent);

        res.status(200).json({ msg: "Event updated successfully", success: true, event: updatedEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', success: false });
    }
});
