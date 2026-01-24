const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected.');
        const services = await Service.find({});
        console.log('--- DB SERVICES START ---');
        console.log(JSON.stringify(services, null, 2));
        console.log('--- DB SERVICES END ---');

        // Optional: Delete 'bcgb' if found
        const target = services.find(s => s.title === 'bcgb');
        if (target) {
            console.log('Deleting service:', target._id);
            await Service.findByIdAndDelete(target._id);
            console.log('Deleted.');
        } else {
            console.log('Service "bcgb" not found in DB.');
        }

        process.exit(0);
    })
    .catch(err => console.error(err));
