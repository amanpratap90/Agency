const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Smartphone' }, // Name of the Lucide icon
    gradient: { type: String, default: 'from-blue-500/20 to-cyan-500/20' }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
