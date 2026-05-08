import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { useEvent } from '../context/EventContext'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

import {
  ArrowLeft,
  Calendar,
  MapPin,
} from 'lucide-react'

export default function EventCreatePage() {
  const navigate = useNavigate()

  const { user } = useAuth()
  const { addEvent } = useEvent()
  const { notify } = useNotification()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'academic',
    capacity: '',
    resources: [],
  })

  const [loading, setLoading] = useState(false)

  const categories = [
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'tech', label: 'Technology' },
    { value: 'social', label: 'Social' },
    { value: 'career', label: 'Career & Professional' },
  ]

  const availableResources = [
    { id: 1, name: 'Projector', cost: 5000 },
    { id: 2, name: 'Microphone System', cost: 10000 },
    { id: 3, name: 'Catering (per person)', cost: 1000 },
    { id: 4, name: 'Chairs & Tables', cost: 7500 },
    { id: 5, name: 'Lighting Equipment', cost: 15000 },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleResourceToggle = (resourceId) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.includes(resourceId)
        ? prev.resources.filter((id) => id !== resourceId)
        : [...prev.resources, resourceId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.time ||
      !formData.venue ||
      !formData.capacity
    ) {
      notify('Please fill in all required fields', 'error')
      return
    }

    setLoading(true)

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        venue_id: null,
        event_date: formData.date,
        event_time: formData.time,
        capacity: Number(formData.capacity),
        tags: [],
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/events`,
        payload
      )

      const createdEvent = response.data.event

      addEvent(createdEvent)

      // notify(
      //   'Event created successfully! Awaiting approval.',
      //   'success'
      // )
      alert('Event created successfully! Awaiting approval.')

      navigate('/dashboard')
    } catch (error) {
      console.error('CREATE EVENT ERROR:', error)

      notify(
        error.response?.data?.message ||
          'Failed to create event. Please try again.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const selectedResourcesCost = formData.resources.reduce(
    (total, resourceId) => {
      const resource = availableResources.find(
        (r) => r.id === resourceId
      )

      return total + (resource?.cost || 0)
    },
    0
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title="Go back to dashboard"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Event
            </h1>

            <p className="text-gray-600 mt-1">
              Plan and organize your campus event
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Event Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Event Details
            </h2>

            <div className="space-y-4">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Summit 2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe your event..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Date & Time
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date *
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Venue & Capacity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Venue & Capacity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue *
                </label>

                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="e.g. Main Auditorium"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Attendees *
                </label>

                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Resources
            </h2>

            <div className="space-y-3">
              {availableResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center"
                >
                  <input
                    type="checkbox"
                    id={`resource-${resource.id}`}
                    checked={formData.resources.includes(resource.id)}
                    onChange={() =>
                      handleResourceToggle(resource.id)
                    }
                    className="w-4 h-4"
                  />

                  <label
                    htmlFor={`resource-${resource.id}`}
                    className="ml-3 text-sm text-gray-700"
                  >
                    {resource.name} - ₦{resource.cost}
                  </label>
                </div>
              ))}
            </div>

            {selectedResourcesCost > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Estimated Cost:</strong> ₦
                  {selectedResourcesCost}
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}