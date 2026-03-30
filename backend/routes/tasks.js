const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const mockDb = require('../utils/mockDb');
const mongoose = require('mongoose');
const router = express.Router();

const calculatePriority = (deadline) => {
  const diffTime = new Date(deadline) - new Date();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 2) return 'High';
  if (diffDays <= 5) return 'Medium';
  return 'Low';
};

router.post('/', auth, async (req, res) => {
  try {
    const { title, deadline } = req.body;
    const priority = calculatePriority(deadline);
    
    if (mongoose.connection.readyState === 1) {
      const task = new Task({ title, deadline, priority, user: req.user.id });
      await task.save();
      res.status(201).json(task);
    } else {
      const task = mockDb.tasks.save({ title, deadline, priority, status: 'Pending', user: req.user.id });
      res.status(201).json(task);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    if (mongoose.connection.readyState === 1) {
      tasks = await Task.find({ user: req.user.id }).sort({ deadline: 1 });
    } else {
      tasks = mockDb.tasks.find(req.user.id).sort((a,b) => new Date(a.deadline) - new Date(b.deadline));
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, deadline, status } = req.body;
    const updateData = { title, deadline, status };
    if (deadline) updateData.priority = calculatePriority(deadline);
    
    if (mongoose.connection.readyState === 1) {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        updateData,
        { new: true }
      );
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json(task);
    } else {
      const task = mockDb.tasks.update(req.params.id, req.user.id, updateData);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json(task);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
      if (!task) return res.status(404).json({ error: 'Task not found' });
    } else {
      const deleted = mockDb.tasks.delete(req.params.id, req.user.id);
      if (!deleted) return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
