const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { username, firstname, lastname, password } = req.body;
        // Create a new user document
        const user = new User({ username, firstname, lastname, password });
        await user.save();
        console.log('User created:', user);
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(400).send({ error: error.message });
    }
});

// Login Route (for reference)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (!user) return res.status(401).send({ error: 'Invalid credentials' });
        res.send({ username: user.username });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
