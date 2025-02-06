const express = require('express');
const router = express.Router();
const GroupMessage = require('../models/GroupMessage');

// GET /api/messages?room=ROOM_NAME
router.get('/', async (req, res) => {
    try {
        const room = req.query.room;
        if (!room) {
            return res.status(400).json({ error: "Room query parameter is required" });
        }
        // Retrieve messages for the given room sorted by date_sent ascending
        const messages = await GroupMessage.find({ room }).sort({ date_sent: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
