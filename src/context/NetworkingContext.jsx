import React, { createContext, useContext, useState, useCallback } from 'react';

const NetworkingContext = createContext();

export const NetworkingProvider = ({ children }) => {
  const [studyCircles, setStudyCircles] = useState([]);
  const [userStudyCircles, setUserStudyCircles] = useState([]);
  const [courseConnections, setCourseConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);

  // Get all students in same course attending the same event
  const getStudyCircleForEvent = useCallback((eventId, studentCourses, attendees) => {
    const courseStudents = attendees.filter(attendee => {
      return studentCourses.some(course => 
        attendee.courses?.includes(course)
      );
    });

    return {
      eventId,
      members: courseStudents,
      totalMembers: courseStudents.length,
      courses: studentCourses
    };
  }, []);

  // Create or join a study circle
  const createStudyCircle = useCallback((eventId, courseName, members = []) => {
    const newCircle = {
      id: `circle_${Date.now()}`,
      eventId,
      courseName,
      members,
      createdAt: new Date(),
      isActive: true
    };
    setStudyCircles(prev => [...prev, newCircle]);
    return newCircle;
  }, []);

  // Add member to study circle
  const addMemberToCircle = useCallback((circleId, member) => {
    setStudyCircles(prev => prev.map(circle => {
      if (circle.id === circleId) {
        return {
          ...circle,
          members: [...circle.members, member]
        };
      }
      return circle;
    }));
  }, []);

  // Remove member from study circle
  const removeMemberFromCircle = useCallback((circleId, memberId) => {
    setStudyCircles(prev => prev.map(circle => {
      if (circle.id === circleId) {
        return {
          ...circle,
          members: circle.members.filter(m => m.id !== memberId)
        };
      }
      return circle;
    }));
  }, []);

  // Load user's study circles
  const loadUserStudyCircles = useCallback((circles) => {
    setUserStudyCircles(circles);
  }, []);

  // Get course-based connections
  const getCourseConnections = useCallback((userCourses, attendees) => {
    const connections = {};
    
    userCourses.forEach(course => {
      connections[course] = attendees.filter(a => 
        a.courses?.includes(course) && a.id !== 'currentUser'
      );
    });

    setCourseConnections(connections);
    return connections;
  }, []);

  // Send connection request
  const sendConnectionRequest = useCallback((userId, targetUserId, courseName) => {
    const request = {
      id: `req_${Date.now()}`,
      fromUser: userId,
      toUser: targetUserId,
      courseName,
      status: 'pending',
      createdAt: new Date()
    };
    setConnectionRequests(prev => [...prev, request]);
    return request;
  }, []);

  // Accept connection request
  const acceptConnectionRequest = useCallback((requestId) => {
    setConnectionRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'accepted' } : req
    ));
  }, []);

  const value = {
    studyCircles,
    userStudyCircles,
    courseConnections,
    connectionRequests,
    getStudyCircleForEvent,
    createStudyCircle,
    addMemberToCircle,
    removeMemberFromCircle,
    loadUserStudyCircles,
    getCourseConnections,
    sendConnectionRequest,
    acceptConnectionRequest
  };

  return (
    <NetworkingContext.Provider value={value}>
      {children}
    </NetworkingContext.Provider>
  );
};

export const useNetworking = () => {
  const context = useContext(NetworkingContext);
  if (!context) {
    throw new Error('useNetworking must be used within NetworkingProvider');
  }
  return context;
};
