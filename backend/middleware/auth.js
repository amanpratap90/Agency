const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_change_me';

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    // Check for token
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        console.log("Auth Middleware Success:", req.user); // Debug Log
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err.message); // Debug Log
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
