const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a step title'],
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reportedAt: Date
});

const ChatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const TaskSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  title: {
    type: String,
    required: [true, 'Please add a task title'],
  },
  description: {
    type: String,
  },
  uploads: [{
    type: String,
  }],
  dueDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String, enum: ['todo', 'in_progress', 'done'],
    default: 'todo'
  },
  steps: [StepSchema],
  messages: [ChatSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task
