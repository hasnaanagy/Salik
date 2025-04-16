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
    const userExists = await User.findOne({ $or: [{ phone }, { nationalId }] });
    if (userExists) {
      return res.status(400).json({
        status: 400,
        message: "User with this phone number or national ID already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      phone,
      password: hashedPassword,
      nationalId,
    });

    await newUser.save();
    res.status(201).json({ status: 201, message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error, please try again" });
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
      return res.status(400).json({ status: 400, message: "Invalid phone number or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 400, message: "Invalid phone number or password" });
    }

    const token = jwt.sign(
      { userId: user._id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Add expiration for security
    );

    res.status(200).json({
      status: 200,
      message: "Login successful",
      token,
      userType: user.type,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error, please try again" });
  }
};

// Switch Role Controller
exports.switchRole = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    if (user.type === "admin") {
      return res.status(403).json({ message: "Admins cannot switch roles" });
    }

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
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    res.status(200).json({ status: 200, message: "User retrieved successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Error fetching user", error: err.message });
  }
};

// Create Admin Controller
exports.createAdmin = async (req, res) => {
  const { fullName, phone, password, nationalId } = req.body;

  if (!fullName || !phone || !password || !nationalId) {
    return res.status(400).json({
      status: 400,
      message: "Please provide all the required fields!",
    });
  }

  try {
    const userExists = await User.findOne({ $or: [{ phone }, { nationalId }] });
    if (userExists) {
      return res.status(400).json({
        status: 400,
        message: "User with this phone number or national ID already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      fullName,
      phone,
      password: hashedPassword,
      nationalId,
      type: "admin",
    });

    await newAdmin.save();
    res.status(201).json({ status: 201, message: "Admin user created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error, please try again" });
  }
};

// Get Unverified Documents
exports.getUnverifiedDocuments = async (req, res) => {
  try {
    const users = await User.find({
      type: "provider",
      $or: [{ nationalIdStatus: "pending" }, { licenseStatus: "pending" }],
    }).select("fullName phone nationalId nationalIdImage licenseImage nationalIdStatus licenseStatus");

    if (users.length === 0) {
      return res.status(404).json({ message: "No unverified documents found" });
    }

    res.status(200).json({ message: "Unverified documents retrieved successfully", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify Document
exports.verifyDocument = async (req, res) => {
  const { userId, documentType, action } = req.body;

  if (!userId || !["nationalId", "license"].includes(documentType) || !["approve", "reject"].includes(action)) {
    return res.status(400).json({
      message: "User ID, valid document type (nationalId/license), and action (approve/reject) are required",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.type !== "provider") {
      return res.status(404).json({ message: "Provider not found" });
    }

    const imageField = documentType === "nationalId" ? "nationalIdImage" : "licenseImage";
    const statusField = documentType === "nationalId" ? "nationalIdStatus" : "licenseStatus";

    if (!user[imageField]) {
      return res.status(400).json({ message: `No ${documentType} image uploaded` });
    }

    if (action === "approve") {
      user[statusField] = "verified";
    } else if (action === "reject") {
      user[imageField] = "";
      user[statusField] = "rejected";
    }

    await user.save();
    res.status(200).json({
      message: `${documentType === "nationalId" ? "National ID" : "Driving License"} ${action}d successfully`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Filtered Users
exports.getFilteredUsers = async (req, res) => {
  try {
    const { type } = req.query;
    let filter = {};

    if (type && ["customer", "provider", "admin"].includes(type)) {
      filter.type = type;
    }

    const users = await User.find(filter).select("-password");

    const formattedUsers = users.map((user) => ({
      id: user._id,
      fullName: user.fullName,
      phone: user.phone,
      nationalId: user.nationalId,
      type: user.type,
      profileImg: user.profileImg,
      nationalIdStatus: user.nationalIdStatus,
      licenseStatus: user.licenseStatus,
      nationalIdImage: user.nationalIdImage,
      licenseImage: user.licenseImage,
    }));

    res.status(200).json({
      status: 200,
      message: type ? `${type} users retrieved successfully` : "All users retrieved successfully",
      count: formattedUsers.length, // Fixed typo: 'lengt' to 'length'
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: 500,
      message: "Server error while fetching users",
      error: error.message,
    });
  }
};

// Update User (Cloudinary URLs)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedData = { ...req.body };

    console.log("Received body:", req.body);

    if (req.body.nationalIdImage) {
      updatedData.nationalIdImage = req.body.nationalIdImage;
      updatedData.nationalIdStatus = "pending";
    }
    if (req.body.licenseImage) {
      updatedData.licenseImage = req.body.licenseImage;
      updatedData.licenseStatus = "pending";
    }
    if (req.body.profileImg) {
      updatedData.profileImg = req.body.profileImg;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    res.status(200).json({
      status: 200,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting admin users
    if (user.type === "admin") {
      return res.status(403).json({ message: "Admin users cannot be deleted" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
// async function generatePassword() {
//   const hashedPassword = await bcrypt.hash("Admin@12345", 10);
//   console.log(hashedPassword,"hello");
// }

// generatePassword();
