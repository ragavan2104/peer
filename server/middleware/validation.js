import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

export const validateProject = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('githubUrl')
    .isURL()
    .matches(/^https?:\/\/(www\.)?github\.com\/.+/)
    .withMessage('Please provide a valid GitHub repository URL'),
  
  body('liveUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid live demo URL'),
  
  body('tags')
    .isArray({ min: 1, max: 10 })
    .withMessage('Please provide 1-10 tags'),
  
  body('tags.*')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),
  
  handleValidationErrors
];

export const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  
  handleValidationErrors
];

export const validateUser = [
  body('displayName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  
  body('githubUsername')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/)
    .withMessage('Please provide a valid GitHub username'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  
  body('skills')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Maximum 20 skills allowed'),
  
  handleValidationErrors
];
