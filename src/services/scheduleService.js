import api from './api';

/**
 * Schedule Service - Handles all schedule-related API calls for clash detection
 */

export const scheduleService = {
  // Get student's class schedule
  getStudentClasses: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/classes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student classes:', error);
      throw error;
    }
  },

  // Get student's exam schedule
  getStudentExams: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/exams`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student exams:', error);
      throw error;
    }
  },

  // Get student's registered events
  getStudentRegisteredEvents: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/registered-events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching registered events:', error);
      throw error;
    }
  },

  // Get full schedule for a student
  getFullSchedule: async (studentId) => {
    try {
      const [classes, exams, events] = await Promise.all([
        scheduleService.getStudentClasses(studentId),
        scheduleService.getStudentExams(studentId),
        scheduleService.getStudentRegisteredEvents(studentId)
      ]);

      return {
        classes,
        exams,
        registeredEvents: events
      };
    } catch (error) {
      console.error('Error fetching full schedule:', error);
      throw error;
    }
  },

  // Check for schedule conflicts before registration
  checkScheduleConflicts: async (eventId, studentId) => {
    try {
      const response = await api.post('/schedule/check-conflicts', {
        eventId,
        studentId
      });
      return response.data;
    } catch (error) {
      console.error('Error checking schedule conflicts:', error);
      throw error;
    }
  },

  // Get upcoming class/exam schedule
  getUpcomingSchedule: async (studentId, daysAhead = 30) => {
    try {
      const response = await api.get(`/students/${studentId}/upcoming-schedule`, {
        params: { daysAhead }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming schedule:', error);
      throw error;
    }
  }
};

export default scheduleService;
