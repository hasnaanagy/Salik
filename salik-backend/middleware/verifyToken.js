const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
        const user = await User.findById(decoded.userId); // Fetch user from DB

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Attach full user object to request
        console.log("Authenticated User:", req.user); // Debug log

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { verifyToken };
