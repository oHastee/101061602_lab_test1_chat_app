// routes/privateConversations.js
const express = require('express');
const router = express.Router();
const PrivateMessage = require('../models/PrivateMessage');

// GET /api/privateConversations?user=USERNAME
router.get('/', async (req, res) => {
    const user = req.query.user;
    if (!user) {
        return res.status(400).json({ error: "user query parameter is required" });
    }
    try {
        // Users that the current user has sent messages to.
        const toPartners = await PrivateMessage.distinct("to_user", { from_user: user });
        // Users that have sent messages to the current user.
        const fromPartners = await PrivateMessage.distinct("from_user", { to_user: user });
        // Combine and remove duplicates (and remove self)
        const partnersSet = new Set([...toPartners, ...fromPartners]);
        partnersSet.delete(user);
        const partners = Array.from(partnersSet);
        res.json(partners);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
