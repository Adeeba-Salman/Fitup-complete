const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();


router.post('/register', async (req, res) => {
    console.log("In register")
    console.log(req.body);
    const { firstName, lastName, email,password,currentWeight,height,goalCalories,age,gender,goal,activityLevel } = req.body;
    const parsedAge = parseInt(age)
    const parsedWeight =parseFloat(currentWeight)
    const parsedHeight = parseFloat(height)

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (firstName , lastName , email, password , weight_kg , height_cm , daily_calorie_goal , age , gender , goal , activity_level ) VALUES (?, ?, ?, ? , ? , ? , ? , ? , ? , ? ,? )';

    db.query(query, [firstName,lastName,email,hashedPassword,parsedWeight,parsedHeight,goalCalories,parsedAge,gender,goal,activityLevel], (err, results) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Error registering user', error: err });
        }
        console.log("User Registered")
        res.status(201).json({ message: 'User registered successfully' });
    });
});

// Login
router.post('/login', (req, res) => {
    console.log("Hitting login route")
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching user' });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.json({ token });
    });
});

router.post('/logout', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Token is invalid or expired, send a 401 Unauthorized response
            return res.status(401).json({ message: 'Invalid or expired token, logged out successfully' });
        }

        // Token is valid, send a success message
        return res.status(200).json({ message: 'Logged out successfully' });
    });
});

module.exports = router;