import User from "../models/users.model.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto'; // for reset token generation
import bcrypt from "bcrypt";

// ---- LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;
    
    


    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
  
    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log("🔍 Incoming password:", password);
    console.log("🔐 Stored hashed password:", user.password);
    console.log("✅ isPasswordValid:", isPasswordValid);

    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });
  


    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
  
    // 🔥 Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
  
    res.status(200).json({ accessToken, refreshToken, user });
  };


// ---- REGISTER
  export const register = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, Email, and Password are required" });
      }
  
      // Prevent users from registering as admin/subadmin themselves
      if (role && (role === 'admin' || role === 'subadmin')) {
        return res.status(403).json({ message: "Cannot self-register as admin or subadmin" });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already registered" });
      }
  
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'travel-agent', // default to travel agent if not provided
      });
  
      res.status(201).json({ message: "Registered successfully", user: { name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  
  
// ---- LOGOUT
export const logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });
  
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(404).json({ message: "User not found" });
  
    // 🔥 Invalidate refresh token
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  
    res.status(200).json({ message: "Logged out successfully" });
  };
  

// ---- REFRESH TOKEN
export const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      {
        _id: decoded._id,
        role: decoded.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    res.json({ accessToken: newAccessToken });
  });
};

// ---- FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // TODO: Send email here with `resetUrl`
  console.log(`Reset password link: ${resetUrl}`);

  res.status(200).json({ message: "Password reset link sent to email" });
};

// ---- RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: "Token invalid or expired" });

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
};
