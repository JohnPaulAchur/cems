import api from './api';

/**
 * Networking Service - Handles study circles, course connections, and networking features
 */

export const networkingService = {
  // Get all students in same course attending same event
  getStudyCircleMembers: async (eventId, courseName) => {
    try {
      const response = await api.get(`/events/${eventId}/study-circle`, {
        params: { courseName }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching study circle members:', error);
      throw error;
    }
  },

  // Get all study circles user is part of
  getUserStudyCircles: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/study-circles`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user study circles:', error);
      throw error;
    }
  },

  // Create a new study circle for an event
  createStudyCircle: async (eventId, courseName, description) => {
    try {
      const response = await api.post('/study-circles', {
        eventId,
        courseName,
        description
      });
      return response.data;
    } catch (error) {
      console.error('Error creating study circle:', error);
      throw error;
    }
  },

  // Join an existing study circle
  joinStudyCircle: async (circleId, userId) => {
    try {
      const response = await api.post(`/study-circles/${circleId}/join`, {
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error joining study circle:', error);
      throw error;
    }
  },

  // Leave a study circle
  leaveStudyCircle: async (circleId, userId) => {
    try {
      const response = await api.post(`/study-circles/${circleId}/leave`, {
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error leaving study circle:', error);
      throw error;
    }
  },

  // Get students in same courses for networking
  getCourseConnections: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/course-connections`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course connections:', error);
      throw error;
    }
  },

  // Send connection request to another student
  sendConnectionRequest: async (userId, targetUserId, courseName) => {
    try {
      const response = await api.post('/connections/request', {
        fromUserId: userId,
        toUserId: targetUserId,
        courseName
      });
      return response.data;
    } catch (error) {
      console.error('Error sending connection request:', error);
      throw error;
    }
  },

  // Accept connection request
  acceptConnectionRequest: async (requestId) => {
    try {
      const response = await api.post(`/connections/request/${requestId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Error accepting connection request:', error);
      throw error;
    }
  },

  // Get pending connection requests
  getPendingConnections: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/pending-connections`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending connections:', error);
      throw error;
    }
  },

  // Get user's network/connections
  getUserNetwork: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/network`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user network:', error);
      throw error;
    }
  }
};

export default networkingService;
