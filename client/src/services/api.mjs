const SERVER_URL = "http://localhost:3001";



// Authentication API Methods
const authAPI = {
  // Login user - Session based
  async login(credentials) {
    try {
      const response = await fetch(`${SERVER_URL}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Login failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  },

  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${SERVER_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Registration failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  },

  // Check current session
  async checkSession() {
    try {
      const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { 
          success: false, 
          error: 'Session check failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Logout user
  async logout() {
    try {
      const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'Logout failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn === 'true';
  },

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// User API Methods
const userAPI = {


  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const response = await fetch(`${SERVER_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to update profile' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get user game history
  async getHistory(userId) {
    try {
      const response = await fetch(`${SERVER_URL}/api/users/${userId}/history`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get history' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get detailed game history
  async getDetailedHistory(userId, gameId) {
    try {
      const response = await fetch(`${SERVER_URL}/api/users/${userId}/history/${gameId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get detailed history' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Clear user's game history
  async clearHistory(userId) {
    try {
      const response = await fetch(`${SERVER_URL}/api/users/${userId}/history`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to clear history' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  }
};

// Game API Methods
const gameAPI = {
  // Start a new game session
  async startGame(themeKey) {
    try {
      const response = await fetch(`${SERVER_URL}/api/game-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          theme_key: themeKey
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to start game' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get active game session
  async getActiveGame() {
    try {
      const response = await fetch(`${SERVER_URL}/api/game-sessions/active`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get active game' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get game session by ID
  async getGameSession(sessionId) {
    try {
      const response = await fetch(`${SERVER_URL}/api/game-sessions/${sessionId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get game session' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get next card for game session
  async getNextCard(sessionId) {
    try {
      const response = await fetch(`${SERVER_URL}/api/game-sessions/${sessionId}/next-card`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get next card' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Submit a move/decision
  async submitMove(sessionId, moveData) {
    try {
      const response = await fetch(`${SERVER_URL}/api/game-sessions/${sessionId}/rounds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(moveData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to submit move' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Update game session
  async updateGameSession(sessionId, updateData) {
    try {
      const response = await fetch(`${SERVER_URL}/api/game-sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to update game session' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // End game session
  async endGame(sessionId, endData = {}) {
    try {
      const response = await fetch(`${SERVER_URL}/api/game-sessions/${sessionId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(endData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to end game' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get game rounds
  async getGameRounds(sessionId) {
    try {
      const response = await fetch(`${SERVER_URL}/api/game-sessions/${sessionId}/rounds`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get game rounds' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  }
};

// Theme API Methods
const themeAPI = {
  // Get all active themes
  async getAll() {
    try {
      const response = await fetch(`${SERVER_URL}/api/themes`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get themes' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get all themes (including inactive)
  async getAllThemes() {
    try {
      const response = await fetch(`${SERVER_URL}/api/themes/all`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get all themes' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get theme by key
  async getByKey(themeKey) {
    try {
      const response = await fetch(`${SERVER_URL}/api/themes/${themeKey}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get theme' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get theme cards
  async getCards(themeId, limit = null) {
    try {
      let url = `${SERVER_URL}/api/themes/${themeId}/cards`;
      if (limit) {
        url += `?limit=${limit}`;
      }
      
      const response = await fetch(url, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get theme cards' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get random theme cards
  async getRandomCards(themeId, count = 6) {
    try {
      const response = await fetch(`${SERVER_URL}/api/themes/${themeId}/cards/random?count=${count}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get random theme cards' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  }
};

// Card API Methods
const cardAPI = {
  // Get random cards
  async getRandom(count = 3, excludeIds = []) {
    try {
      let url = `${SERVER_URL}/api/cards/random?count=${count}`;
      if (excludeIds.length > 0) {
        url += `&exclude=${excludeIds.join(',')}`;
      }
      
      const response = await fetch(url, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get random cards' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get card by ID
  async getById(cardId) {
    try {
      const response = await fetch(`${SERVER_URL}/api/cards/${cardId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get card' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get cards by range
  async getByRange(min = 0, max = 100) {
    try {
      const response = await fetch(`${SERVER_URL}/api/cards/range?min=${min}&max=${max}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get cards by range' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get similar cards
  async getSimilar(severity = 50, tolerance = 5) {
    try {
      const response = await fetch(`${SERVER_URL}/api/cards/similar?severity=${severity}&tolerance=${tolerance}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get similar cards' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  },

  // Get card count
  async getCount() {
    try {
      const response = await fetch(`${SERVER_URL}/api/cards/count`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Failed to get card count' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  }
};



// Export all API methods
const API = {
  auth: authAPI,
  user: userAPI,
  game: gameAPI,
  theme: themeAPI,
  card: cardAPI
};

export default API;

// Export individual APIs for convenience
export { authAPI, userAPI, gameAPI, themeAPI, cardAPI }; 