import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/favorites/me');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load your favorite projects');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (projectId) => {
    try {
      await api.post(`/users/favorites/${projectId}`);
      
      // Remove from favorites list
      setFavorites(favorites.filter(project => project._id !== projectId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const handleProjectLike = async (projectId) => {
    try {
      await api.post(`/projects/${projectId}/like`);
      
      // Update the project in favorites list
      setFavorites(favorites.map(project =>
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <HeartSolidIcon className="h-8 w-8 text-red-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        </div>
        <p className="text-gray-600">
          Projects you've bookmarked for later reference
        </p>
      </div>

      {/* Favorites Count */}
      {favorites.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {favorites.length} favorite project{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((project) => (
            <div key={project._id} className="relative">
              <ProjectCard
                project={project}
                onLike={handleProjectLike}
              />
              
              {/* Remove from Favorites Button */}
              <button
                onClick={() => handleToggleFavorite(project._id)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                title="Remove from favorites"
              >
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <HeartSolidIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-6">
            Start exploring projects and add your favorites by clicking the heart icon.
          </p>
          <Link to="/explore" className="btn-primary">
            Explore Projects
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
