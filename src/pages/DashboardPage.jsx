import React from 'react'
import { useAuth } from '../context/AuthContext'
import { USER_ROLES } from '../utils/constants'
import StudentDashboard from '../components/dashboards/StudentDashboard'
import StaffDashboard from '../components/dashboards/StaffDashboard'
import AdminDashboard from '../components/dashboards/AdminDashboard'
import ExternalUserDashboard from '../components/dashboards/ExternalUserDashboard'

export default function DashboardPage() {
  const { user, userRole } = useAuth()

  const renderDashboard = () => {
    switch (userRole) {
      case USER_ROLES.STUDENT:
        return <StudentDashboard />
      case USER_ROLES.STAFF:
        return <StaffDashboard />
      case USER_ROLES.ADMIN:
        return <AdminDashboard />
      case USER_ROLES.EXTERNAL_USER:
        return <ExternalUserDashboard />
      default:
        return <div className="p-8 text-center text-gray-500">Unknown user role</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">
            This is your {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} dashboard
          </p>
        </div>

        {/* Dashboard Content */}
        {renderDashboard()}
      </div>
    </div>
  )
}
