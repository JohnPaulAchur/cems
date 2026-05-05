import React, { useEffect, useState } from 'react';
import { Sparkles, ChevronRight, Loader } from 'lucide-react';
import { useRecommendation } from '../../context/RecommendationContext';
import { useAuth } from '../../context/AuthContext';
import recommendationService from '../../services/recommendationService';
import RecommendedEventCard from './RecommendedEventCard';

export default function RecommendationEngine({ allEvents, onRegisterEvent }) {
  const { user } = useAuth();
  const { getRecommendedEvents, getPersonalizedCategories } = useRecommendation();
  const [recommendations, setRecommendations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [user?.id, allEvents]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      
      // Get personalized categories
      const personalizedCategories = getPersonalizedCategories(user);
      setCategories(personalizedCategories);

      // Get recommendations
      const recommended = getRecommendedEvents(allEvents, user, 12);
      setRecommendations(recommended);
      
      if (personalizedCategories.length > 0) {
        setSelectedCategory(personalizedCategories[0].name);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRecommendations = () => {
    if (!selectedCategory) return recommendations;
    
    const category = categories.find(c => c.name === selectedCategory);
    if (!category) return recommendations;
    
    return recommendations.filter(event => category.filter(event));
  };

  const filteredEvents = getFilteredRecommendations();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="h-6 w-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          Recommended For You
        </h2>
        <p className="text-gray-600">
          Events tailored based on your department, interests, and network
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Browse by category</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({recommendations.length})
            </button>
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map(event => (
            <RecommendedEventCard
              key={event.id}
              event={event}
              onRegister={onRegisterEvent}
              onShowDetails={(eventId) => {
                // Handle showing event details
                console.log('Show details for event:', eventId);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No events match your current filters</p>
        </div>
      )}
    </div>
  );
}
