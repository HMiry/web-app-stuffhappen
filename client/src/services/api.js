import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API Endpoints
const ENDPOINTS = {
  // Authentication
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
  
  // User
  USER_PROFILE: '/user/profile',
  USER_UPDATE_PROFILE: '/user/profile',
  USER_CHANGE_PASSWORD: '/user/change-password',
  
  // Game
  GAME_START: '/game/start',
  GAME_MOVE: '/game/move',
  GAME_STATE: '/game/state',
  GAME_END: '/game/end',
  GAME_HISTORY: '/game/history',
  GAME_LEADERBOARD: '/game/leaderboard',
  
  // Disasters/Cards
  DISASTERS_ALL: '/disasters',
  DISASTERS_BY_THEME: '/disasters/theme',
  DISASTERS_RANDOM: '/disasters/random',
  
  // Themes
  THEMES_ALL: '/themes',
  THEMES_BY_ID: '/themes',
  
  // Statistics
  STATS_USER: '/stats/user',
  STATS_GLOBAL: '/stats/global',
  
  // Demo
  DEMO_START: '/demo/start',
  DEMO_CONTENT: '/demo/content',
};

// Authentication API Methods
const authAPI = {
  // Login user
  async login(credentials) {
    try {
      const response = await api.post(ENDPOINTS.AUTH_LOGIN, credentials);
      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  // Register new user
  async register(userData) {
    try {
      const response = await api.post(ENDPOINTS.AUTH_REGISTER, userData);
      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post(ENDPOINTS.AUTH_LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post(ENDPOINTS.AUTH_FORGOT_PASSWORD, { email });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Password reset request failed' 
      };
    }
  },

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post(ENDPOINTS.AUTH_RESET_PASSWORD, {
        token,
        password: newPassword
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Password reset failed' 
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return !!(token && isLoggedIn === 'true');
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }
};

// User API Methods
const userAPI = {
  // Get user profile
  async getProfile() {
    try {
      const response = await api.get(ENDPOINTS.USER_PROFILE);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get profile' 
      };
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put(ENDPOINTS.USER_UPDATE_PROFILE, profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  },

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await api.put(ENDPOINTS.USER_CHANGE_PASSWORD, passwordData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to change password' 
      };
    }
  }
};

// Game API Methods
const gameAPI = {
  // Start new game
  async startGame(gameData = {}) {
    try {
      const response = await api.post(ENDPOINTS.GAME_START, gameData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to start game' 
      };
    }
  },

  // Submit game move
  async submitMove(moveData) {
    try {
      const response = await api.post(ENDPOINTS.GAME_MOVE, moveData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to submit move' 
      };
    }
  },

  // Get game state
  async getGameState(gameId) {
    try {
      const response = await api.get(`${ENDPOINTS.GAME_STATE}/${gameId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get game state' 
      };
    }
  },

  // End game
  async endGame(gameData) {
    try {
      const response = await api.post(ENDPOINTS.GAME_END, gameData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to end game' 
      };
    }
  },

  // Get game history
  async getGameHistory(userId) {
    try {
      const response = await api.get(`${ENDPOINTS.GAME_HISTORY}/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get game history' 
      };
    }
  },

  // Get leaderboard
  async getLeaderboard(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${ENDPOINTS.GAME_LEADERBOARD}?${queryString}` : ENDPOINTS.GAME_LEADERBOARD;
      const response = await api.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get leaderboard' 
      };
    }
  }
};

// Disasters/Cards API Methods
const disastersAPI = {
  // Get all disasters
  async getAll(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${ENDPOINTS.DISASTERS_ALL}?${queryString}` : ENDPOINTS.DISASTERS_ALL;
      const response = await api.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get disasters' 
      };
    }
  },

  // Get disasters by theme
  async getByTheme(theme) {
    try {
      const response = await api.get(`${ENDPOINTS.DISASTERS_BY_THEME}/${theme}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get disasters by theme' 
      };
    }
  },

  // Get random disasters
  async getRandom(count = 10) {
    try {
      const response = await api.get(`${ENDPOINTS.DISASTERS_RANDOM}?count=${count}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get random disasters' 
      };
    }
  }
};

// Themes API Methods
const themesAPI = {
  // Get all themes
  async getAll() {
    try {
      const response = await api.get(ENDPOINTS.THEMES_ALL);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get themes' 
      };
    }
  },

  // Get theme by ID
  async getById(themeId) {
    try {
      const response = await api.get(`${ENDPOINTS.THEMES_BY_ID}/${themeId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get theme' 
      };
    }
  }
};

// Statistics API Methods
const statsAPI = {
  // Get user statistics
  async getUserStats(userId) {
    try {
      const response = await api.get(`${ENDPOINTS.STATS_USER}/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get user stats' 
      };
    }
  },

  // Get global statistics
  async getGlobalStats() {
    try {
      const response = await api.get(ENDPOINTS.STATS_GLOBAL);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get global stats' 
      };
    }
  }
};

// Demo API Methods
const demoAPI = {
  // Start demo
  async startDemo() {
    try {
      const response = await api.post(ENDPOINTS.DEMO_START);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to start demo' 
      };
    }
  },

  // Get demo content
  async getDemoContent() {
    try {
      const response = await api.get(ENDPOINTS.DEMO_CONTENT);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get demo content' 
      };
    }
  }
};

// Export everything as a single API object
const API = {
  // Raw axios instance for custom calls
  axios: api,
  
  // API endpoints
  endpoints: ENDPOINTS,
  
  // API methods grouped by feature
  auth: authAPI,
  user: userAPI,
  game: gameAPI,
  disasters: disastersAPI,
  themes: themesAPI,
  stats: statsAPI,
  demo: demoAPI,
  
  // Generic HTTP methods
  async get(endpoint, config = {}) {
    try {
      const response = await api.get(endpoint, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Request failed' 
      };
    }
  },

  async post(endpoint, data = {}, config = {}) {
    try {
      const response = await api.post(endpoint, data, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Request failed' 
      };
    }
  },

  async put(endpoint, data = {}, config = {}) {
    try {
      const response = await api.put(endpoint, data, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Request failed' 
      };
    }
  },

  async delete(endpoint, config = {}) {
    try {
      const response = await api.delete(endpoint, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Request failed' 
      };
    }
  }
};

export default API; 