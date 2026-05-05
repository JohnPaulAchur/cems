import api from './api'

const venueService = {
  // Get all venues
  getAllVenues: () => api.get('/venues'),

  // Get venue by ID
  getVenue: (id) => api.get(`/venues/${id}`),

  // Create venue (admin)
  createVenue: (venueData) => api.post('/venues', venueData),

  // Update venue (admin)
  updateVenue: (id, venueData) => api.put(`/venues/${id}`, venueData),

  // Delete venue (admin)
  deleteVenue: (id) => api.delete(`/venues/${id}`),

  // Check venue availability
  checkAvailability: (venueId, startDate, endDate) =>
    api.get(`/venues/${venueId}/availability`, {
      params: { start_date: startDate, end_date: endDate },
    }),

  // Book venue
  bookVenue: (venueId, eventId, bookingData) =>
    api.post(`/venues/${venueId}/book`, { event_id: eventId, ...bookingData }),

  // Get venue bookings
  getVenueBookings: (venueId) => api.get(`/venues/${venueId}/bookings`),

  // Cancel booking
  cancelBooking: (bookingId) => api.post(`/bookings/${bookingId}/cancel`),

  // Get venue capacity
  getCapacity: (venueId) => api.get(`/venues/${venueId}/capacity`),
}

export default venueService
