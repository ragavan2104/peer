import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  HeartIcon, 
  StarIcon, 
  EyeIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  TrashIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useProject } from '../hooks/useProjects';
import { useAuth } from '../contexts/AuthContext';
import { formatTimeAgo, formatDate } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { project, loading, error, likeProject, rateProject, addComment } = useProject(id);
  const navigate = useNavigate();
  
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please login to like projects');
      return;
    }
    likeProject();
  };

  const handleRating = async (rating) => {
    if (!isAuthenticated) {
      toast.error('Please login to rate projects');
      return;
    }
    setUserRating(rating);
    await rateProject(rating);
    setShowRating(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }
    
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      await addComment(newComment);
      setNewComment('');
    } catch (error) {
      // Error handled in hook
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      navigate('/my-projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const isOwner = user && project && project.author._id === user.id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
        <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Project Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
            
            {/* Author Info */}
            <div className="flex items-center mb-4">
              <Link to={`/users/${project.author._id}`} className="flex items-center hover:opacity-80">
                {project.author.photoURL ? (
                  <img
                    src={project.author.photoURL}
                    alt={project.author.displayName}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium mr-3">
                    {project.author.displayName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{project.author.displayName}</p>
                  <p className="text-sm text-gray-500">Published {formatTimeAgo(project.createdAt)}</p>
                </div>
              </Link>
            </div>

            {/* Project Stats */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <EyeIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">{project.views} views</span>
              </div>
              
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                {project.isLiked ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span className="text-sm">{project.totalLikes} likes</span>
              </button>

              <div className="flex items-center space-x-2">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {project.averageRating > 0 ? `${project.averageRating} (${project.ratings?.length || 0} ratings)` : 'No ratings yet'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">{project.comments?.length || 0} comments</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center justify-center"
              >
                <CodeBracketIcon className="h-4 w-4 mr-2" />
                View Code
              </a>
            )}
            
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center"
              >
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                Live Demo
              </a>
            )}

            {isOwner && (
              <div className="flex gap-2">
                <Link
                  to={`/project/${id}/edit`}
                  className="btn-secondary flex items-center justify-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </Link>
                <button
                  onClick={handleDeleteProject}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Project Image */}
          {project.imageUrl && (
            <div className="mb-8">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full rounded-lg shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Project Description */}
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Project</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
            </div>
          </div>

          {/* Rating Section */}
          {isAuthenticated && !isOwner && (
            <div className="card p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate This Project</h3>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRating(rating)}
                    className="focus:outline-none"
                  >
                    {rating <= (project.userRating || userRating) ? (
                      <StarSolidIcon className="h-6 w-6 text-yellow-400" />
                    ) : (
                      <StarIcon className="h-6 w-6 text-gray-300 hover:text-yellow-400 transition-colors" />
                    )}
                  </button>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {project.userRating ? 'Your rating' : 'Click to rate'}
                </span>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Comments</h3>
            
            {/* Add Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleAddComment} className="mb-8">
                <div className="flex items-start space-x-3">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                      {user?.displayName?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="input-field resize-none"
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {newComment.length}/1000 characters
                      </span>
                      <button
                        type="submit"
                        disabled={!newComment.trim() || commentLoading}
                        className="btn-primary text-sm"
                      >
                        {commentLoading ? 'Adding...' : 'Add Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg mb-8">
                <p className="text-gray-600 mb-4">Please login to add comments</p>
                <Link to="/login" className="btn-primary">
                  Sign In
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {project.comments && project.comments.length > 0 ? (
                project.comments.map((comment) => (
                  <div key={comment._id} className="flex items-start space-x-3">
                    {comment.author.photoURL ? (
                      <img
                        src={comment.author.photoURL}
                        alt={comment.author.displayName}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                        {comment.author.displayName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {comment.author.displayName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Tags */}
          <div className="card p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag, index) => (
                <Link
                  key={index}
                  to={`/explore?tags=${tag}`}
                  className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full hover:bg-primary-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Project Info */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Info</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">{formatDate(project.createdAt)}</dd>
              </div>
              {project.updatedAt !== project.createdAt && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">{formatDate(project.updatedAt)}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Views</dt>
                <dd className="text-sm text-gray-900">{project.views}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Likes</dt>
                <dd className="text-sm text-gray-900">{project.totalLikes}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
