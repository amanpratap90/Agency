const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_change_me';

// GET /check - Check if admin exists (to show Init or Login screen)
router.get('/check', async (req, res) => {
    try {
        const count = await Admin.countDocuments();
        res.json({ initialized: count > 0 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /init - Initialize the first admin
router.post('/init', async (req, res) => {
    try {
        const count = await Admin.countDocuments();
        if (count > 0) {
            return res.status(400).json({ message: "Admin already initialized" });
        }

        const admin = new Admin({
            username: req.body.username,
            secretKey: req.body.secretKey
        });

        await admin.save();
        res.json({ success: true, message: "Admin initialized" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /login - Verify credentials
router.post('/login', async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username });
        if (!admin) {
            return res.status(401).json({ message: "Invalid username" });
        }

        if (admin.secretKey !== req.body.secretKey) {
            return res.status(401).json({ message: "Invalid secret key" });
        }

        // Issue JWT for Admin
        const payload = { user: { id: admin.id, role: 'admin', username: admin.username } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ success: true, username: admin.username, token });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /reset - Reset secret key using username
router.post('/reset', async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username });
        if (!admin) {
            return res.status(404).json({ message: "Username not found" });
        }

        admin.secretKey = req.body.newSecretKey;
        await admin.save();

        res.json({ success: true, message: "Secret key reset successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
