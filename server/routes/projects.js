import express from 'express';
import Project from '../models/Project.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateProject, validateComment } from '../middleware/validation.js';

const router = express.Router();

// Get all projects with pagination, filtering, and search
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const {
      search,
      tags,
      author,
      sortBy = 'createdAt',
      order = 'desc',
      featured
    } = req.query;

    // Build query
    let query = { status: 'active' };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }
    
    if (author) {
      query.author = author;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    // Build sort object
    const sortOptions = {};
    if (search) {
      sortOptions.score = { $meta: 'textScore' };
    }
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const projects = await Project.find(query)
      .populate('author', 'displayName photoURL githubUsername')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    // Add computed fields
    const projectsWithStats = projects.map(project => ({
      ...project,
      totalLikes: project.likes.length,
      averageRating: project.ratings.length > 0 
        ? Math.round((project.ratings.reduce((acc, r) => acc + r.rating, 0) / project.ratings.length) * 10) / 10
        : 0,
      isLiked: req.user ? project.likes.some(like => like.user.toString() === req.user._id.toString()) : false,
      userRating: req.user 
        ? project.ratings.find(rating => rating.user.toString() === req.user._id.toString())?.rating || 0
        : 0
    }));

    const total = await Project.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      projects: projectsWithStats,
      pagination: {
        currentPage: page,
        totalPages,
        totalProjects: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('author', 'displayName photoURL githubUsername bio website')
      .lean();

    if (!project || project.status !== 'active') {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Increment view count
    await Project.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Get comments for this project
    const comments = await Comment.find({ project: req.params.id })
      .populate('author', 'displayName photoURL')
      .sort({ createdAt: -1 })
      .lean();

    const projectWithStats = {
      ...project,
      totalLikes: project.likes.length,
      averageRating: project.ratings.length > 0 
        ? Math.round((project.ratings.reduce((acc, r) => acc + r.rating, 0) / project.ratings.length) * 10) / 10
        : 0,
      isLiked: req.user ? project.likes.some(like => like.user.toString() === req.user._id.toString()) : false,
      userRating: req.user 
        ? project.ratings.find(rating => rating.user.toString() === req.user._id.toString())?.rating || 0
        : 0,
      comments
    };

    res.json(projectWithStats);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new project
router.post('/', authenticateToken, validateProject, async (req, res) => {
  try {
    const { title, description, tags, githubUrl, liveUrl, imageUrl } = req.body;

    const project = new Project({
      title,
      description,
      author: req.user._id,
      tags: tags.map(tag => tag.toLowerCase()),
      githubUrl,
      liveUrl,
      imageUrl
    });

    await project.save();
    await project.populate('author', 'displayName photoURL githubUsername');

    res.status(201).json({
      ...project.toObject(),
      totalLikes: 0,
      averageRating: 0,
      isLiked: false,
      userRating: 0
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', authenticateToken, validateProject, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const { title, description, tags, githubUrl, liveUrl, imageUrl } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        tags: tags.map(tag => tag.toLowerCase()),
        githubUrl,
        liveUrl,
        imageUrl
      },
      { new: true }
    ).populate('author', 'displayName photoURL githubUsername');

    res.json({
      ...updatedProject.toObject(),
      totalLikes: updatedProject.likes.length,
      averageRating: updatedProject.averageRating,
      isLiked: updatedProject.likes.some(like => like.user.toString() === req.user._id.toString()),
      userRating: updatedProject.ratings.find(rating => rating.user.toString() === req.user._id.toString())?.rating || 0
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ project: req.params.id });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike project
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const existingLike = project.likes.find(
      like => like.user.toString() === req.user._id.toString()
    );

    if (existingLike) {
      // Unlike
      project.likes = project.likes.filter(
        like => like.user.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      project.likes.push({ user: req.user._id });
    }

    await project.save();

    res.json({
      isLiked: !existingLike,
      totalLikes: project.likes.length
    });
  } catch (error) {
    console.error('Like project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate project
router.post('/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const existingRating = project.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.ratedAt = new Date();
    } else {
      project.ratings.push({ user: req.user._id, rating });
    }

    await project.save();

    const averageRating = Math.round((project.ratings.reduce((acc, r) => acc + r.rating, 0) / project.ratings.length) * 10) / 10;

    res.json({
      userRating: rating,
      averageRating,
      totalRatings: project.ratings.length
    });
  } catch (error) {
    console.error('Rate project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to project
router.post('/:id/comments', authenticateToken, validateComment, async (req, res) => {
  try {
    const { content, parentComment } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const comment = new Comment({
      project: req.params.id,
      author: req.user._id,
      content,
      parentComment: parentComment || null
    });

    await comment.save();
    await comment.populate('author', 'displayName photoURL');

    res.status(201).json(comment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular tags
router.get('/tags/popular', async (req, res) => {
  try {
    const tags = await Project.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json(tags.map(tag => ({ name: tag._id, count: tag.count })));
  } catch (error) {
    console.error('Get popular tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
