const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
    try {
        const { username, firstname, lastname, password } = req.body;
        const user = new User({ username, firstname, lastname, password });
        await user.save();
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).send({ error: 'Invalid credentials' });
    res.send({ username: user.username });
});

module.exports = router;