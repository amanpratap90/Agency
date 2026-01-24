require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*' // Allow all origins strictly
}));
app.use(express.json());

// Database Connection
console.log('Attempting to connect to MongoDB...');
// console.log('URI:', process.env.MONGO_URI); // Debugging only - be careful with passwords

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error details:', err);
        process.exit(1);
    });

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('GS Agency Backend is Running');
});

// Import Routes
app.use('/api/services', require('./routes/services'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

// Fallback for missing /api in frontend config
app.use('/services', require('./routes/services'));
app.use('/reviews', require('./routes/reviews'));
app.use('/contact', require('./routes/contact'));
app.use('/admin', require('./routes/admin'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
