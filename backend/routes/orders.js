const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', [auth, upload.single('paymentScreenshot')], orderController.createOrder);

// @route   GET api/orders/my-orders
// @desc    Get current user orders
// @access  Private
router.get('/my-orders', auth, orderController.getUserOrders);

// @route   GET api/orders
// @desc    Get all orders (Admin)
// @access  Private (Admin Role Checked in Controller)
router.get('/', auth, orderController.getAllOrders);

// @route   PUT api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin)
router.put('/:id/status', auth, orderController.updateOrderStatus);

module.exports = router;
