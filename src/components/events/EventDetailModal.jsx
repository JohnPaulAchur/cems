import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Clock, AlertCircle } from 'lucide-react';
import ScheduleClashAlert from '../schedule/ScheduleClashAlert';
import StudyCircleCard from '../networking/StudyCircleCard';
import CourseConnections from '../networking/CourseConnections';
import QuestionSubmission from '../qa/QuestionSubmission';
import QuestionsFeed from '../qa/QuestionsFeed';
import { useSchedule } from '../../context/ScheduleContext';

export default function EventDetailModal({ event, isOpen, onClose, userRole = 'student' }) {
  const { detectScheduleClash } = useSchedule();
  const [activeTab, setActiveTab] = useState('overview');
  const [studentSchedule, setStudentSchedule] = useState(null);

  useEffect(() => {
    if (event && event.id) {
      // In a real app, load student's schedule from API
      // detectScheduleClash(event.startTime, event.duration, studentSchedule?.classes, studentSchedule?.exams);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'schedule', label: 'Schedule Check' },
    { id: 'networking', label: 'Network' },
    { id: 'qa', label: 'Q&A' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            {event.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">About This Event</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{event.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                </div>
                <p className="font-medium text-gray-900">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span>Time</span>
                </div>
                <p className="font-medium text-gray-900">
                  {event.startTime} - {event.endTime}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </div>
                <p className="font-medium text-gray-900">{event.location || 'TBD'}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Users className="h-4 w-4" />
                  <span>Capacity</span>
                </div>
                <p className="font-medium text-gray-900">
                  {event.registeredCount}/{event.capacity}
                </p>
              </div>
            </div>

            {event.tags && event.tags.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-4">
            <ScheduleClashAlert
              eventId={event.id}
              eventTime={event.date}
              eventDuration={event.duration}
              onClose={() => setActiveTab('overview')}
            />
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                We check your classes, exams, and registered events to alert you of any conflicts.
              </p>
            </div>
          </div>
        );

      case 'networking':
        return (
          <div className="space-y-6">
            <StudyCircleCard
              circle={{
                id: `circle_${event.id}`,
                courseName: 'Computer Science',
                description: 'Study group for CS students attending this event',
                members: [
                  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
                  { id: 2, name: 'Bob Smith', email: 'bob@example.com' }
                ]
              }}
              onJoin={() => console.log('Join study circle')}
              onLeave={() => console.log('Leave study circle')}
              isJoined={false}
            />
            <CourseConnections eventId={event.id} />
          </div>
        );

      case 'qa':
        return (
          <div className="space-y-6">
            <QuestionSubmission eventId={event.id} />
            <QuestionsFeed eventId={event.id} isOrganizer={userRole === 'staff' || userRole === 'admin'} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
            {event.organizer && (
              <p className="text-sm text-gray-600 mt-1">by {event.organizer}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
