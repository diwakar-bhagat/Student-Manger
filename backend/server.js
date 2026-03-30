require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.warn('⚠️ MongoDB connection failed. Falling back to in-memory mock database.');
  })
  .finally(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  });
