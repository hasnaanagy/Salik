const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true },
  type: { type: String, enum: ["customer", "provider", "admin"], default: "customer" },
  profileImg: { type: String, default: "" },
  nationalIdImage: { type: String, default: "" },
  licenseImage: { type: String, default: "" },
  nationalIdStatus: { 
    type: String, 
    enum: ["pending", "verified", "rejected", null], 
    default: null 
  },
  licenseStatus: { 
    type: String, 
    enum: ["pending", "verified", "rejected", null], 
    default: null 
  },
});

module.exports = mongoose.model("User", userSchema);