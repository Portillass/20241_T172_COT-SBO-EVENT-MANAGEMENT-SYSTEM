const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
    index: true
  },
  picture: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'officer', 'student'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'archived'],
    default: function() {
      return this.googleId ? 'active' : 'pending';
    }
  },
  isVerified: {
    type: Boolean,
    default: function() {
      return !!this.googleId;
    }
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Optional: Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Optional: Method to check password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Drop existing indexes and recreate them
mongoose.connection.on('connected', async () => {
  try {
    await mongoose.connection.db.collection('users').dropIndexes();
    console.log('Old indexes dropped');
  } catch (error) {
    console.log('No indexes to drop');
  }
});

module.exports = mongoose.model('User', UserSchema);