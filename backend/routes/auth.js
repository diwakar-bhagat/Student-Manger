const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mockDb = require('../utils/mockDb');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/signup', async (req, res) => {
  console.log(`Signup attempt: ${req.body.email}`);
  try {
    const { username, email, password } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const user = new User({ username, email, password });
      await user.save();
    } else {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      await mockDb.users.save({ username, email, password: hashedPassword });
    }
    
    console.log(`Signup success: ${email}`);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(`Signup failed: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  console.log(`Login attempt: ${req.body.email}`);
  try {
    const { email, password } = req.body;
    let user;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      user = mockDb.users.findByEmail(email);
      if (!user) {
        console.warn(`Login failed: User not found - ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      if (!(await mockDb.users.comparePassword(password, user.password))) {
        console.warn(`Login failed: Wrong password - ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log(`Login success: ${email}`);
    res.json({ token, user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error(`Login error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
