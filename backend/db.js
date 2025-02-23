import mongoose from 'mongoose';

await mongoose.connect('mongodb+srv://srecharandesu:charan%402006@cluster0.a9berin.mongodb.net/CampusHuB')

// User Schema (for students/organizers)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'organizer'], default: 'student' },
}, { timestamps: true });

// Event Schema
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Registered users
    imageUrl: { type: String }, // Optional image link
    videoUrl: { type: String }, // Optional video link
}, { timestamps: true });

// Registration Schema (For event sign-ups)
const registrationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Admin Schema
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' },
}, { timestamps: true });

// Mongoose Models
export const User = mongoose.model('User', userSchema);
export const Event = mongoose.model('Event', eventSchema);
export const Registration = mongoose.model('Registration', registrationSchema);
export const Admin = mongoose.model('Admin', adminSchema);
