import React, { createContext, useContext, useState, useCallback } from 'react';

const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [scoreBreakdown, setScoreBreakdown] = useState({});

  // Calculate recommendation score for an event
  const calculateRecommendationScore = useCallback((event, userProfile) => {
    let score = 0;
    const breakdown = {};

    // 1. Department match (30%)
    if (event.targetDepartments?.includes(userProfile.department)) {
      breakdown.department = 30;
      score += 30;
    } else {
      breakdown.department = 0;
    }

    // 2. Interest match (30%)
    const interestMatches = event.tags?.filter(tag =>
      userProfile.interests?.includes(tag)
    ) || [];
    breakdown.interests = Math.min(30, interestMatches.length * 10);
    score += breakdown.interests;

    // 3. Student level match (20%)
    if (event.targetLevels?.includes(userProfile.level)) {
      breakdown.level = 20;
      score += 20;
    } else {
      breakdown.level = 0;
    }

    // 4. Trending events (10%)
    const registrationPercentage = (event.registeredCount / event.capacity) * 100;
    if (registrationPercentage > 70) {
      breakdown.trending = 10;
      score += 10;
    } else if (registrationPercentage > 40) {
      breakdown.trending = 5;
      score += 5;
    } else {
      breakdown.trending = 0;
    }

    // 5. Network connections (10%)
    if (event.attendeeIds?.some(id => userProfile.connections?.includes(id))) {
      breakdown.connections = 10;
      score += 10;
    } else {
      breakdown.connections = 0;
    }

    return { score, breakdown };
  }, []);

  // Get recommended events
  const getRecommendedEvents = useCallback((allEvents, userProfile, limit = 10) => {
    const scored = allEvents.map(event => {
      const { score, breakdown } = calculateRecommendationScore(event, userProfile);
      return {
        ...event,
        recommendationScore: score,
        scoreBreakdown: breakdown
      };
    });

    const recommended = scored
      .filter(e => e.recommendationScore > 0)
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);

    setRecommendations(recommended);
    
    // Store score breakdowns for debugging/transparency
    const breakdown = {};
    recommended.forEach(e => {
      breakdown[e.id] = e.scoreBreakdown;
    });
    setScoreBreakdown(breakdown);

    return recommended;
  }, [calculateRecommendationScore]);

  // Get personalized categories
  const getPersonalizedCategories = useCallback((userProfile) => {
    const categories = [];

    // Based on interests
    if (userProfile.interests?.length > 0) {
      categories.push({
        name: 'Your Interests',
        filter: e => e.tags?.some(t => userProfile.interests?.includes(t)),
        icon: 'heart'
      });
    }

    // Based on department
    if (userProfile.department) {
      categories.push({
        name: `${userProfile.department} Events`,
        filter: e => e.targetDepartments?.includes(userProfile.department),
        icon: 'building'
      });
    }

    // Trending events
    categories.push({
      name: 'Trending Now',
      filter: e => (e.registeredCount / e.capacity) > 0.6,
      icon: 'trending-up'
    });

    // Upcoming soon
    categories.push({
      name: 'Coming Soon',
      filter: e => {
        const eventDate = new Date(e.date);
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return eventDate <= nextWeek && eventDate > new Date();
      },
      icon: 'calendar'
    });

    return categories;
  }, []);

  // Save user's recommendation preferences
  const saveRecommendationPreferences = useCallback((userId, preferences) => {
    // This would be synced with Laravel backend
    return {
      userId,
      preferences,
      updated: new Date()
    };
  }, []);

  const value = {
    recommendations,
    scoreBreakdown,
    calculateRecommendationScore,
    getRecommendedEvents,
    getPersonalizedCategories,
    saveRecommendationPreferences
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error('useRecommendation must be used within RecommendationProvider');
  }
  return context;
};
