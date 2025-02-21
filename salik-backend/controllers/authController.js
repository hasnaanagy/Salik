const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup Controller
exports.signup = async (req, res) => {
  const { fullName, phone, password, nationalId } = req.body;

  if (!fullName || !phone || !password || !nationalId) {
    return res.status(400).json({
      status: 400,
      message: "Please provide all the required fields!",
    });
  }

  try {
    // Check if the user already exists by phone number or nationalId
    const userExists = await User.findOne({ $or: [{ phone }, { nationalId }] });
    if (userExists) {
      return res.status(400).json({
        status: 400,
        message: "User with this phone number or national ID already exists!",
      });
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

    res
      .status(201)
      .json({ status: 201, message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, message: "Server error, please try again" });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({
      status: 400,
      message: "Please provide both phone number and password!",
    });
  }

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid phone number or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid phone number or password" });
    }

    // Create and sign JWT token with user info (including type/role)
    const token = jwt.sign(
      { userId: user._id, type: user.type },
      process.env.JWT_SECRET, // Secret key stored in environment variable
      { expiresIn: "1h" } // Token expiration time
    );

    res.status(200).json({ status: 200, message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, message: "Server error, please try again" });
  }
};

// Switch Role Controller
exports.switchRole = async (req, res) => {
  try {
    const user = await User.findById(req.user_id); // Get the authenticated user from tokenId); // Get the authenticated user from token
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    // Toggle the user role between 'customer' and 'provider'
    user.type = user.type === "customer" ? "provider" : "customer";

    await user.save();

    res.status(200).json({
      status: 200,
      message: "Role switched successfully",
      newRole: user.type,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Error switching role",
      error: err.message,
    });
  }
};

// Get User Controller
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Get the authenticated user from token
    console.log(user);

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    res
      .status(200)
      .json({ status: 200, message: "User retrieved successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Error fetching user",
      error: err.message,
    });
  }
};

// Update User Controller
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Get the authenticated user from token

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 403,
        message: "Unauthorized: You can only update your own profile",
      });
    }
    // Update user details
    user.fullName = req.body.fullName || user.fullName;
    user.phone = req.body.phone || user.phone;
    user.password = req.body.password || user.password;
    user.nationalId = req.body.nationalId || user.nationalId;
    user.profileImg = req.body.profileImg || user.profileImg;
    user.licenseImage = req.body.licenseImage || user.licenseImage;
    user.nationalIdImage = req.body.nationalIdImage || user.nationalIdImage;

    await user.save();

    res.status(200).json({
      status: 200,
      message: "User updated successfully",
      updatedUser: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Error updating user",
      error: err.message, // Include the error message in the response
    });
  }
};
