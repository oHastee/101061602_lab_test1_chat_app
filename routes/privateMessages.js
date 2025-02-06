// routes/privateMessages.js
const express = require('express');
const router = express.Router();
const PrivateMessage = require('../models/PrivateMessage');

// GET /api/privateMessages?user1=...&user2=...
router.get('/', async (req, res) => {
    try {
        const { user1, user2 } = req.query;
        if (!user1 || !user2) {
            return res.status(400).json({ error: "Both user1 and user2 are required" });
        }
        // Retrieve messages between user1 and user2 (in both directions), sorted by date_sent
        const messages = await PrivateMessage.find({
            $or: [
                { from_user: user1, to_user: user2 },
                { from_user: user2, to_user: user1 }
            ]
        }).sort({ date_sent: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
