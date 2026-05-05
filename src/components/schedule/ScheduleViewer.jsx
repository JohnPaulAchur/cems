import React, { useEffect, useState } from 'react';
import { Calendar, Clock, BookOpen, Zap } from 'lucide-react';
import scheduleService from '../../services/scheduleService';

export default function ScheduleViewer({ studentId }) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadSchedule();
  }, [studentId]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getFullSchedule(studentId);
      setSchedule(data);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading schedule...</div>;
  }

  if (!schedule) {
    return <div className="text-center py-8 text-gray-500">No schedule data available</div>;
  }

  const tabs = [
    { id: 'all', label: 'All', count: (schedule.classes?.length || 0) + (schedule.exams?.length || 0) + (schedule.registeredEvents?.length || 0) },
    { id: 'classes', label: 'Classes', count: schedule.classes?.length || 0 },
    { id: 'exams', label: 'Exams', count: schedule.exams?.length || 0 },
    { id: 'events', label: 'Events', count: schedule.registeredEvents?.length || 0 }
  ];

  const renderScheduleItem = (item, type) => {
    const Icon = type === 'exam' ? Zap : type === 'event' ? Calendar : BookOpen;
    const bgColor = type === 'exam' ? 'bg-orange-50 border-orange-200' : type === 'event' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200';
    const textColor = type === 'exam' ? 'text-orange-900' : type === 'event' ? 'text-blue-900' : 'text-green-900';

    return (
      <div key={item.id} className={`rounded-lg border p-3 ${bgColor} mb-2`}>
        <div className="flex items-start gap-2">
          <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${textColor}`} />
          <div className="flex-1">
            <h4 className={`font-semibold ${textColor}`}>{item.courseName || item.courseCode || item.name}</h4>
            <div className="flex items-center gap-1 text-sm mt-1">
              <Clock className="h-4 w-4" />
              {new Date(item.startTime).toLocaleString()}
            </div>
            {item.instructor && <p className="text-sm mt-1">{item.instructor}</p>}
            {item.location && <p className="text-sm mt-1">{item.location}</p>}
          </div>
        </div>
      </div>
    );
  };

  let itemsToShow = [];
  if (activeTab === 'all') {
    itemsToShow = [
      ...(schedule.classes || []).map(c => ({ ...c, type: 'class' })),
      ...(schedule.exams || []).map(e => ({ ...e, type: 'exam' })),
      ...(schedule.registeredEvents || []).map(ev => ({ ...ev, type: 'event' }))
    ].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  } else if (activeTab === 'classes') {
    itemsToShow = (schedule.classes || []).map(c => ({ ...c, type: 'class' }));
  } else if (activeTab === 'exams') {
    itemsToShow = (schedule.exams || []).map(e => ({ ...e, type: 'exam' }));
  } else if (activeTab === 'events') {
    itemsToShow = (schedule.registeredEvents || []).map(ev => ({ ...ev, type: 'event' }));
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold mb-4">My Schedule</h3>

      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 px-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {itemsToShow.length > 0 ? (
          itemsToShow.map(item => renderScheduleItem(item, item.type))
        ) : (
          <p className="text-center text-gray-500 py-4">No items in this category</p>
        )}
      </div>
    </div>
  );
}
