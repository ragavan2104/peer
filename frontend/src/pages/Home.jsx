import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const { projects: allProjects, loading: projectsLoading } = useProjects({
    limit: 8,
    sortBy: 'createdAt'
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured projects
        const featuredResponse = await api.get('/projects?featured=true&limit=6');
        setFeaturedProjects(featuredResponse.data.projects);

        // Fetch popular tags
        const tagsResponse = await api.get('/projects/tags/popular');
        setPopularTags(tagsResponse.data.slice(0, 10));
        
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    if (allProjects) {
      setRecentProjects(allProjects.slice(0, 6));
    }
  }, [allProjects]);

  const handleProjectLike = async (projectId) => {
    try {
      await api.post(`/projects/${projectId}/like`);
      // Update the project in both featured and recent lists
      const updateProject = (projects) =>
        projects.map(project =>
          project._id === projectId
            ? { ...project, isLiked: !project.isLiked, totalLikes: project.totalLikes + (project.isLiked ? -1 : 1) }
            : project
        );
      
      setFeaturedProjects(updateProject);
      setRecentProjects(updateProject);
    } catch (error) {
      console.error('Error liking project:', error);
    }
  };

  if (loading && projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Welcome to <span className="text-primary-600 dark:text-primary-400">Peer Project Hub</span>
        </h1>
        <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto">
          Discover amazing coding projects from fellow developers, share your own work, 
          and connect with a community of learners and creators.
        </p>
        
        {!isAuthenticated ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary px-8 py-3 text-lg">
              Get Started
            </Link>
            <Link to="/explore" className="btn-secondary px-8 py-3 text-lg">
              Explore Projects
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-project" className="btn-primary px-8 py-3 text-lg">
              Share Your Project
            </Link>
            <Link to="/explore" className="btn-secondary px-8 py-3 text-lg">
              Discover More
            </Link>
          </div>
        )}
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <SparklesIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
              <h2 className="text-2xl font-bold text-primary">Featured Projects</h2>
            </div>
            <Link 
              to="/explore?featured=true" 
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
            >
              View all →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onLike={isAuthenticated ? handleProjectLike : undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Projects */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
            <h2 className="text-2xl font-bold text-primary">Recent Projects</h2>
          </div>
          <Link 
            to="/explore" 
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
          >
            View all →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onLike={isAuthenticated ? handleProjectLike : undefined}
            />
          ))}
        </div>
      </section>

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <MagnifyingGlassIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
            <h2 className="text-2xl font-bold text-primary">Popular Technologies</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <Link
                key={tag.name}
                to={`/explore?tags=${tag.name}`}
                className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors duration-200"
              >
                <span className="font-medium">{tag.name}</span>
                <span className="ml-2 text-xs bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full">
                  {tag.count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      {!isAuthenticated && (
        <section className="bg-primary-50 dark:bg-gray-800 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Ready to share your projects?
          </h3>
          <p className="text-secondary mb-6">
            Join our community of developers and showcase your coding journey.
          </p>
          <Link to="/signup" className="btn-primary px-8 py-3 text-lg">
            Sign Up Now
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
