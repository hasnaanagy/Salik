const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true }, // Make phone unique
    password: { type: String, required: true },
    nationalId: { type: String, required: true, unique: true }, // Make nationalId unique
    type: { 
        type: String, 
        enum: ["customer", "provider"], 
        default: "customer", // Default type set to "customer"
    },
    profileImg: { type: String, default: "" },
    licenseImage: { type: String, default: "" },
    nationalIdImage: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
