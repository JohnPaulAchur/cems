import api from './api';

/**
 * Recommendation Service - Handles smart event recommendations based on user profile
 */

export const recommendationService = {
  // Get personalized event recommendations
  getRecommendations: async (userId, limit = 10) => {
    try {
      const response = await api.get(`/users/${userId}/recommendations`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  // Get recommendations by category
  getRecommendationsByCategory: async (userId, category) => {
    try {
      const response = await api.get(`/users/${userId}/recommendations/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category recommendations:', error);
      throw error;
    }
  },

  // Get trending events in user's department
  getTrendingEvents: async (department, limit = 10) => {
    try {
      const response = await api.get('/events/trending', {
        params: { department, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending events:', error);
      throw error;
    }
  },

  // Get events based on interests
  getEventsByInterests: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/events-by-interests`);
      return response.data;
    } catch (error) {
      console.error('Error fetching interest-based events:', error);
      throw error;
    }
  },

  // Get events from users in student's network
  getNetworkEvents: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/network-events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching network events:', error);
      throw error;
    }
  },

  // Save user recommendations preferences
  savePreferences: async (userId, preferences) => {
    try {
      const response = await api.post(`/users/${userId}/recommendation-preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  },

  // Update recommendation algorithm weights
  updateRecommendationWeights: async (userId, weights) => {
    try {
      const response = await api.put(`/users/${userId}/recommendation-weights`, weights);
      return response.data;
    } catch (error) {
      console.error('Error updating weights:', error);
      throw error;
    }
  },

  // Get recommendation score breakdown (for transparency)
  getScoreBreakdown: async (userId, eventId) => {
    try {
      const response = await api.get(`/users/${userId}/recommendations/${eventId}/score`);
      return response.data;
    } catch (error) {
      console.error('Error fetching score breakdown:', error);
      throw error;
    }
  },

  // Similar events to one the user liked
  getSimilarEvents: async (eventId, limit = 5) => {
    try {
      const response = await api.get(`/events/${eventId}/similar`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching similar events:', error);
      throw error;
    }
  }
};

export default recommendationService;
