import React from 'react'
import { Settings, Users, Calendar, MapPin, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard label="Total Events" value="156" icon={<Calendar className="w-6 h-6" />} />
        <MetricCard label="Total Users" value="1,234" icon={<Users className="w-6 h-6" />} />
        <MetricCard label="Venues" value="12" icon={<MapPin className="w-6 h-6" />} />
        <MetricCard label="Revenue" value="₹125K" icon={<TrendingUp className="w-6 h-6" />} />
        <MetricCard label="Pending" value="8" icon={<Calendar className="w-6 h-6" />} color="yellow" />
      </div>

      {/* Admin Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionButton label="Manage Users" icon={<Users className="w-5 h-5" />} />
          <ActionButton label="Review Events" icon={<Calendar className="w-5 h-5" />} />
          <ActionButton label="Manage Venues" icon={<MapPin className="w-5 h-5" />} />
          <ActionButton label="System Settings" icon={<Settings className="w-5 h-5" />} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem
            action="Event Approved"
            details="Tech Conference 2024 approved by staff"
            time="2 hours ago"
            type="success"
          />
          <ActivityItem
            action="New User Registration"
            details="John Doe registered as Student"
            time="4 hours ago"
            type="info"
          />
          <ActivityItem
            action="Event Rejected"
            details="Music Festival rejected due to venue conflict"
            time="1 day ago"
            type="danger"
          />
          <ActivityItem
            action="Venue Added"
            details="New venue 'Open Air Stage' added to system"
            time="2 days ago"
            type="success"
          />
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <HealthIndicator label="API Status" status="healthy" />
            <HealthIndicator label="Database" status="healthy" />
            <HealthIndicator label="Storage" status="warning" />
            <HealthIndicator label="Email Service" status="healthy" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Event Statistics</h3>
          <div className="space-y-3">
            <Stat label="Events This Month" value="32" percentage="12%" />
            <Stat label="User Growth" value="48%" percentage="8%" />
            <Stat label="Venue Utilization" value="87%" percentage="5%" />
            <Stat label="Avg Attendees" value="245" percentage="3%" />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon, color = 'blue' }) {
  const bgColors = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  }

  const textColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
  }

  return (
    <div className={`${bgColors[color]} border rounded-lg p-4`}>
      <div className={`${textColors[color]} mb-2`}>{icon}</div>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  )
}

function ActionButton({ label, icon }) {
  return (
    <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium">
      {icon}
      {label}
    </button>
  )
}

function ActivityItem({ action, details, time, type }) {
  const typeColors = {
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }

  return (
    <div className="flex items-start gap-4 pb-4 border-b last:border-b-0">
      <div className={`${typeColors[type]} px-3 py-1 rounded-full text-xs font-semibold`}>
        {action}
      </div>
      <div className="flex-1">
        <p className="text-gray-900 font-medium">{details}</p>
        <p className="text-gray-500 text-sm mt-1">{time}</p>
      </div>
    </div>
  )
}

function HealthIndicator({ label, status }) {
  const statusColors = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
  }

  const statusLabels = {
    healthy: 'Healthy',
    warning: 'Warning',
    critical: 'Critical',
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-gray-700">{label}</p>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`}></div>
        <p className="text-sm font-medium text-gray-600">{statusLabels[status]}</p>
      </div>
    </div>
  )
}

function Stat({ label, value, percentage }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <p className="text-gray-700 text-sm">{label}</p>
        <span className="text-green-600 text-sm font-semibold">+{percentage}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
