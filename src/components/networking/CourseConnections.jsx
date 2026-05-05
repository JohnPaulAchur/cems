import React, { useEffect, useState } from 'react';
import { Users, Mail, UserPlus, Clock } from 'lucide-react';
import networkingService from '../../services/networkingService';
import { useAuth } from '../../context/AuthContext';

export default function CourseConnections({ eventId }) {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sentRequests, setSentRequests] = useState(new Set());

  useEffect(() => {
    loadConnections();
  }, [user?.id]);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const data = await networkingService.getCourseConnections(user?.id);
      setConnections(data);
    } catch (error) {
      console.error('Error loading connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (targetUserId, courseName) => {
    try {
      await networkingService.sendConnectionRequest(user?.id, targetUserId, courseName);
      setSentRequests(prev => new Set([...prev, targetUserId]));
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading connections...</div>;
  }

  const courseKeys = Object.keys(connections);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-600" />
        Course-Based Network
      </h3>

      {courseKeys.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No course connections available</p>
      ) : (
        <div className="space-y-4">
          {courseKeys.map(course => (
            <div key={course} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <button
                onClick={() => setSelectedCourse(selectedCourse === course ? null : course)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-semibold text-gray-900">{course}</h4>
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {connections[course]?.length || 0}
                </span>
              </button>

              {selectedCourse === course && (
                <div className="mt-2 space-y-2 pl-3">
                  {connections[course]?.map(connection => (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{connection.name}</p>
                        <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          {connection.email}
                        </p>
                      </div>
                      <button
                        onClick={() => sendConnectionRequest(connection.id, course)}
                        disabled={sentRequests.has(connection.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors ${
                          sentRequests.has(connection.id)
                            ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {sentRequests.has(connection.id) ? (
                          <>
                            <Clock className="h-4 w-4" />
                            Pending
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Connect
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
