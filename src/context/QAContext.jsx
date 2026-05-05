import React, { createContext, useContext, useState, useCallback } from 'react';

const QAContext = createContext();

export const QAProvider = ({ children }) => {
  const [eventQuestions, setEventQuestions] = useState({});
  const [eventFeedback, setEventFeedback] = useState({});
  const [userQuestions, setUserQuestions] = useState([]);

  // Submit anonymous question
  const submitQuestion = useCallback((eventId, question, category = 'general') => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      eventId,
      question,
      category,
      timestamp: new Date(),
      votes: 0,
      answers: 0,
      status: 'pending' // pending, answered, resolved
    };

    setEventQuestions(prev => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), newQuestion]
    }));

    setUserQuestions(prev => [...prev, newQuestion]);
    return newQuestion;
  }, []);

  // Get questions for an event
  const getEventQuestions = useCallback((eventId) => {
    return (eventQuestions[eventId] || []).sort((a, b) => b.votes - a.votes);
  }, [eventQuestions]);

  // Vote on a question (upvote/downvote)
  const voteOnQuestion = useCallback((questionId, voteType = 'up') => {
    setEventQuestions(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(eventId => {
        updated[eventId] = updated[eventId].map(q => {
          if (q.id === questionId) {
            return {
              ...q,
              votes: voteType === 'up' ? q.votes + 1 : Math.max(0, q.votes - 1)
            };
          }
          return q;
        });
      });
      return updated;
    });
  }, []);

  // Mark question as answered
  const markQuestionAnswered = useCallback((questionId) => {
    setEventQuestions(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(eventId => {
        updated[eventId] = updated[eventId].map(q => {
          if (q.id === questionId) {
            return { ...q, status: 'answered', answers: q.answers + 1 };
          }
          return q;
        });
      });
      return updated;
    });
  }, []);

  // Submit feedback for event
  const submitFeedback = useCallback((eventId, feedback) => {
    const newFeedback = {
      id: `fb_${Date.now()}`,
      eventId,
      rating: feedback.rating,
      comment: feedback.comment,
      categories: feedback.categories || [],
      timestamp: new Date()
    };

    setEventFeedback(prev => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), newFeedback]
    }));

    return newFeedback;
  }, []);

  // Get feedback for an event
  const getEventFeedback = useCallback((eventId) => {
    const feedbackList = eventFeedback[eventId] || [];
    const avgRating = feedbackList.length > 0 
      ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)
      : 0;

    return {
      feedbackList,
      avgRating,
      totalCount: feedbackList.length
    };
  }, [eventFeedback]);

  const value = {
    eventQuestions,
    eventFeedback,
    userQuestions,
    submitQuestion,
    getEventQuestions,
    voteOnQuestion,
    markQuestionAnswered,
    submitFeedback,
    getEventFeedback
  };

  return (
    <QAContext.Provider value={value}>
      {children}
    </QAContext.Provider>
  );
};

export const useQA = () => {
  const context = useContext(QAContext);
  if (!context) {
    throw new Error('useQA must be used within QAProvider');
  }
  return context;
};
