import api from './api';

/**
 * Q&A Service - Handles anonymous questions and feedback during events
 */

export const qaService = {
  // Submit an anonymous question for an event
  submitQuestion: async (eventId, question, category = 'general') => {
    try {
      const response = await api.post(`/events/${eventId}/questions`, {
        question,
        category
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting question:', error);
      throw error;
    }
  },

  // Get all questions for an event
  getEventQuestions: async (eventId, sortBy = 'votes') => {
    try {
      const response = await api.get(`/events/${eventId}/questions`, {
        params: { sortBy }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching event questions:', error);
      throw error;
    }
  },

  // Vote on a question (upvote)
  upvoteQuestion: async (questionId) => {
    try {
      const response = await api.post(`/questions/${questionId}/upvote`);
      return response.data;
    } catch (error) {
      console.error('Error upvoting question:', error);
      throw error;
    }
  },

  // Remove vote on a question
  removeVote: async (questionId) => {
    try {
      const response = await api.post(`/questions/${questionId}/unvote`);
      return response.data;
    } catch (error) {
      console.error('Error removing vote:', error);
      throw error;
    }
  },

  // Flag a question as answered (organizer/staff only)
  markQuestionAnswered: async (questionId) => {
    try {
      const response = await api.post(`/questions/${questionId}/answered`);
      return response.data;
    } catch (error) {
      console.error('Error marking question as answered:', error);
      throw error;
    }
  },

  // Delete a question (organizer/staff only)
  deleteQuestion: async (questionId) => {
    try {
      const response = await api.delete(`/questions/${questionId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  // Submit event feedback (anonymous)
  submitFeedback: async (eventId, feedbackData) => {
    try {
      const response = await api.post(`/events/${eventId}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  // Get event feedback summary
  getEventFeedback: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}/feedback-summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event feedback:', error);
      throw error;
    }
  },

  // Get all feedback for an event (organizer/staff only)
  getAllEventFeedback: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}/feedback`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all feedback:', error);
      throw error;
    }
  }
};

export default qaService;
