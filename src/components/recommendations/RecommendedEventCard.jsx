import React, { useState } from 'react';
import { Star, BarChart3, Heart, Users, Calendar, MapPin } from 'lucide-react';
import { useRecommendation } from '../../context/RecommendationContext';

export default function RecommendedEventCard({ event, onRegister, onShowDetails }) {
  const { scoreBreakdown } = useRecommendation();
  const [liked, setLiked] = useState(false);
  const score = event.recommendationScore || 0;

  const breakdown = scoreBreakdown[event.id] || {};

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
      {event.image && (
        <div className="relative h-40 bg-gray-200 overflow-hidden">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className={`rounded-full p-2 ${
                liked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
              } transition-colors`}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            </button>
            <div className={`rounded-full p-2 border-2 font-semibold flex items-center justify-center ${getScoreColor(score)}`}>
              <span className="text-sm">{score}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{event.name}</h3>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {event.date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.registeredCount !== undefined && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>{event.registeredCount} interested</span>
            </div>
          )}
        </div>

        {Object.keys(breakdown).length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-700">
              <BarChart3 className="h-3 w-3" />
              Why recommended
            </div>
            <div className="space-y-1 text-xs">
              {breakdown.department > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Department match</span>
                  <span className="font-medium">{breakdown.department}%</span>
                </div>
              )}
              {breakdown.interests > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Interest match</span>
                  <span className="font-medium">{breakdown.interests}%</span>
                </div>
              )}
              {breakdown.level > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Level match</span>
                  <span className="font-medium">{breakdown.level}%</span>
                </div>
              )}
              {breakdown.trending > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Trending</span>
                  <span className="font-medium">{breakdown.trending}%</span>
                </div>
              )}
              {breakdown.connections > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Network connections</span>
                  <span className="font-medium">{breakdown.connections}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onShowDetails(event.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Details
          </button>
          <button
            onClick={() => onRegister(event.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
