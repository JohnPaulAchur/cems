import { format, isToday, isTomorrow, parseISO } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM dd, yyyy')
}

export const formatTime = (time) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export const formatDateTime = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM dd, yyyy HH:mm')
}

export const getRelativeDate = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (isToday(dateObj)) return 'Today'
  if (isTomorrow(dateObj)) return 'Tomorrow'
  return format(dateObj, 'MMM dd, yyyy')
}

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

export const calculateTotalPrice = (features) => {
  return features.reduce((total, feature) => total + (feature.price || 0), 0)
}

export const groupEventsByStatus = (events) => {
  const grouped = {}
  events.forEach((event) => {
    if (!grouped[event.status]) {
      grouped[event.status] = []
    }
    grouped[event.status].push(event)
  })
  return grouped
}

export const getStatusBadgeClass = (status) => {
  const classMap = {
    draft: 'bg-gray-200 text-gray-800',
    pending: 'bg-yellow-200 text-yellow-800',
    approved: 'bg-green-200 text-green-800',
    rejected: 'bg-red-200 text-red-800',
    cancelled: 'bg-red-200 text-red-800',
    completed: 'bg-blue-200 text-blue-800',
  }
  return classMap[status] || 'bg-gray-200 text-gray-800'
}

export const getStatusColor = (status) => {
  const colorMap = {
    draft: '#6b7280',
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
    cancelled: '#ef4444',
    completed: '#3b82f6',
  }
  return colorMap[status] || '#6b7280'
}
