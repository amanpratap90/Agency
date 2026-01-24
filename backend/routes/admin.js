const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

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

        res.json({ success: true, username: admin.username });
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
