const express = require('express');
const bcrypt = require('bcrypt'); // Use the same as in your model
const jwt = require('jsonwebtoken');
const User = require('./user.model'); // Assuming you have user model defined
require('dotenv').config();
const router = express.Router();
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Register a new user
const registerUser = async (req, res) => {
  const { email, username, password, role } = req.body;

  // Check for missing fields
  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Email, username, and password are required' });
  }

  // Validate the role field
  const validRoles = ['user', 'admin'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Role must be "user" or "admin"' });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default role to 'user' if not provided
    const userRole = role || 'user';  // Default to 'user'

    // Create new user
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role: userRole
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

    // Send response with the token
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;  // Get the id parameter from the route

  // Ensure the ID is a valid ObjectId (Mongoose ObjectId validation)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(id);  // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const adminRegister = async (req, res) => {
  const { email, password } = req.body;

  // Load environment variables
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const JWT_SECRET = process.env.JWT_SECRET_KEY;

  // Log received credentials for debugging
  console.log('Received email:', email);
  console.log('Received password:', password);
  console.log('Expected Admin Email:', ADMIN_EMAIL);
  console.log('Expected Admin Password:', ADMIN_PASSWORD);
  console.log('Jwt Secret:', JWT_SECRET);

  // Check if the provided credentials match the fixed admin credentials
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: 'fixed-admin-id',
      email: ADMIN_EMAIL,
      username: ADMIN_USERNAME,
      role: 'admin'
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Return response with token
  return res.status(200).json({
    message: "Admin login successful",
    token,
    user: {
      username: ADMIN_USERNAME,
      role: 'admin'
    }
  });
};

const adminDetails = async (req, res) => {
  try {
    const admin = req.user;  // Assuming the user info is attached to the request after JWT validation

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL
    });
  } catch (error) {
    console.error("Error fetching admin details: ", error);
    res.status(500).json({ message: "Failed to fetch admin details" });
  }
};


const getAllUsers = async (req, res) => {
  const userId = req.user.userId;  // From JWT Token payload

  try {
    // Fetch user details from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user details
    res.json({
      email: user.email,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user details", error: error.message });
  }
};




module.exports = {
  registerUser,
  loginUser,
  getUserById,
  adminRegister,
  adminDetails,
  getAllUsers
};
