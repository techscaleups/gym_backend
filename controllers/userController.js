const User = require("../models/userModel");

// Send OTP (demo OTP: 123456)
const sendOTP = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ success: false, message: "Mobile number required" });
  }

  const otp = "123456"; // Demo OTP

  try {
    let user = await User.findOne({ mobile });

    if (!user) {
      user = new User({ mobile, otp, isVerified: false });
    } else {
      user.otp = otp;
      user.isVerified = false;
    }

    await user.save();

    return res.json({
      success: true,
      newUser: !user.name,
      message: "OTP sent successfully (demo)",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify OTP and store user details
const verifyOTP = async (req, res) => {
  const { mobile, otp, name, email } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ success: false, message: "Mobile and OTP required" });
  }

  try {
    const user = await User.findOne({ mobile });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.isVerified = true;

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    return res.json({
      success: true,
      message: "OTP verified",
      profile: {
        mobile: user.mobile,
        name: user.name || "",
        email: user.email || "",
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  const { mobile } = req.params;

  try {
    const user = await User.findOne({ mobile });

    if (!user || !user.isVerified) {
      return res.status(404).json({ success: false, message: "User not found or not verified" });
    }

    return res.json({
      success: true,
      profile: {
        mobile: user.mobile,
        name: user.name || "",
        email: user.email || "",
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  getProfile,
};
