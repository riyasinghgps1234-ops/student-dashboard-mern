const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = 5001;

// --- 1. Middleware ---
app.use(cors());          // Allows Frontend to talk to Backend
app.use(express.json());  // Allows Backend to read JSON data sent by Frontend
app.use(morgan('dev'));   // Professional logging: shows requests in terminal

// --- 2. Database Schema & Model ---
// Updated to match your PDF: includes Name, Age, and Course
const studentSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    age: { type: Number, required: true },
    course: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

// --- 3. API Routes ---

// Health Check (The "Front Door")
app.get('/', (req, res) => {
    res.send('Backend API is running on Port 5001. Use /api/students for data.');
});

// GET: Fetch all students
app.get('/api/students', async (req, res) => {
    try {
        const data = await Student.find().sort({ createdAt: -1 });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

// POST: Add a new student
app.post('/api/students', async (req, res) => {
    try {
        const { name, age, course } = req.body;
        const newStudent = new Student({ name, age, course });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ error: "Failed to create student. Check your data types." });
    }
});

// DELETE: Remove a student by ID
app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete operation failed" });
    }
});

// --- 4. Database Connection & Server Startup ---
mongoose.connect('mongodb://127.0.0.1:27017/studentDB') // renamed DB for clarity
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB (studentDB)");
    app.listen(PORT, () => {
        console.log(`SUCCESS: Server running on http://localhost:${PORT}`);
        console.log(`📁 API Endpoint: http://localhost:${PORT}/api/students`);
    });
  })
  .catch(err => {
    console.error("ERROR: Could not connect to MongoDB", err);
  });