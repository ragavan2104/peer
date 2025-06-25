import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateUser } from '../middleware/validation.js';

const router = express.Router();

// Register or login user (Firebase handles authentication)
router.post('/verify', async (req, res) => {
  try {
    const { firebaseUid, email, displayName, photoURL } = req.body;

    if (!firebaseUid || !email || !displayName) {
      return res.status(400).json({ 
        message: 'Firebase UID, email, and display name are required' 
      });
    }

    // Check if user exists
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Create new user
      user = new User({
        firebaseUid,
        email,
        displayName,
        photoURL: photoURL || ''
      });
      await user.save();
    } else {
      // Update last active time and any changed info
      user.lastActive = new Date();
      if (user.email !== email) user.email = email;
      if (user.displayName !== displayName) user.displayName = displayName;
      if (photoURL && user.photoURL !== photoURL) user.photoURL = photoURL;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { uid: firebaseUid, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        bio: user.bio,
        githubUsername: user.githubUsername,
        website: user.website,
        skills: user.skills,
        joinedAt: user.joinedAt
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'title author githubUrl imageUrl createdAt')
      .populate({
        path: 'favorites',
        populate: {
          path: 'author',
          select: 'displayName photoURL'
        }
      });

    res.json({
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      bio: user.bio,
      githubUsername: user.githubUsername,
      website: user.website,
      skills: user.skills,
      favorites: user.favorites,
      joinedAt: user.joinedAt
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, validateUser, async (req, res) => {
  try {
    const { displayName, bio, githubUsername, website, skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        displayName,
        bio,
        githubUsername,
        website,
        skills: skills || []
      },
      { new: true }
    );

    res.json({
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      bio: user.bio,
      githubUsername: user.githubUsername,
      website: user.website,
      skills: user.skills,
      joinedAt: user.joinedAt
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
