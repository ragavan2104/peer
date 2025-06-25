import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import Explore from './pages/Explore';
import MyProjects from './pages/MyProjects';
import Favorites from './pages/Favorites';
import UserProfile from './pages/UserProfile';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Layout Routes */}
      <Route path="/" element={
        <Layout>
          <Home />
        </Layout>
      } />
      
      {/* Explore Route */}
      <Route path="/explore" element={
        <Layout>
          <Explore />
        </Layout>
      } />
      
      {/* Project Detail Route */}
      <Route path="/project/:id" element={
        <Layout>
          <ProjectDetail />
        </Layout>
      } />
      
      {/* User Profile Route */}
      <Route path="/user/:id" element={
        <Layout>
          <UserProfile />
        </Layout>
      } />
      
      {/* Protected Routes */}
      <Route path="/create-project" element={
        <ProtectedRoute>
          <Layout>
            <CreateProject />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/my-projects" element={
        <ProtectedRoute>
          <Layout>
            <MyProjects />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/favorites" element={
        <ProtectedRoute>
          <Layout>
            <Favorites />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
