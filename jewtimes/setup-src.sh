#!/bin/bash

# React + Vite src/ Directory Setup Script
# Usage: ./setup-src.sh
# Run this script from your project root directory

set -e

echo "🚀 Setting up src/ directory structure..."

# Check if we're in a project with src/ directory
if [ ! -d "src" ]; then
  echo "❌ Error: src/ directory not found. Please run this script from your project root."
  exit 1
fi

echo "📁 Creating directory structure..."

# Create directory structure
mkdir -p src/assets/{images,icons,fonts}
mkdir -p src/components/{common,layout,features}
mkdir -p src/components/common/{Button,Input,Modal,Loading}
mkdir -p src/components/layout/{Header,Footer,Sidebar}
mkdir -p src/components/features/{auth,dashboard}
mkdir -p src/pages/{Home,About,Dashboard,NotFound}
mkdir -p src/hooks
mkdir -p src/context
mkdir -p src/services/{api,storage}
mkdir -p src/utils
mkdir -p src/routes
mkdir -p src/styles
mkdir -p src/config
mkdir -p src/lib

echo "📝 Creating component files..."

# Button Component
cat > src/components/common/Button/Button.jsx << 'EOF'
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
EOF

cat > src/components/common/Button/Button.css << 'EOF'
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
EOF

cat > src/components/common/Button/index.js << 'EOF'
export { default } from './Button';
EOF

# Input Component
cat > src/components/common/Input/Input.jsx << 'EOF'
import './Input.css';

const Input = ({ 
  label,
  type = 'text',
  error,
  ...props 
}) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input 
        type={type}
        className={`input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;
EOF

cat > src/components/common/Input/Input.css << 'EOF'
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.input-label {
  font-weight: 500;
  color: #333;
}

.input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.input:focus {
  outline: none;
  border-color: #007bff;
}

.input-error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
}
EOF

cat > src/components/common/Input/index.js << 'EOF'
export { default } from './Input';
EOF

# Modal Component
cat > src/components/common/Modal/Modal.jsx << 'EOF'
import { useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
EOF

cat > src/components/common/Modal/Modal.css << 'EOF'
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
}

.modal-body {
  padding: 1rem;
}
EOF

cat > src/components/common/Modal/index.js << 'EOF'
export { default } from './Modal';
EOF

# Loading Component
cat > src/components/common/Loading/Loading.jsx << 'EOF'
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
EOF

cat > src/components/common/Loading/Loading.css << 'EOF'
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
EOF

cat > src/components/common/Loading/index.js << 'EOF'
export { default } from './Loading';
EOF

# Header Component
cat > src/components/layout/Header/Header.jsx << 'EOF'
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">MyApp</Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
EOF

cat > src/components/layout/Header/Header.css << 'EOF'
.header {
  background-color: #282c34;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #61dafb;
  text-decoration: none;
}

.header nav {
  display: flex;
  gap: 1.5rem;
}

.header nav a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.header nav a:hover {
  color: #61dafb;
}
EOF

cat > src/components/layout/Header/index.js << 'EOF'
export { default } from './Header';
EOF

# Footer Component
cat > src/components/layout/Footer/Footer.jsx << 'EOF'
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
EOF

cat > src/components/layout/Footer/Footer.css << 'EOF'
.footer {
  background-color: #282c34;
  color: white;
  padding: 2rem 0;
  margin-top: auto;
}

.footer .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}
EOF

cat > src/components/layout/Footer/index.js << 'EOF'
export { default } from './Footer';
EOF

# Home Page
cat > src/pages/Home/Home.jsx << 'EOF'
import Button from '../../components/common/Button';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to React + Vite</h1>
      <p>A modern, fast, and scalable architecture for your React applications.</p>
      <Button onClick={() => alert('Hello!')}>Get Started</Button>
    </div>
  );
};

export default Home;
EOF

cat > src/pages/Home/Home.css << 'EOF'
.home {
  text-align: center;
  padding: 2rem;
}

.home h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #282c34;
}

.home p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #666;
}
EOF

cat > src/pages/Home/index.js << 'EOF'
export { default } from './Home';
EOF

# About Page
cat > src/pages/About/About.jsx << 'EOF'
import './About.css';

const About = () => {
  return (
    <div className="about">
      <h1>About Us</h1>
      <p>This is a scalable React + Vite application architecture.</p>
      <p>Built with modern best practices and clean code structure.</p>
    </div>
  );
};

export default About;
EOF

cat > src/pages/About/About.css << 'EOF'
.about {
  padding: 2rem;
}

.about h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #282c34;
}

.about p {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #666;
  line-height: 1.6;
}
EOF

cat > src/pages/About/index.js << 'EOF'
export { default } from './About';
EOF

# Dashboard Page
cat > src/pages/Dashboard/Dashboard.jsx << 'EOF'
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Users</h3>
          <p className="stat">1,234</p>
        </div>
        <div className="dashboard-card">
          <h3>Revenue</h3>
          <p className="stat">$12,345</p>
        </div>
        <div className="dashboard-card">
          <h3>Active Projects</h3>
          <p className="stat">42</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
EOF

cat > src/pages/Dashboard/Dashboard.css << 'EOF'
.dashboard {
  padding: 2rem;
}

.dashboard h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #282c34;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.dashboard-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dashboard-card h3 {
  margin-bottom: 1rem;
  color: #666;
  font-size: 1rem;
}

.stat {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
}
EOF

cat > src/pages/Dashboard/index.js << 'EOF'
export { default } from './Dashboard';
EOF

# NotFound Page
cat > src/pages/NotFound/NotFound.jsx << 'EOF'
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="home-link">Go Home</Link>
    </div>
  );
};

export default NotFound;
EOF

cat > src/pages/NotFound/NotFound.css << 'EOF'
.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h1 {
  font-size: 6rem;
  margin-bottom: 1rem;
  color: #007bff;
}

.not-found h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #282c34;
}

.not-found p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #666;
}

.home-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #0056b3;
}
EOF

cat > src/pages/NotFound/index.js << 'EOF'
export { default } from './NotFound';
EOF

# Custom Hooks
cat > src/hooks/useLocalStorage.js << 'EOF'
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  return [value, setValue];
};
EOF

cat > src/hooks/useFetch.js << 'EOF'
import { useState, useEffect } from 'react';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
EOF

cat > src/hooks/useToggle.js << 'EOF'
import { useState, useCallback } from 'react';

export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  return [value, toggle, setValue];
};
EOF

cat > src/hooks/index.js << 'EOF'
export { useLocalStorage } from './useLocalStorage';
export { useFetch } from './useFetch';
export { useToggle } from './useToggle';
EOF

# Auth Context
cat > src/context/AuthContext.jsx << 'EOF'
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
EOF

cat > src/context/ThemeContext.jsx << 'EOF'
import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
EOF

cat > src/context/index.js << 'EOF'
export { AuthProvider, useAuth } from './AuthContext';
export { ThemeProvider, useTheme } from './ThemeContext';
EOF

# API Service
cat > src/services/api/axios.config.js << 'EOF'
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
EOF

cat > src/services/api/authService.js << 'EOF'
import api from './axios.config';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
};
EOF

cat > src/services/api/userService.js << 'EOF'
import api from './axios.config';

export const userService = {
  getUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};
EOF

cat > src/services/api/index.js << 'EOF'
export { default as api } from './axios.config';
export { authService } from './authService';
export { userService } from './userService';
EOF

# Storage Service
cat > src/services/storage/localStorage.js << 'EOF'
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
EOF

# Utilities
cat > src/utils/constants.js << 'EOF'
export const APP_NAME = 'MyApp';
export const API_URL = import.meta.env.VITE_API_URL;

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '*',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
EOF

cat > src/utils/formatters.js << 'EOF'
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
EOF

cat > src/utils/validators.js << 'EOF'
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};
EOF

cat > src/utils/helpers.js << 'EOF'
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
EOF

cat > src/utils/index.js << 'EOF'
export * from './constants';
export * from './formatters';
export * from './validators';
export * from './helpers';
EOF

# Routes
cat > src/routes/AppRoutes.jsx << 'EOF'
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loading from '../components/common/Loading';
import PrivateRoute from './PrivateRoute';

// Lazy load pages
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
EOF

cat > src/routes/PrivateRoute.jsx << 'EOF'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // For demo purposes, always allow access
  // In production, check: return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
  return <Outlet />;
};

export default PrivateRoute;
EOF

cat > src/routes/index.js << 'EOF'
export { default as AppRoutes } from './AppRoutes';
export { default as PrivateRoute } from './PrivateRoute';
EOF

# Config
cat > src/config/app.config.js << 'EOF'
export const config = {
  appName: import.meta.env.VITE_APP_NAME || 'MyApp',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default config;
EOF

# Global Styles
cat > src/styles/globals.css << 'EOF'
/* Global Reset & Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
EOF

cat > src/styles/variables.css << 'EOF'
:root {
  /* Colors */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  
  /* Neutral Colors */
  --white: #ffffff;
  --black: #000000;
  --gray-100: #f8f9fa;
  --gray-200: #e9ecef;
  --gray-300: #dee2e6;
  --gray-400: #ced4da;
  --gray-500: #adb5bd;
  --gray-600: #6c757d;
  --gray-700: #495057;
  --gray-800: #343a40;
  --gray-900: #212529;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}
EOF

# Update App.jsx
cat > src/App.jsx << 'EOF'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import './styles/globals.css';
import './styles/variables.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
EOF

# Update App.css
cat > src/App.css << 'EOF'
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
EOF

echo ""
echo "✅ src/ directory structure created successfully!"
echo ""
echo "📦 Don't forget to install required dependencies:"
echo "   npm install react-router-dom axios"
echo ""
echo "📚 Created structure includes:"
echo "   ✓ Common components (Button, Input, Modal, Loading)"
echo "   ✓ Layout components (Header, Footer)"
echo "   ✓ Pages (Home, About, Dashboard, NotFound)"
echo "   ✓ Custom hooks (useLocalStorage, useFetch, useToggle)"
echo "   ✓ Context providers (Auth, Theme)"
echo "   ✓ API services with Axios interceptors"
echo "   ✓ Utility functions (validators, formatters, helpers)"
echo "   ✓ Routing with lazy loading"
echo "   ✓ Global styles and CSS variables"
echo ""
echo "🎉 Your src/ directory is ready to use!"