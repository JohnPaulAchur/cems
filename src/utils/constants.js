export const USER_ROLES = {
  STUDENT: 'student',
  STAFF: 'staff',
  ADMIN: 'admin',
  EXTERNAL_USER: 'external_user',
}

export const ROLE_LABELS = {
  student: 'Student',
  staff: 'Staff',
  admin: 'Administrator',
  external_user: 'External User',
}

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

export const STATUS_LABELS = {
  draft: 'Draft',
  pending: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

export const STATUS_COLORS = {
  draft: '#gray-500',
  pending: '#yellow-500',
  approved: '#green-500',
  rejected: '#red-500',
  cancelled: '#red-500',
  completed: '#blue-500',
}

export const ADDITIONAL_FEATURES = [
  { id: 'speaker', label: 'Speaker/Microphone', price: 500 },
  { id: 'projector', label: 'Projector & Screen', price: 1000 },
  { id: 'sound_system', label: 'Sound System', price: 2000 },
  { id: 'catering', label: 'Catering', price: 5000 },
  { id: 'decoration', label: 'Decoration', price: 3000 },
  { id: 'security', label: 'Security Staff', price: 2000 },
  { id: 'photography', label: 'Photography Service', price: 3000 },
  { id: 'videography', label: 'Videography Service', price: 5000 },
]

export const VENUE_TYPES = ['Auditorium', 'Classroom', 'Conference Room', 'Outdoor Space', 'Multipurpose Hall']

export const NAVIGATION_ITEMS = {
  student: [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/events/create', label: 'Create Event' },
    { path: '/events', label: 'Browse Events' },
    { path: '/my-events', label: 'My Events' },
  ],
  staff: [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/events/pending', label: 'Pending Events' },
    { path: '/events/create', label: 'Create Event' },
    { path: '/events', label: 'All Events' },
    { path: '/venues', label: 'Venues' },
  ],
  admin: [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/events/pending', label: 'Pending Events' },
    { path: '/events', label: 'All Events' },
    { path: '/venues', label: 'Venues' },
    { path: '/users', label: 'Users' },
    { path: '/settings', label: 'Settings' },
  ],
  external_user: [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/events', label: 'Browse Events' },
    { path: '/events/create', label: 'Create Event' },
    { path: '/my-events', label: 'My Events' },
  ],
}
