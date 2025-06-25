import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  LinkIcon, 
  CalendarIcon,
  CodeBracketIcon,
  HeartIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/helpers';
import api from '../utils/api';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/users/${id}`);
      setUserProfile(response.data.user);
      setUserProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('User not found');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectLike = async (projectId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like projects');
      return;
    }

    try {
      await api.post(`/projects/${projectId}/like`);
      
      // Update the project in the list
      setUserProjects(userProjects.map(project =>
        project._id === projectId
          ? { 
              ...project, 
              isLiked: !project.isLiked, 
              totalLikes: project.totalLikes + (project.isLiked ? -1 : 1) 
            }
          : project
      ));
    } catch (error) {
      console.error('Error liking project:', error);
      toast.error('Failed to like project');
    }
  };

  const handleToggleFavorite = async (projectId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      const response = await api.post(`/users/favorites/${projectId}`);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-8">The user profile you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.id === userProfile._id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0 mb-4 sm:mb-0">
            {userProfile.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt={userProfile.displayName}
                className="h-24 w-24 rounded-full"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.displayName?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
                {userProfile.displayName}
              </h1>
              
              {isOwnProfile && (
                <Link
                  to="/profile/edit"
                  className="btn-secondary text-sm"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Bio */}
            {userProfile.bio && (
              <p className="text-gray-700 mb-4">{userProfile.bio}</p>
            )}

            {/* Profile Details */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>Joined {formatDate(userProfile.joinedAt)}</span>
              </div>
              
              {userProfile.website && (
                <a
                  href={userProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary-600"
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  <span>Website</span>
                </a>
              )}
              
              {userProfile.githubUsername && (
                <a
                  href={`https://github.com/${userProfile.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary-600"
                >
                  <CodeBracketIcon className="h-4 w-4 mr-1" />
                  <span>@{userProfile.githubUsername}</span>
                </a>
              )}
            </div>

            {/* Skills */}
            {userProfile.skills && userProfile.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{userProfile.stats?.totalProjects || 0}</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{userProfile.stats?.totalViews || 0}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{userProfile.stats?.totalLikes || 0}</div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatDate(userProfile.stats?.memberSince || userProfile.joinedAt)}</div>
            <div className="text-sm text-gray-600">Member Since</div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {isOwnProfile ? 'Your Projects' : `${userProfile.displayName}'s Projects`}
          <span className="ml-2 text-sm font-normal text-gray-600">
            ({userProjects.length})
          </span>
        </h2>

        {userProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProjects.map((project) => (
              <div key={project._id} className="relative">
                <ProjectCard
                  project={project}
                  onLike={handleProjectLike}
                  showAuthor={false}
                />
                
                {/* Favorite Button for other users' projects */}
                {!isOwnProfile && isAuthenticated && (
                  <button
                    onClick={() => handleToggleFavorite(project._id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    title="Add to favorites"
                  >
                    <HeartIcon className="h-4 w-4 text-gray-600 hover:text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <CodeBracketIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isOwnProfile ? 'No projects yet' : 'No projects found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isOwnProfile 
                ? "You haven't created any projects yet. Start sharing your work!"
                : `${userProfile.displayName} hasn't shared any projects yet.`
              }
            </p>
            {isOwnProfile && (
              <Link to="/create-project" className="btn-primary">
                Create Your First Project
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
