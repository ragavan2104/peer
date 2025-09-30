import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  StarIcon, 
  EyeIcon,
  CalendarIcon,
  CodeBracketIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { formatTimeAgo, truncateText } from '../utils/helpers';
import clsx from 'clsx';

const ProjectCard = ({ project, onLike, showAuthor = true, className = '' }) => {
  const {
    _id,
    title,
    description,
    author,
    tags,
    githubUrl,
    liveUrl,
    imageUrl,
    totalLikes,
    averageRating,
    views,
    isLiked,
    createdAt
  } = project;

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike) {
      onLike(_id);
    }
  };
  return (
    <div className={clsx('card p-6 hover:shadow-lg transition-shadow duration-200', className)}>
      {/* Project Image */}
      {imageUrl && (
        <Link to={`/project/${_id}`} className="block mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </Link>
      )}

      {/* Project Header */}
      <Link to={`/project/${_id}`} className="block mb-3">
        <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-secondary text-sm line-clamp-3">
          {truncateText(description, 120)}
        </p>
      </Link>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-secondary">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Author Info */}
      {showAuthor && author && (
        <div className="flex items-center mb-4">
          {author.photoURL ? (
            <img
              src={author.photoURL}
              alt={author.displayName}
              className="h-8 w-8 rounded-full mr-3"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center text-white text-sm font-medium mr-3">
              {author.displayName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-primary">
              {author.displayName}
            </p>
            <p className="text-xs text-secondary flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {formatTimeAgo(createdAt)}
            </p>
          </div>
        </div>
      )}

      {/* Project Links */}
      <div className="flex items-center space-x-4 mb-4">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:text-primary flex items-center transition-colors duration-200"
          >
            <CodeBracketIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">Code</span>
          </a>
        )}
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:text-primary flex items-center transition-colors duration-200"
          >
            <GlobeAltIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">Live Demo</span>
          </a>
        )}
      </div>

      {/* Project Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 text-secondary hover:text-red-500 transition-colors duration-200"
          >
            {isLiked ? (
              <HeartSolidIcon className="h-4 w-4 text-red-500" />
            ) : (
              <HeartIcon className="h-4 w-4" />
            )}
            <span className="text-sm">{totalLikes || 0}</span>
          </button>

          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center space-x-1 text-secondary">
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">{averageRating}</span>
            </div>
          )}

          {/* Views */}
          <div className="flex items-center space-x-1 text-secondary">
            <EyeIcon className="h-4 w-4" />
            <span className="text-sm">{views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
