require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');
        const count = await Admin.countDocuments();
        console.log('Admin Count:', count);
        if (count > 0) {
            const admins = await Admin.find();
            console.log('Existing Admins:', admins);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
