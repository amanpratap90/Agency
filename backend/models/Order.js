const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceTitle: {
        type: String,
        required: true
    },
    subServiceTitle: {
        type: String,
        required: true
    },
    packageDetails: {
        type: Object, // Could store price, quantity details snapshot
        required: false
    },
    country: {
        type: String,
        required: true
    },
    targetUrl: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        required: false
    },
    utrNumber: {
        type: String,
        required: true
    },
    paymentScreenshot: {
        type: String, // Path to file
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Done', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);
