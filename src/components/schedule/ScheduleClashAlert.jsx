import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock, BookOpen, Zap } from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';

export default function ScheduleClashAlert({ eventId, eventTime, eventDuration, onClose }) {
  const { clashDetected, clashDetails, detectScheduleClash } = useSchedule();
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    // This would typically be called when loading event details
    // For now, just tracking state
  }, []);

  if (!clashDetected) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900">Schedule Conflict Detected</h3>
          <p className="text-sm text-red-800 mt-1">
            This event conflicts with {clashDetails.length} scheduled class{clashDetails.length !== 1 ? 'es' : ''}, exam{clashDetails.length !== 1 ? 's' : ''}, or registered event{clashDetails.length !== 1 ? 's' : ''}.
          </p>
          
          {expanded && (
            <div className="mt-3 space-y-2">
              {clashDetails.map((clash, idx) => (
                <div
                  key={idx}
                  className="text-sm rounded bg-red-100 p-2 flex items-start gap-2"
                >
                  {clash.type === 'class' && <BookOpen className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />}
                  {clash.type === 'exam' && <Zap className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />}
                  {clash.type === 'event' && <Clock className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />}
                  <div>
                    <p className="font-medium text-red-900">{clash.name}</p>
                    <p className="text-red-800">
                      {new Date(clash.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                      ({clash.duration} mins)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-red-700 hover:text-red-900 font-medium"
            >
              {expanded ? 'Hide' : 'Show'} Details
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-sm text-red-700 hover:text-red-900 font-medium"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
