import React, { createContext, useContext, useState, useCallback } from 'react'

const EventContext = createContext()

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [filter, setFilter] = useState('all') // all, approved, pending, rejected
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addEvent = useCallback((event) => {
    setEvents((prev) => [event, ...prev])
  }, [])

  const updateEvent = useCallback((id, updates) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    )
    if (selectedEvent?.id === id) {
      setSelectedEvent((prev) => ({ ...prev, ...updates }))
    }
  }, [selectedEvent])

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
    if (selectedEvent?.id === id) {
      setSelectedEvent(null)
    }
  }, [selectedEvent])

  const getFilteredEvents = useCallback(() => {
    if (filter === 'all') return events
    return events.filter((event) => event.status === filter)
  }, [events, filter])

  const value = {
    events,
    selectedEvent,
    filter,
    loading,
    error,
    setEvents,
    setSelectedEvent,
    setFilter,
    setLoading,
    setError,
    addEvent,
    updateEvent,
    deleteEvent,
    getFilteredEvents,
  }

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}

export const useEvent = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvent must be used within EventProvider')
  }
  return context
}
