const mongoose = require('mongoose')
const User = require('../models/users.model')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatusText = require('../utils/httpStatusText')

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, {"__v": false})
        return res.json({status: httpStatusText.SUCCESS, data : {users}})
    } catch (err) {
        return res.status(500).json({status: httpStatusText.ERROR ,data: null ,msg : "ERROR"})
    }
};

const register = async (req, res) => {
    const {firstname, lastname, username, phoneNumber, email, address, password} = req.body;

    try {
        let user = await User.findOne({ email })
        if (user) return res.status(409).json({
          status: httpStatusText.ERROR,
          message: "User already exists"
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        user = new User({ firstname, lastname, username, phoneNumber, email, address, password: hashedPass });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });
      
          res.status(201).json({
            message: "User registered successfully",
            user: { 
                id: user._id, 
                firstname: user.firstname, 
                lastname: user.lastname, 
                email: user.email 
            },            
            token
          });
    } catch(error) {
        res.status(500).json({status: httpStatusText.ERROR, data: null, error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ 
        status: httpStatusText.FAIL, 
        message: "Invalid credentials" 
    });
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ 
        status: httpStatusText.FAIL, 
        message: "Invalid credentials" 
      });

      // Generate JWT Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      // Return user details & token
      res.json({
        status: httpStatusText.SUCCESS,
        message: "Login successful",
        user: { 
            id: user._id, 
            firstname: user.firstname, 
            lastname: user.lastname, 
            email: user.email 
        },
        token,
      });
  
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
}

module.exports = { getAllUsers, register, login}