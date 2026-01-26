const Order = require('../models/Order');

// Create Order
exports.createOrder = async (req, res) => {
    try {
        const { serviceTitle, subServiceTitle, amount, quantity, country, targetUrl, comments, utrNumber } = req.body;

        if (!req.file) {
            return res.status(400).json({ msg: 'Payment screenshot is required' });
        }

        const newOrder = new Order({
            user: req.user.id,
            serviceTitle,
            subServiceTitle,
            amount,
            quantity,
            country,
            targetUrl,
            comments,
            utrNumber,
            paymentScreenshot: req.file.path // Store path to file
        });

        const order = await newOrder.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get User Orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        // Simple check if user is admin (role based check should be in middleware ideally)
        console.log("Admin Check - Role:", req.user.role); // Debug Log
        if (req.user.role !== 'admin') {
            console.log("Access Denied for:", req.user.id);
            return res.status(403).json({ msg: 'Access denied' });
        }

        const orders = await Order.find().populate('user', ['username', 'email']).sort({ createdAt: -1 });
        console.log("Orders Fetched Count:", orders.length); // Debug Log
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

        const { status } = req.body;
        let order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ msg: 'Order not found' });

        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
