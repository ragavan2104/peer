import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useProjects = (filters = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        ...filters
      });

      const response = await api.get(`/projects?${params}`);
      const { projects: projectsData, pagination: paginationData } = response.data;

      if (page === 1) {
        setProjects(projectsData);
      } else {
        setProjects(prev => [...prev, ...projectsData]);
      }
      
      setPagination(paginationData);
    } catch (error) {
      console.error('Fetch projects error:', error);
      setError(error.message);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [JSON.stringify(filters)]);

  const loadMore = () => {
    if (pagination.hasNextPage && !loading) {
      fetchProjects(pagination.currentPage + 1);
    }
  };

  const refreshProjects = () => {
    fetchProjects(1);
  };

  return {
    projects,
    loading,
    error,
    pagination,
    loadMore,
    refreshProjects,
    fetchProjects
  };
};

export const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/projects/${projectId}`);
        setProject(response.data);
      } catch (error) {
        console.error('Fetch project error:', error);
        setError(error.message);
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const likeProject = async () => {
    try {
      const response = await api.post(`/projects/${projectId}/like`);
      const { isLiked, totalLikes } = response.data;
      
      setProject(prev => ({
        ...prev,
        isLiked,
        totalLikes
      }));
      
      toast.success(isLiked ? 'Project liked!' : 'Project unliked');
    } catch (error) {
      console.error('Like project error:', error);
      toast.error('Failed to like project');
    }
  };

  const rateProject = async (rating) => {
    try {
      const response = await api.post(`/projects/${projectId}/rate`, { rating });
      const { userRating, averageRating, totalRatings } = response.data;
      
      setProject(prev => ({
        ...prev,
        userRating,
        averageRating,
        totalRatings
      }));
      
      toast.success('Rating submitted!');
    } catch (error) {
      console.error('Rate project error:', error);
      toast.error('Failed to rate project');
    }
  };

  const addComment = async (content, parentComment = null) => {
    try {
      const response = await api.post(`/projects/${projectId}/comments`, {
        content,
        parentComment
      });
      
      const newComment = response.data;
      
      setProject(prev => ({
        ...prev,
        comments: [newComment, ...prev.comments]
      }));
      
      toast.success('Comment added!');
      return newComment;
    } catch (error) {
      console.error('Add comment error:', error);
      toast.error('Failed to add comment');
      throw error;
    }
  };

  return {
    project,
    loading,
    error,
    likeProject,
    rateProject,
    addComment
  };
};
