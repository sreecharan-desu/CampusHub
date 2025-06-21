# Repository Documentation

## Repository Architecture

```mermaid
graph TB
    A[Repository] --> B[Modules: 1]
    A --> C[Sections: 2]
    B --> D[Core Components]
    B --> E[UI Components]
    B --> F[Utilities]
    C --> G[API Documentation]
    C --> H[Implementation Guides]
    C --> I[Code Examples]
    
    style A fill:#10b981,stroke:#059669,color:#ffffff
    style B fill:#3b82f6,stroke:#2563eb,color:#ffffff
    style C fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
```

## Table of Contents

### 1. User Management and Data Modeling

No description available

**Sections:**


**1.** [CampusHuB Database Schema: Mongoose Models for Users, Events, and Registrations](#section-link-module-module_miscellaneous_utilities-section-optimized_campushub_database_schema:_mongoose_models_for_users,_events,_and_registrations)

**2.** [Managing User Authentication State with Recoil.js](#section-link-module-module_miscellaneous_utilities-section-optimized_managing_user_authentication_state_with_recoil.js)

---



## Navigation Guide

- **Modules**: Browse through organized code modules in the left sidebar
- **Sections**: Each module contains multiple documentation sections
- **Search**: Use the search bar to quickly find specific content
- **Headings**: Use the right sidebar to navigate within long documents
- **Actions**: Copy or download any section content using the toolbar buttons

## CampusHuB Database Schema Documentation

This document details the database schema for the CampusHuB application, implemented using Mongoose and MongoDB. It covers the schema definitions for users, events, registrations, and administrators, along with connection details and model exports.

### Database Connection

The application connects to a MongoDB Atlas cluster using Mongoose. The connection is established using the `connectDB` function:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://srecharandesu:charan%402006@cluster0.a9berin.mongodb.net/CampusHuB')
}

connectDB();
```

This function uses the provided connection string to connect to the 'CampusHuB' database. The `connectDB()` function is immediately invoked to establish the connection when the module is loaded.

### Schema Definitions

The database schema defines the structure and constraints for each collection in the MongoDB database. The following schemas are defined:

#### 1. User Schema

The `userSchema` defines the structure for user documents, representing students and organizers.

```javascript
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'organizer'], default: 'student' },
}, { timestamps: true });
```

**Fields:**

*   `username`:  The user's username (String, required).
*   `email`: The user's email address (String, required, unique).
*   `password`: The user's password (String, required).
*   `role`: The user's role (String, enum: `['student', 'organizer']`, default: `student`).

The `timestamps: true` option automatically adds `createdAt` and `updatedAt` fields to each document.

#### 2. Event Schema

The `eventSchema` defines the structure for event documents.

```javascript
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
```

**Fields:**

*   `title`: The event title (String, required).
*   `description`: A description of the event (String).
*   `date`: The date of the event (Date, required).
*   `time`: The time of the event (String, required).
*   `location`: The location of the event (String, required).
*   `organizer`: A reference to the User who organized the event (ObjectId, ref: 'User', required).
*   `attendees`: An array of references to Users who have registered for the event (Array of ObjectIds, ref: 'User').
*   `imageUrl`:  Optional URL to an image for the event (String).
*   `videoUrl`: Optional URL to a video for the event (String).

The `organizer` and `attendees` fields use `mongoose.Schema.Types.ObjectId` to establish relationships with the `User` model. The `ref: 'User'` option tells Mongoose to populate these fields with User documents when queried.

#### 3. Registration Schema

The `registrationSchema` defines the structure for registration documents, representing user sign-ups for events.

```javascript
const registrationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });
```

**Fields:**

*   `user`: A reference to the User who registered for the event (ObjectId, ref: 'User', required).
*   `event`: A reference to the Event the user registered for (ObjectId, ref: 'Event', required).
*   `registeredAt`: The date and time the user registered (Date, default: `Date.now`).

The `user` and `event` fields use `mongoose.Schema.Types.ObjectId` to establish relationships with the `User` and `Event` models, respectively.

#### 4. Admin Schema

The `adminSchema` defines the structure for admin user documents.

```javascript
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' },
}, { timestamps: true });
```

**Fields:**

*   `username`: The admin's username (String, required).
*   `email`: The admin's email address (String, required, unique).
*   `password`: The admin's password (String, required).
*   `role`: The admin's role (String, enum: `['admin']`, default: `admin`).

The `timestamps: true` option automatically adds `createdAt` and `updatedAt` fields to each document.

### Mongoose Models

The schemas are compiled into Mongoose models, which provide an interface for interacting with the database.

```javascript
const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);
const Registration = mongoose.model('Registration', registrationSchema);
const Admin = mongoose.model('Admin', adminSchema);
```

These models are then exported for use in other parts of the application.

### Module Exports

The module exports the Mongoose models, allowing other modules to interact with the database.

```javascript
module.exports = {
    User,
    Event,
    Registration,
    Admin
};
```

### Data Flow and Workflow

The following diagram illustrates the data flow between the User, Event, and Registration models:

```mermaid
graph LR
    User --> Registration
    Event --> Registration
    Registration --> User
    Registration --> Event
    style User fill:#f9f,stroke:#333,stroke-width:2px
    style Event fill:#ccf,stroke:#333,stroke-width:2px
    style Registration fill:#ffc,stroke:#333,stroke-width:2px
```

**Explanation:**

1.  A `User` can create multiple `Event` records (organizer).
2.  A `User` can register for multiple `Event` records, creating `Registration` records.
3.  Each `Registration` record links a specific `User` to a specific `Event`.
4.  An `Event` can have multiple `Registration` records, representing the attendees.

### Example Usage

Here's an example of how to create a new event and register a user for it:

```javascript
const { User, Event, Registration } = require('./db');

async function createEventAndRegisterUser(userId, eventData) {
    try {
        // 1. Find the user (organizer)
        const organizer = await User.findById(userId);
        if (!organizer) {
            throw new Error('Organizer not found');
        }

        // 2. Create a new event
        const newEvent = new Event({
            ...eventData,
            organizer: organizer._id
        });
        await newEvent.save();

        // 3. Find a user to register for the event (assuming you have another user's ID)
        const attendeeId = 'someOtherUserId'; // Replace with an actual user ID
        const attendee = await User.findById(attendeeId);
         if (!attendee) {
            throw new Error('Attendee not found');
        }

        // 4. Create a new registration
        const newRegistration = new Registration({
            user: attendee._id,
            event: newEvent._id
        });
        await newRegistration.save();

        console.log('Event created and user registered successfully!');
    } catch (error) {
        console.error('Error creating event and registering user:', error);
    }
}

// Example usage:
const eventData = {
    title: 'Campus Hackathon',
    description: 'A 24-hour coding competition',
    date: new Date('2024-03-15'),
    time: '9:00 AM',
    location: 'University Auditorium'
};

createEventAndRegisterUser('organizerUserId', eventData); // Replace 'organizerUserId' with an actual user ID
```

This example demonstrates how to use the `User`, `Event`, and `Registration` models to create new documents and establish relationships between them.  It also shows basic error handling.

### Important Implementation Details and Gotchas

*   **Unique Email Addresses:** The `email` field in both the `userSchema` and `adminSchema` is defined as `unique: true`. This ensures that each user and admin has a unique email address in the database.  Attempting to create a new user or admin with an existing email address will result in an error.
*   **Referencing Models:** The `organizer`, `attendees`, `user`, and `event` fields in the schemas use `mongoose.Schema.Types.ObjectId` and `ref` to establish relationships between models.  It's crucial to ensure that the referenced models exist when creating new documents.  For example, when creating a new event, the `organizer` field must contain a valid ObjectId of an existing User document.
*   **Data Validation:** Mongoose provides built-in data validation capabilities.  The `required: true` option ensures that certain fields are present in the document.  The `enum` option restricts the values of a field to a predefined set of values.  It's important to leverage these validation features to ensure data integrity.
*   **Timestamps:** The `timestamps: true` option automatically adds `createdAt` and `updatedAt` fields to each document.  These fields can be useful for tracking when a document was created and last updated.
*   **Populating References:** When querying documents that contain references to other models, you can use the `populate()` method to retrieve the referenced documents.  For example, to retrieve an event with the organizer's information, you can use the following code:

    ```javascript
    const event = await Event.findById(eventId).populate('organizer');
    ```

    This will replace the `organizer` field in the event document with the actual User document.

### Common Issues and Troubleshooting

*   **Connection Errors:** If you encounter connection errors, ensure that the connection string is correct and that the MongoDB Atlas cluster is accessible from your network.  Also, verify that the Mongoose version is compatible with the MongoDB server version.
*   **Validation Errors:** If you encounter validation errors, check the schema definitions and ensure that the data you are trying to save meets the validation criteria.  For example, if a field is marked as `required: true`, make sure that it is present in the data.
*   **Reference Errors:** If you encounter reference errors, ensure that the referenced models exist and that the ObjectIds are valid.  For example, if you are trying to create a new event with an organizer that does not exist, you will encounter a reference error.
*   **Data Integrity Issues:** To prevent data integrity issues, use transactions when performing multiple operations that must be atomic.  For example, when creating a new event and registering a user for it, you can use a transaction to ensure that both operations succeed or fail together.

### Performance Considerations and Optimization Strategies

*   **Indexing:** Create indexes on frequently queried fields to improve query performance.  For example, you can create an index on the `email` field in the `userSchema` to speed up user lookups by email address.
*   **Query Optimization:** Use the `explain()` method to analyze query performance and identify potential bottlenecks.  Optimize queries by using appropriate indexes, limiting the number of fields returned, and using efficient query operators.
*   **Caching:** Implement caching to reduce the number of database queries.  You can use a caching layer such as Redis or Memcached to cache frequently accessed data.
*   **Connection Pooling:** Mongoose uses connection pooling by default.  Ensure that the connection pool size is appropriate for your application's workload.
*   **Data Modeling:** Choose the appropriate data modeling strategy for your application's needs.  Consider using embedded documents or denormalization to improve performance in certain cases.

### Security Implications and Best Practices

*   **Password Hashing:** Always hash passwords before storing them in the database.  Use a strong hashing algorithm such as bcrypt or scrypt.
*   **Data Validation:** Validate all user input to prevent injection attacks.  Use Mongoose's built-in data validation capabilities to ensure that data meets the required criteria.
*   **Authentication and Authorization:** Implement proper authentication and authorization mechanisms to protect sensitive data.  Use JSON Web Tokens (JWT) or other secure authentication methods.
*   **Rate Limiting:** Implement rate limiting to prevent brute-force attacks.
*   **Regular Security Audits:** Conduct regular security audits to identify and address potential vulnerabilities.
*   **Protect Connection String:** Never expose your MongoDB connection string in client-side code or public repositories. Use environment variables to store sensitive information.

## CampusHub Frontend and Backend System Documentation

This document provides a comprehensive technical overview of the CampusHub system, covering its architecture, workflows, and implementation details. It aims to equip developers with the knowledge necessary to understand, maintain, and extend the system.

### 1. System Overview

CampusHub is a platform designed to facilitate event discovery and registration within a university or college campus. It provides a user-friendly interface for students to browse events, register for them, and manage their event participation.  Administrators have the ability to create, update, and delete events, as well as manage user registrations. The system is built using a React frontend, a Node.js/Express backend, and a MongoDB database. Recoil.js is used for state management in the frontend.

### 2. Architecture

The CampusHub system follows a typical three-tier architecture:

*   **Frontend (React):**  Handles the user interface and user interactions. It communicates with the backend via API calls.
*   **Backend (Node.js/Express):**  Provides the API endpoints, handles business logic, and interacts with the database.
*   **Database (MongoDB):**  Stores user data, event information, and registration details.

The frontend uses Recoil.js for managing global application state, such as user authentication status and admin authentication status.

### 3. Component Breakdown

#### 3.1 Frontend Components

The frontend is structured into several key components:

*   **`src/App.jsx`:** The main application component that sets up routing and the overall structure. It uses React Router for navigation and RecoilRoot for state management.
*   **`src/pages/LandingPage.jsx`:** The landing page for the application, providing an overview of the platform's features.
*   **`src/pages/Signin.jsx`:**  Handles user sign-in functionality, including email validation and authentication against the backend API.
*   **`src/pages/Signup.jsx`:**  Handles user registration, including form validation and communication with the backend API to create new user accounts.
*   **`src/pages/Dashboard.jsx`:**  The main dashboard for authenticated users, displaying a list of events and allowing users to register for them.
*   **`src/pages/AdminSignin.jsx`:** Handles admin sign-in functionality.
*   **`src/pages/Admindashboard.jsx`:** The main dashboard for authenticated admins, allowing event management.
*   **`src/state/userAtom.js`:** Defines the `userState` Recoil atom, which stores the current user's information.
*   **`src/state/adminAtom.js`:** Defines the `adminState` Recoil atom, which stores the current admin's information.

#### 3.2 Backend Components

The backend consists of the following components:

*   **`backend/index.js`:** The main entry point for the backend application. It sets up the Express server, defines API routes, and connects to the MongoDB database.
*   **`backend/db/db.js`:** Defines the Mongoose models for User, Event, Registration, and Admin.

### 4. Key Workflows and Data Flows

#### 4.1 User Authentication Workflow

This workflow describes the process of user sign-up and sign-in.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Enters sign-up/sign-in details
    Frontend->>Backend: Sends sign-up/sign-in request (email, password)
    Backend->>Database: Checks if user exists (sign-up) or validates credentials (sign-in)
    alt User exists (sign-up) or invalid credentials (sign-in)
        Backend-->>Frontend: Returns error message
    else Valid user/credentials
        Backend->>Backend: Hashes password (sign-up)
        Backend->>Database: Creates user (sign-up) or retrieves user data (sign-in)
        Database-->>Backend: Returns user data
        Backend->>Backend: Generates JWT token
        Backend-->>Frontend: Returns success message and JWT token
        Frontend->>Frontend: Stores JWT token in localStorage
        Frontend->>Frontend: Sets user state using Recoil
    end
    Frontend-->>User: Redirects to dashboard
```

**Explanation:**

1.  The user interacts with the frontend by entering their sign-up or sign-in details.
2.  The frontend sends a request to the backend with the user's email and password.
3.  The backend checks if the user exists in the database (for sign-up) or validates the credentials (for sign-in).
4.  If the user exists (sign-up) or the credentials are invalid (sign-in), the backend returns an error message to the frontend.
5.  If the user does not exist (sign-up) or the credentials are valid (sign-in), the backend hashes the password (sign-up), creates a new user in the database (sign-up), or retrieves the user data from the database (sign-in).
6.  The backend generates a JWT token and returns it to the frontend along with a success message.
7.  The frontend stores the JWT token in localStorage and sets the user state using Recoil.
8.  The frontend redirects the user to the dashboard.

**Code Example (Signin.jsx):**

```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validation = validateEmail(email);
    if (!validation.valid) {
        setEmailError(validation.message);
        return;
    }

    setIsLoading(true);

    try {
        // Use normalized (trimmed and lowercase) email for the API request
        const normalizedEmail = validation.normalizedEmail;

        const response = await axios.post('https://campushub-api.vercel.app/user/signin', {
            email: normalizedEmail,
            password
        });

        const { token, user } = response.data;

        localStorage.setItem('token', token);
        setUser(user);
        navigate('/dashboard');
    } catch (err) {
        setError(err.response?.data?.msg || 'Something went wrong. Please try again.');
    } finally {
        setIsLoading(false);
    }
};
```

**Code Example (backend/index.js):**

```javascript
async signin(req, res) {
    try {
        const { email, password } = authSchema.parse(req.body);

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, msg: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email },
            process.env.JWT_SECRET,
        );

        res.json({
            success: true,
            msg: 'User logged in successfully',
            token,
            user: { id: user._id, username: user.username, email }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid input',
                errors: error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`)
            });
        }
        throw error;
    }
},
```

#### 4.2 Event Registration Workflow

This workflow describes the process of a user registering for an event.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Clicks "Register" for an event
    Frontend->>Backend: Sends registration request (event ID, user token)
    Backend->>Backend: Authenticates user via JWT token
    Backend->>Database: Checks if user is already registered for the event
    alt User is already registered
        Backend-->>Frontend: Returns error message
    else User is not registered
        Backend->>Database: Creates new registration record
        Backend->>Database: Updates event with user as attendee
        Database-->>Backend: Returns updated event data
        Backend->>Backend: Sends event registration email to user
        Backend-->>Frontend: Returns success message
    end
    Frontend-->>User: Updates event list to show registered status
```

**Explanation:**

1.  The user clicks the "Register" button for a specific event on the frontend.
2.  The frontend sends a registration request to the backend, including the event ID and the user's JWT token for authentication.
3.  The backend authenticates the user using the JWT token.
4.  The backend checks the database to see if the user is already registered for the event.
5.  If the user is already registered, the backend returns an error message to the frontend.
6.  If the user is not registered, the backend creates a new registration record in the database and updates the event record to include the user as an attendee.
7.  The backend sends an event registration email to the user.
8.  The backend returns a success message to the frontend.
9.  The frontend updates the event list to show the registered status for the user.

**Code Example (Dashboard.jsx):**

```javascript
const handleRegisterForEvent = async (eventId) => {
    try {
        setRegistering(true);
        const response = await axios.post(`https://campushub-api.vercel.app/user/register-event/${eventId}`);

        // Update the event in the UI to show registered status
        setEvents(prevEvents =>
            prevEvents.map(event =>
                event._id === eventId
                    ? { ...event, attendees: [...(event.attendees || []), userProfile._id] }
                    : event
            )
        );

        setNotification({
            show: true,
            message: response.data.msg || "Registered successfully!",
            type: "success"
        });

        setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
        }, 3000);
    } catch (err) {
        console.error("Registration error:", err);
        setNotification({
            show: true,
            message: err.response?.data?.msg || "Failed to register for event",
            type: "error"
        });

        setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
        }, 3000);
    } finally {
        setRegistering(false);
    }
};
```

**Code Example (backend/index.js):**

```javascript
async registerForEvent(req, res) {
    const event = await Event.findById(req.params.id);
    if (!event) {
        return res.status(404).json({ success: false, msg: 'Event not found' });
    }

    const existingRegistration = await Registration.findOne({
        user: req.user.id,
        event: event._id
    });

    if (existingRegistration) {
        return res.status(400).json({ success: false, msg: 'Already registered' });
    }

    await Registration.create({ user: req.user.id, event: event._id });
    await event.updateOne({ $push: { attendees: req.user.id } });
    await emailConfig.sendEventRegistrationEmail(event, req.user);

    res.json({ success: true, msg: 'Registered successfully!' });
}
```

#### 4.3 Admin Event Management Workflow

This workflow describes the process of an admin creating, updating, and deleting events.

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant Backend
    participant Database

    Admin->>Frontend: Interacts with event management UI (create/update/delete)
    Frontend->>Backend: Sends event management request (event data, admin token)
    Backend->>Backend: Authenticates admin via JWT token
    Backend->>Database: Creates/Updates/Deletes event in database
    Database-->>Backend: Returns updated event data
    Backend->>Backend: Sends event notification email to all users (create/update)
    Backend-->>Frontend: Returns success message
    Frontend-->>Admin: Updates event list in UI
```

**Explanation:**

1.  The admin interacts with the event management UI on the frontend to create, update, or delete an event.
2.  The frontend sends an event management request to the backend, including the event data and the admin's JWT token for authentication.
3.  The backend authenticates the admin using the JWT token.
4.  The backend creates, updates, or deletes the event in the database.
5.  The backend sends an event notification email to all users if the event was created or updated.
6.  The backend returns a success message to the frontend.
7.  The frontend updates the event list in the UI to reflect the changes.

**Code Example (Admindashboard.jsx - handleCreateEvent):**

```javascript
const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await axios.post('https://campushub-api.vercel.app/admin/create-event', eventForm);
        if (response.data.success) {
            setEvents([...events, response.data.event]);
            setIsCreatingEvent(false);
            resetEventForm();
            showToast('Event created successfully', 'success');
        }
    } catch (error) {
        console.log(error);
        handleError('Failed to create event');
    } finally {
        setLoading(false);
    }
};
```

**Code Example (backend/index.js - createEvent):**

```javascript
async createEvent(req, res) {
    try {
        const eventData = eventSchema.parse(req.body);

        const newEvent = await Event.create({
            ...eventData,
            organizer: req.user.id,
            attendees: []
        });

        await emailConfig.sendEventNotification(newEvent);

        res.status(201).json({
            success: true,
            msg: 'Event created successfully',
            event: newEvent
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid input',
                errors: error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`)
            });
        }
        throw error;
    }
},
```

### 5. Recoil State Management

Recoil.js is used for managing global application state in the frontend. The key atoms are:

*   **`userState` (src/state/userAtom.js):** Stores the current user's information (ID, username, email).  It's initialized to `null` when the user is not authenticated.
*   **`adminState` (src/state/adminAtom.js):** Stores the current admin's information (ID, adminName, email). It's initialized to `null` when the admin is not authenticated.

These atoms are used in components like `Dashboard.jsx`, `Signin.jsx`, `AdminDashboard.jsx`, and `AdminSignin.jsx` to access and update the user/admin authentication state.

**Code Example (userAtom.js):**

```javascript
import { atom } from 'recoil';

export const userState = atom({
    key: 'userState',
    default: null,
});
```

**Code Example (Dashboard.jsx):**

```javascript
import { useRecoilValue } from "recoil";
import { userState } from "../state/userAtom";

export default function Dashboard() {
    const user = useRecoilValue(userState);
    // ...
}
```

### 6. API Endpoints

The backend exposes the following API endpoints:

*   **`POST /user/signup`:**  Registers a new user.
*   **`POST /user/signin`:**  Authenticates an existing user and returns a JWT token.
*   **`GET /user/profile`:**  Retrieves the profile information of the authenticated user. Requires a valid JWT token in the `Authorization` header.
*   **`GET /user/events`:** Retrieves all events.
*   **`POST /user/register-event/:id`:**  Registers the authenticated user for a specific event. Requires a valid JWT token in the `Authorization` header.
*   **`POST /admin/signup`:** Registers a new admin.
*   **`POST /admin/signin`:** Authenticates an existing admin and returns a JWT token.
*   **`GET /admin/profile`:** Retrieves the profile information of the authenticated admin. Requires a valid JWT token in the `Authorization` header.
*   **`POST /admin/create-event`:** Creates a new event. Requires a valid JWT token in the `Authorization` header and admin privileges.
*   **`PUT /admin/edit-event/:id`:** Updates an existing event. Requires a valid JWT token in the `Authorization` header and admin privileges.
*   **`DELETE /admin/delete-event/:id`:** Deletes an event. Requires a valid JWT token in the `Authorization` header and admin privileges.
*   **`GET /admin/event/:eventId/registrations`:** Retrieves the list of registrations for a specific event. Requires a valid JWT token in the `Authorization` header and admin privileges.
*   **`GET /admin/events`:** Retrieves all events. Requires a valid JWT token in the `Authorization` header and admin privileges.

### 7. Implementation Details and Gotchas

*   **Email Validation:** The `Signup.jsx` component enforces specific email validation rules, requiring emails to start with "o" and end with "@rguktong.ac.in". This is a specific requirement for the application's target audience and might need to be adjusted for other contexts.
*   **JWT Authentication:** The backend uses JWT (JSON Web Tokens) for authentication.  The JWT secret key is stored in the `process.env.JWT_SECRET` environment variable.  It's crucial to keep this secret key secure.
*   **Error Handling:**  Both the frontend and backend include error handling mechanisms. The frontend displays error messages to the user, while the backend logs errors and returns appropriate HTTP status codes.
*   **CORS:** The backend uses the `cors` middleware to enable Cross-Origin Resource Sharing, allowing the frontend to make API requests to the backend.
*   **Password Hashing:** The backend uses `bcrypt` to hash passwords before storing them in the database. This enhances security by preventing passwords from being stored in plain text.
*   **Axios Configuration:** The `Dashboard.jsx` component configures Axios to include the JWT token in the `Authorization` header for all API requests. This simplifies the process of authenticating requests.

### 8. Common Issues and Troubleshooting

*   **"Invalid Credentials" Error:** This error typically occurs during sign-in if the user enters an incorrect email or password.  Verify that the email and password are correct and that the user account exists.
*   **"Access Denied" Error:** This error indicates that the user does not have the necessary permissions to access a specific resource.  Ensure that the user is authenticated and has the required role (e.g., admin).
*   **"Failed to Load Dashboard Data" Error:** This error can occur if the backend API is unavailable or if there is a network connectivity issue.  Check the backend server status and network connection.
*   **Email Sending Failures:** If email sending fails, verify that the email configuration is correct and that the email server is properly configured. Check the `EMAIL_USER` and `EMAIL_PASS` environment variables.
*   **Recoil State Not Updating:** If the Recoil state is not updating as expected, ensure that the components are properly subscribed to the atoms and that the state is being updated correctly using `useSetRecoilState`.

### 9. Advanced Configuration and Customization Options

*   **Email Configuration:** The email sending functionality can be customized by modifying the `emailConfig` object in `backend/index.js`.  You can configure different email providers, templates, and sending options.
*   **Authentication:** The authentication mechanism can be extended to support other authentication methods, such as social login or multi-factor authentication.
*   **Database:** The system can be configured to use a different database by modifying the database connection settings in `backend/db/db.js`.
*   **Frontend Styling:** The frontend styling can be customized by modifying the CSS files in the `src/` directory.

### 10. Performance Considerations and Optimization Strategies

*   **Database Queries:** Optimize database queries to improve performance. Use indexes to speed up queries and avoid fetching unnecessary data.
*   **Caching:** Implement caching mechanisms to reduce the load on the database.  Cache frequently accessed data in memory or using a dedicated caching service.
*   **Code Splitting:** Use code splitting to reduce the initial load time of the frontend application.  Split the application into smaller chunks that can be loaded on demand.
*   **Image Optimization:** Optimize images to reduce their file size. Use appropriate image formats and compression levels.
*   **Lazy Loading:** Implement lazy loading for images and other resources that are not immediately visible on the screen.

### 11. Security Implications and Best Practices

*   **Protect JWT Secret:**  The JWT secret key is critical for security.  Store it securely and never expose it in the code. Use environment variables to manage the secret key.
*   **Input Validation:**  Validate all user inputs to prevent injection attacks and other security vulnerabilities. Use Zod schemas for input validation.
*   **Password Hashing:**  Always hash passwords before storing them in the database. Use a strong hashing algorithm like bcrypt.
*   **Authorization:**  Implement proper authorization mechanisms to ensure that users can only access the resources they are authorized to access. Use middleware to enforce authorization rules.
*   **HTTPS:**  Use HTTPS to encrypt all communication between the frontend and backend.
*   **Regular Security Audits:**  Conduct regular security audits to identify and address potential security vulnerabilities.
