const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// GET all approved reviews (for public site)
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all reviews (for admin dashboard)
router.get('/all', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new review
router.post('/', async (req, res) => {
    const review = new Review({
        name: req.body.name,
        role: req.body.role || 'Client',
        rating: req.body.rating,
        message: req.body.message
    });

    try {
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (Approve/Reject review)
router.put('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (req.body.isApproved != null) {
            review.isApproved = req.body.isApproved;
        }
        const updatedReview = await review.save();
        res.json(updatedReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a review
router.delete('/:id', async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
