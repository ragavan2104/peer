import express from 'express';
import User from '../models/User.js';
import Project from '../models/Project.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get user profile by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-firebaseUid -email -favorites')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's projects
    const projects = await Project.find({ 
      author: req.params.id, 
      status: 'active' 
    })
      .populate('author', 'displayName photoURL')
      .sort({ createdAt: -1 })
      .lean();

    // Add computed fields to projects
    const projectsWithStats = projects.map(project => ({
      ...project,
      totalLikes: project.likes.length,
      averageRating: project.ratings.length > 0 
        ? Math.round((project.ratings.reduce((acc, r) => acc + r.rating, 0) / project.ratings.length) * 10) / 10
        : 0,
      isLiked: req.user ? project.likes.some(like => like.user.toString() === req.user._id.toString()) : false
    }));

    // Get user stats
    const totalLikes = projects.reduce((acc, project) => acc + project.likes.length, 0);
    const totalViews = projects.reduce((acc, project) => acc + project.views, 0);

    res.json({
      user: {
        ...user,
        stats: {
          totalProjects: projects.length,
          totalLikes,
          totalViews,
          memberSince: user.joinedAt
        }
      },
      projects: projectsWithStats
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle favorite project
router.post('/favorites/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const user = await User.findById(req.user._id);
    const isFavorited = user.favorites.includes(projectId);

    if (isFavorited) {
      // Remove from favorites
      user.favorites = user.favorites.filter(
        fav => fav.toString() !== projectId
      );
    } else {
      // Add to favorites
      user.favorites.push(projectId);
    }

    await user.save();

    res.json({
      isFavorited: !isFavorited,
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites'
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's favorite projects
router.get('/favorites/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        match: { status: 'active' },
        populate: {
          path: 'author',
          select: 'displayName photoURL'
        }
      });

    const favoritesWithStats = user.favorites.map(project => ({
      ...project.toObject(),
      totalLikes: project.likes.length,
      averageRating: project.ratings.length > 0 
        ? Math.round((project.ratings.reduce((acc, r) => acc + r.rating, 0) / project.ratings.length) * 10) / 10
        : 0,
      isLiked: project.likes.some(like => like.user.toString() === req.user._id.toString())
    }));

    res.json(favoritesWithStats);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({
      $or: [
        { displayName: { $regex: query, $options: 'i' } },
        { githubUsername: { $regex: query, $options: 'i' } },
        { skills: { $in: [new RegExp(query, 'i')] } }
      ]
    })
      .select('displayName photoURL bio githubUsername skills joinedAt')
      .sort({ lastActive: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get project count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const projectCount = await Project.countDocuments({ 
          author: user._id, 
          status: 'active' 
        });
        return { ...user, projectCount };
      })
    );

    const total = await User.countDocuments({
      $or: [
        { displayName: { $regex: query, $options: 'i' } },
        { githubUsername: { $regex: query, $options: 'i' } },
        { skills: { $in: [new RegExp(query, 'i')] } }
      ]
    });

    res.json({
      users: usersWithStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
