const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');



// Signup Controller
exports.signup = async (req, res) => {
    const { fullName, phone, password, nationalId } = req.body;

    if (!fullName || !phone || !password || !nationalId) {
        return res.status(400).json({ message: 'Please provide all the required fields!' });
    }

    try {
        // Check if the user already exists by phone number or nationalId
        const userExists = await User.findOne({ $or: [{ phone }, { nationalId }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this phone number or national ID already exists!' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with default type "customer"
        const newUser = new User({
            fullName,
            phone,
            password: hashedPassword,
            nationalId,
        });

        // Save user to DB
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error, please try again' });
    }
};


// Login Controller
exports.login = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: 'Please provide both phone number and password!' });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: 'Invalid phone number or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid phone number or password' });
        }

        // Create and sign JWT token with user info (including type/role)
        const token = jwt.sign(
            { userId: user._id, type: user.type },
            process.env.JWT_SECRET, // Secret key stored in environment variable
            { expiresIn: '1h' }    // Token expiration time
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error, please try again' });
    }
};
// authController.js
exports.switchRole = async (req, res) => {
    try {
        const user = await User.findById(req.userId); // Get the authenticated user from token
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Toggle the user role between 'customer' and 'provider'
        user.type = user.type === "customer" ? "provider" : "customer";

        await user.save();

        res.status(200).json({
            message: "Role switched successfully",
            newRole: user.type
        });
    } catch (err) {
        res.status(500).json({ message: "Error switching role", error: err });
    }
};
