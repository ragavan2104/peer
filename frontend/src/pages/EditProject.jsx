import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PlusIcon, XMarkIcon, PhotoIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../hooks/useProjects';
import api from '../utils/api';
import toast from 'react-hot-toast';

const EditProject = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { project, loading: projectLoading } = useProject(id);
  const navigate = useNavigate();
  
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const dropdownRef = useRef(null);

  // Predefined technology options (same as CreateProject)
  const technologyOptions = [
    // Frontend Frameworks & Libraries
    'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby',
    // Backend Frameworks
    'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Ruby on Rails',
    'Laravel', 'ASP.NET', 'Phoenix', 'Gin', 'Fiber',
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP',
    'Ruby', 'Swift', 'Kotlin', 'Dart', 'C++', 'C', 'Scala', 'Clojure',
    // Databases
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Firebase', 'Supabase',
    'DynamoDB', 'Cassandra', 'Neo4j', 'InfluxDB',
    // Cloud & DevOps
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform',
    'Jenkins', 'GitHub Actions', 'GitLab CI', 'Heroku', 'Vercel', 'Netlify',
    // Mobile Development
    'React Native', 'Flutter', 'Ionic', 'Xamarin', 'SwiftUI', 'Android Studio',
    // CSS Frameworks & Tools
    'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Chakra UI', 'Ant Design',
    'Styled Components', 'Sass', 'Less',
    // Testing
    'Jest', 'Cypress', 'Selenium', 'Playwright', 'Vitest', 'Testing Library',
    // Build Tools & Bundlers
    'Webpack', 'Vite', 'Parcel', 'Rollup', 'ESBuild',
    // State Management
    'Redux', 'Zustand', 'MobX', 'Recoil', 'Vuex', 'Pinia',
    // Others
    'GraphQL', 'REST API', 'WebSocket', 'gRPC', 'Microservices', 'Blockchain',
    'Machine Learning', 'AI', 'Data Science', 'Game Development', 'IoT'
  ].sort();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch
  } = useForm();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize form with project data
  useEffect(() => {
    if (project && !initialLoadComplete) {
      setValue('title', project.title);
      setValue('description', project.description);
      setValue('githubUrl', project.githubUrl);
      setValue('liveUrl', project.liveUrl || '');
      setValue('imageUrl', project.imageUrl || '');
      setTags(project.tags || []);
      setInitialLoadComplete(true);
    }
  }, [project, setValue, initialLoadComplete]);

  // Check if user is the owner
  const isOwner = user && project && project.author._id === user.id;

  const watchGithubUrl = watch('githubUrl');

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
      setShowDropdown(false);
    }
  };

  const addTagFromDropdown = (technology) => {
    const lowerTech = technology.toLowerCase();
    if (!tags.includes(lowerTech) && tags.length < 10) {
      setTags([...tags, lowerTech]);
      setShowDropdown(false);
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = async (data) => {
    if (tags.length === 0) {
      setError('tags', { type: 'manual', message: 'Please add at least one tag' });
      return;
    }

    try {
      setLoading(true);
      
      const projectData = {
        title: data.title,
        description: data.description,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl || '',
        imageUrl: data.imageUrl || '',
        tags
      };

      await api.put(`/projects/${id}`, projectData);
      toast.success('Project updated successfully!');
      navigate(`/project/${id}`);
    } catch (error) {
      console.error('Update project error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update project';
      toast.error(errorMessage);
      
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          setError(err.path, { type: 'manual', message: err.msg });
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (projectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Not found or not owner
  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
        <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">You don't have permission to edit this project.</p>
        <button onClick={() => navigate(`/project/${id}`)} className="btn-primary">
          View Project
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
        <p className="mt-2 text-gray-600">
          Update your project details and information.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="card p-6">
          {/* Project Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              {...register('title', {
                required: 'Project title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' },
                maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
              })}
              type="text"
              className="input-field"
              placeholder="Enter your project title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Project Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', {
                required: 'Project description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' },
                maxLength: { value: 2000, message: 'Description cannot exceed 2000 characters' }
              })}
              rows={6}
              className="input-field resize-none"
              placeholder="Describe your project, what it does, technologies used, challenges faced, etc."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* GitHub URL */}
          <div className="mb-6">
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Repository URL *
            </label>
            <input
              {...register('githubUrl', {
                required: 'GitHub URL is required',
                pattern: {
                  value: /^https?:\/\/(www\.)?github\.com\/.+/,
                  message: 'Please provide a valid GitHub repository URL'
                }
              })}
              type="url"
              className="input-field"
              placeholder="https://github.com/username/repository-name"
            />
            {errors.githubUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.githubUrl.message}</p>
            )}
          </div>

          {/* Live Demo URL */}
          <div className="mb-6">
            <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Live Demo URL (Optional)
            </label>
            <input
              {...register('liveUrl', {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Please provide a valid URL'
                }
              })}
              type="url"
              className="input-field"
              placeholder="https://your-project-demo.com (optional)"
            />
            {errors.liveUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.liveUrl.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Share a link where others can see your project in action.
            </p>
          </div>

          {/* Project Image */}
          <div className="mb-6">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Project Screenshot/Image URL
            </label>
            <div className="flex items-center space-x-3">
              <PhotoIcon className="h-6 w-6 text-gray-400" />
              <input
                {...register('imageUrl', {
                  pattern: {
                    value: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i,
                    message: 'Please provide a valid image URL'
                  }
                })}
                type="url"
                className="input-field"
                placeholder="https://example.com/screenshot.png"
              />
            </div>
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Upload your image to a service like GitHub, Imgur, or Cloudinary and paste the URL here.
            </p>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technologies & Tags *
            </label>
            
            {/* Selected Tags Display */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Technology Dropdown */}
            <div className="mb-3">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full text-left input-field flex items-center justify-between bg-white"
                  disabled={tags.length >= 10}
                >
                  <span className="text-gray-500">
                    {tags.length >= 10 ? 'Maximum tags reached' : 'Select from popular technologies'}
                  </span>
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showDropdown && tags.length < 10 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="py-1">
                      {technologyOptions
                        .filter(tech => !tags.includes(tech.toLowerCase()))
                        .map((technology) => (
                          <button
                            key={technology}
                            type="button"
                            onClick={() => addTagFromDropdown(technology)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                          >
                            {technology}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  setShowDropdown(false);
                }}
                onKeyDown={handleTagKeyPress}
                className="input-field flex-1"
                placeholder="Or add custom technology/tag"
                maxLength={30}
                disabled={tags.length >= 10}
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim() || tags.length >= 10}
                className="ml-2 btn-secondary flex items-center"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Select from popular technologies or add custom tags. Press Enter, comma, or space to add custom tags. Maximum 10 tags.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/project/${id}`)}
            className="btn-secondary px-6 py-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-3 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              'Update Project'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
