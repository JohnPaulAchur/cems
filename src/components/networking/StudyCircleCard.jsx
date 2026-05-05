import React, { useState } from 'react';
import { Users, BookOpen, Plus, Check, X } from 'lucide-react';
import { useNetworking } from '../../context/NetworkingContext';

export default function StudyCircleCard({ circle, onJoin, onLeave, isJoined }) {
  const [joining, setJoining] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const handleJoin = async () => {
    try {
      setJoining(true);
      await onJoin(circle.id);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-blue-100 p-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{circle.courseName}</h3>
            <p className="text-sm text-gray-600">Study Circle</p>
          </div>
        </div>
        {isJoined && (
          <div className="rounded-full bg-green-100 p-1">
            <Check className="h-4 w-4 text-green-600" />
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Users className="h-4 w-4" />
          <span>{circle.members?.length || 0} members</span>
        </div>
        {circle.description && (
          <p className="text-sm text-gray-700 line-clamp-2">{circle.description}</p>
        )}
      </div>

      {showMembers && circle.members?.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Members:</p>
          <div className="space-y-1">
            {circle.members.slice(0, 5).map(member => (
              <div key={member.id} className="text-xs text-gray-600">
                {member.name || member.email}
              </div>
            ))}
            {circle.members.length > 5 && (
              <p className="text-xs text-gray-500">+{circle.members.length - 5} more</p>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setShowMembers(!showMembers)}
          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {showMembers ? 'Hide Members' : 'View Members'}
        </button>
        {!isJoined ? (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Join
          </button>
        ) : (
          <button
            onClick={() => onLeave(circle.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Leave
          </button>
        )}
      </div>
    </div>
  );
}
