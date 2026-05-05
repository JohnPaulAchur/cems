import React, { useState } from 'react'
import { Plus, Globe, Lock, AlertCircle } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

export default function ExternalUserDashboard() {
  const [externalEvents] = useState([
    {
      id: 1,
      title: 'Workshop: Business Networking',
      date: '2024-05-10',
      time: '15:00',
      venue: 'Conference Hall',
      status: 'approved',
      attendees: 80,
      isPaid: true,
      totalCost: 5000,
    },
    {
      id: 2,
      title: 'Seminar: Leadership Development',
      date: '2024-06-05',
      time: '10:00',
      venue: 'Training Room B',
      status: 'pending',
      attendees: 40,
      isPaid: false,
    },
  ])

  return (
    <div className="space-y-8">
      {/* Important Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">External User Information</h3>
          <p className="text-blue-800 text-sm mt-1">
            Your events may require additional approval and payment for venue and facilities.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Events" value="2" color="blue" />
        <StatCard label="Approved" value="1" color="green" />
        <StatCard label="Total Spent" value="₹5,000" color="purple" />
      </div>

      {/* Create Event Button */}
      <div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          <Plus className="w-5 h-5" />
          Create New Event
        </button>
      </div>

      {/* Events List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Events</h2>
        <div className="space-y-4">
          {externalEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {event.attendees} expected attendees
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {event.status === 'approved' ? 'Approved' : 'Pending Approval'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(event.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Time</p>
                  <p className="text-sm font-medium text-gray-900">{event.time}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Venue</p>
                  <p className="text-sm font-medium text-gray-900">{event.venue}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="text-sm font-medium text-gray-900">
                    {event.isPaid ? '✓ Paid' : 'Pending Payment'}
                  </p>
                </div>
              </div>

              {event.status === 'approved' && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Total Cost: ₹{event.totalCost}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Includes venue + facilities</p>
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors">
                  View Details
                </button>
                {event.status === 'approved' && !event.isPaid && (
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Public Access</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Your approved events are visible to all users on the campus events platform.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Events appear in public event listings</li>
            <li>• Users can view your event details</li>
            <li>• Venue availability is updated automatically</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Payment Required</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            As an external user, payment is required for venue and facilities.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Secure online payment</li>
            <li>• Invoice provided after approval</li>
            <li>• Multiple payment methods accepted</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  const bgColors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  }

  return (
    <div className={`${bgColors[color]} p-6 rounded-lg border`}>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}
