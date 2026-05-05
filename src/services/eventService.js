import api from './api'

const eventService = {
  // Get all events
  getAllEvents: () => api.get('/events'),

  // Get user's events
  getUserEvents: () => api.get('/events/user'),

  // Get pending events (for staff/admin)
  getPendingEvents: () => api.get('/events/pending'),

  // Get event by ID
  getEvent: (id) => api.get(`/events/${id}`),

  // Create event
  createEvent: (eventData) => api.post('/events', eventData),

  // Update event
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),

  // Delete event
  deleteEvent: (id) => api.delete(`/events/${id}`),

  // Approve event (admin/staff)
  approveEvent: (id, feedback = '') =>
    api.post(`/events/${id}/approve`, { feedback }),

  // Reject event (admin/staff)
  rejectEvent: (id, reason = '') =>
    api.post(`/events/${id}/reject`, { reason }),

  // Get events by status
  getEventsByStatus: (status) => api.get(`/events/status/${status}`),

  // Search events
  searchEvents: (query) => api.get('/events/search', { params: { q: query } }),

  // Add additional features to event
  addFeatures: (eventId, features) =>
    api.post(`/events/${eventId}/features`, { features }),

  // Get event statistics
  getStatistics: () => api.get('/events/statistics'),
}

export default eventService
