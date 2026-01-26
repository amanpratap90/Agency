const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Smartphone' }, // Name of the Lucide icon
    gradient: { type: String, default: 'from-blue-500/20 to-cyan-500/20' },
    subServices: [{
        title: { type: String, required: true },
        price: { type: String, required: true },
        details: { type: String }, // Can be comma separated or just a string
        isPopular: { type: Boolean, default: false },
        buttonText: { type: String, default: 'Buy Now' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
