const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Google OAuth Initiation Route
router.get('/google', (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=profile email&access_type=offline`;
  res.redirect(googleAuthUrl);
});

// Google OAuth Callback Route
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;

    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI
      }
    });

    const { access_token } = tokenResponse.data;

    // Fetch user info
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { sub: googleId, email, name, picture } = userInfoResponse.data;

    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { googleId }, 
        { email }
      ]
    });

    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        picture,
        isVerified: true,
        status: 'active'
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Redirect with token
    const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${token}`;
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Google OAuth Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: 'Authentication failed', 
      details: error.response ? error.response.data : error.message 
    });
  }
});

module.exports = router;
