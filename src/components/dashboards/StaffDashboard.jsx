import React, { useState } from 'react'
import { Plus, CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

export default function StaffDashboard() {
  const [pendingEvents] = useState([
    {
      id: 1,
      title: 'Annual Sports Day',
      organization: 'John Doe',
      date: '2024-05-20',
      venue: 'Sports Ground',
      attendees: 500,
      status: 'pending',
    },
    {
      id: 2,
      title: 'Music Festival',
      organization: 'Jane Smith',
      date: '2024-06-10',
      venue: 'Outdoor Stage',
      attendees: 1000,
      status: 'pending',
    },
  ])

  const [feedback, setFeedback] = useState({})

  const handleApprove = (eventId) => {
    console.log('Approved event:', eventId)
  }

  const handleReject = (eventId) => {
    console.log('Rejected event:', eventId)
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Pending Events" value={pendingEvents.length} color="yellow" />
        <StatCard label="Total Reviewed" value="24" color="blue" />
        <StatCard label="Approved This Month" value="18" color="green" />
      </div>

      {/* Create Event Button */}
      <div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Pending Events for Review */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Events</h2>
        <div className="space-y-4">
          {pendingEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 text-sm">Organized by {event.organization}</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Pending Review
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(event.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Venue</p>
                  <p className="text-sm font-medium text-gray-900">{event.venue}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Expected Attendees</p>
                  <p className="text-sm font-medium text-gray-900">{event.attendees}</p>
                </div>
              </div>

              {/* Feedback Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback (optional)
                </label>
                <textarea
                  value={feedback[event.id] || ''}
                  onChange={(e) =>
                    setFeedback((prev) => ({
                      ...prev,
                      [event.id]: e.target.value,
                    }))
                  }
                  placeholder="Add feedback or comments..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows="3"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(event.id)}
                  className="flex items-center gap-2 flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(event.id)}
                  className="flex items-center gap-2 flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
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
