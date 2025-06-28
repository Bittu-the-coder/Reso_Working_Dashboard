const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['invitation', 'task', 'other'],
    required: true
  },
  message: String,
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MyTeamSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  }
})

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    maxlength: [50, 'Username cannot be more than 50 characters'],
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  fullName: {
    type: String,
    required: [true, 'Please add your full name'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  avatar: {
    type: String,
    default: 'default-avatar.png',
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  },
  teams: [MyTeamSchema],
  notifications: [NotificationSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre('findOneAndDelete', async function (next) {
  const userId = this.getQuery()._id;
  const Team = require('./Team');
  const Task = require('./Task');
  const Document = require('./Document');

  // Remove user from teams
  await Team.updateMany(
    {},
    {
      $pull: {
        members: { userId },
        invitations: { userId }
      }
    }
  );

  // Remove from tasks
  await Task.updateMany(
    {},
    {
      $pull: {
        assignedTo: userId,
        chat: { sender: userId },
        steps: { reportedBy: userId }
      }
    }
  );

  // Remove documents uploaded by user
  await Document.deleteMany({ uploadedBy: userId });

  next();
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
