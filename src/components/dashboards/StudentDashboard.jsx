import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEvent } from '../../context/EventContext'
import { useAuth } from '../../context/AuthContext'
import { Plus, Calendar, MapPin, Clock, Sparkles } from 'lucide-react'
import { formatDate } from '../../utils/helpers'
import RecommendationEngine from '../recommendations/RecommendationEngine'
import ScheduleViewer from '../schedule/ScheduleViewer'
import EventDetailModal from '../events/EventDetailModal'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { events } = useEvent()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventModal, setShowEventModal] = useState(false)

  // Mock data for demonstration
  const studentEvents = [
    {
      id: 1,
      title: 'Tech Conference 2024',
      date: '2024-05-15',
      time: '10:00',
      venue: 'Main Auditorium',
      status: 'approved',
      attendees: 150,
      description: 'Annual technology conference with industry experts',
    },
    {
      id: 2,
      title: 'Workshop: Web Development',
      date: '2024-04-28',
      time: '14:00',
      venue: 'Computer Lab A',
      status: 'pending',
      attendees: 50,
      description: 'Hands-on workshop for web development basics',
    },
    {
      id: 3,
      title: 'Sports Day Finale',
      date: '2024-05-30',
      time: '08:00',
      venue: 'Sports Ground',
      status: 'approved',
      attendees: 300,
      description: 'Final matches and award ceremony',
    },
  ]

  const filteredEvents = selectedFilter === 'all' 
    ? studentEvents 
    : studentEvents.filter((e) => e.status === selectedFilter)

  const handleRegisterEvent = (eventId) => {
    console.log('Registering for event:', eventId)
    setShowEventModal(false)
  }

  const handleViewEventDetails = (event) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Events" value="3" color="blue" />
        <StatCard label="Approved" value="2" color="green" />
        <StatCard label="Pending" value="1" color="yellow" />
      </div>

      {/* My Schedule Viewer */}
      {user?.id && (
        <ScheduleViewer studentId={user.id} />
      )}

      {/* Smart Event Recommendations */}
      <RecommendationEngine
        allEvents={studentEvents}
        onRegisterEvent={handleRegisterEvent}
      />

      {/* Create Event Button */}
      <div>
        <button
          onClick={() => navigate('/events/create')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Create New Event
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 border-b">
        {['all', 'approved', 'pending', 'rejected'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedFilter === filter
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onViewDetails={() => handleViewEventDetails(event)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No events found in this category
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        userRole="student"
      />
    </div>
  )
}

function StatCard({ label, value, color }) {
  const bgColors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  }

  return (
    <div className={`${bgColors[color]} p-6 rounded-lg border`}>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}

function EventCard({ event, onViewDetails }) {
  const statusColors = {
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{event.description}</p>
        </div>
        <span className={`${statusColors[event.status]} px-3 py-1 rounded-full text-xs font-semibold`}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{event.venue}</span>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-semibold">{event.attendees}</span> expected attendees
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button 
          onClick={onViewDetails}
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors"
        >
          View Details
        </button>
        <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
          Edit
        </button>
      </div>
    </div>
  )
}
