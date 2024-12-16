const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const transporter = require('../config/email');

// Get all users (admin only)
router.get('/users', authenticateToken, adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -__v')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user status
router.put('/users/:id/status', authenticateToken, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow modifying admin status
    if (user.role === 'admin' && req.user.id !== user._id) {
      return res.status(403).json({ message: 'Cannot modify admin status' });
    }

    // Store previous status
    const previousStatus = user.status;
    user.status = status;
    await user.save();

    // Send email notification if account is activated
    if (status === 'active' && previousStatus !== 'active') {
      try {
        await transporter.sendMail({
          from: `"EventHub" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Your EventHub Account is Now Active',
          html: `
            <h1>Congratulations! </h1>
            <p>Your EventHub account has been activated by an administrator.</p>
            <p>You can now log in and start using all features of the platform.</p>
            <br>
            <p>Best regards,<br>EventHub Team</p>
          `
        });
      } catch (emailError) {
        console.error('Error sending activation email:', emailError);
      }
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Update user role
router.put('/users/:id/role', authenticateToken, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow modifying admin role
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot modify admin role' });
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;