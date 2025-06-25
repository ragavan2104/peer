import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  AdjustmentsHorizontalIcon 
} from '@heroicons/react/24/outline';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../contexts/AuthContext';
import { debounce } from '../utils/helpers';
import api from '../utils/api';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedTags, setSelectedTags] = useState(
    searchParams.get('tags') ? searchParams.get('tags').split(',') : []
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [order, setOrder] = useState(searchParams.get('order') || 'desc');
  const [showFilters, setShowFilters] = useState(false);
  const [popularTags, setPopularTags] = useState([]);
  
  // Build filters object
  const filters = {
    search: searchTerm,
    tags: selectedTags.join(','),
    sortBy,
    order,
    featured: searchParams.get('featured') || ''
  };

  const { projects, loading, pagination, loadMore, refreshProjects } = useProjects(filters);

  // Debounced search
  const debouncedSearch = debounce((term) => {
    updateUrlParams({ search: term });
  }, 500);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    // Fetch popular tags
    const fetchPopularTags = async () => {
      try {
        const response = await api.get('/projects/tags/popular');
        setPopularTags(response.data);
      } catch (error) {
        console.error('Error fetching popular tags:', error);
      }
    };
    fetchPopularTags();
  }, []);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    setSearchParams(params);
  };

  const handleTagToggle = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    updateUrlParams({ tags: newTags.join(',') });
  };

  const handleSortChange = (newSortBy, newOrder = order) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    updateUrlParams({ sortBy: newSortBy, order: newOrder });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSortBy('createdAt');
    setOrder('desc');
    setSearchParams({});
  };

  const handleProjectLike = async (projectId) => {
    if (!isAuthenticated) return;
    
    try {
      await api.post(`/projects/${projectId}/like`);
      refreshProjects();
    } catch (error) {
      console.error('Error liking project:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Projects</h1>
        <p className="text-gray-600">
          Discover amazing projects from the developer community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        {/* Search Bar */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by title, description, or tags..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Show Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
              {(selectedTags.length > 0 || searchParams.get('featured')) && (
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {selectedTags.length + (searchParams.get('featured') ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [newSortBy, newOrder] = e.target.value.split('-');
                handleSortChange(newSortBy, newOrder);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="views-desc">Most Viewed</option>
              <option value="totalLikes-desc">Most Liked</option>
              <option value="averageRating-desc">Highest Rated</option>
            </select>

            {/* Clear Filters */}
            {(searchTerm || selectedTags.length > 0 || sortBy !== 'createdAt' || order !== 'desc') && (
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            {pagination.totalProjects ? (
              `${pagination.totalProjects} project${pagination.totalProjects !== 1 ? 's' : ''} found`
            ) : (
              'Loading...'
            )}
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="space-y-4">
              {/* Featured Filter */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={searchParams.get('featured') === 'true'}
                    onChange={(e) => {
                      updateUrlParams({ featured: e.target.checked ? 'true' : '' });
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured projects only</span>
                </label>
              </div>

              {/* Tags Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 15).map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => handleTagToggle(tag.name)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag.name)
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {tag.name}
                      <span className="ml-1 text-xs opacity-75">({tag.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => handleTagToggle(tag)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {loading && projects.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : projects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onLike={isAuthenticated ? handleProjectLike : undefined}
              />
            ))}
          </div>

          {/* Load More Button */}
          {pagination.hasNextPage && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn-secondary px-8 py-3"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  'Load More Projects'
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;
