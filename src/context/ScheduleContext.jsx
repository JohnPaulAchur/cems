import React, { createContext, useContext, useState, useCallback } from 'react';

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [studentSchedule, setStudentSchedule] = useState(null);
  const [clashDetected, setClashDetected] = useState(false);
  const [clashDetails, setClashDetails] = useState([]);

  // Detect schedule conflicts between student's classes/exams and event time
  const detectScheduleClash = useCallback((eventTime, eventDuration, studentClasses, studentExams) => {
    const clashes = [];

    // Check for class conflicts
    studentClasses?.forEach(cls => {
      if (hasTimeConflict(eventTime, eventDuration, cls.startTime, cls.duration)) {
        clashes.push({
          type: 'class',
          name: cls.courseName,
          time: cls.startTime,
          duration: cls.duration,
          instructor: cls.instructor
        });
      }
    });

    // Check for exam conflicts
    studentExams?.forEach(exam => {
      if (hasTimeConflict(eventTime, eventDuration, exam.startTime, exam.duration)) {
        clashes.push({
          type: 'exam',
          name: exam.courseCode,
          time: exam.startTime,
          duration: exam.duration,
          location: exam.location
        });
      }
    });

    setClashDetected(clashes.length > 0);
    setClashDetails(clashes);
    return clashes;
  }, []);

  // Helper function to check if two time slots overlap
  const hasTimeConflict = (eventStart, eventDuration, classStart, classDuration) => {
    const eventEnd = new Date(new Date(eventStart).getTime() + eventDuration * 60000);
    const classEnd = new Date(new Date(classStart).getTime() + classDuration * 60000);

    return new Date(eventStart) < classEnd && eventEnd > new Date(classStart);
  };

  // Load student's schedule from API
  const loadStudentSchedule = useCallback((schedule) => {
    setStudentSchedule(schedule);
  }, []);

  // Clear clash detection
  const clearClashDetection = useCallback(() => {
    setClashDetected(false);
    setClashDetails([]);
  }, []);

  const value = {
    studentSchedule,
    clashDetected,
    clashDetails,
    detectScheduleClash,
    loadStudentSchedule,
    clearClashDetection
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within ScheduleProvider');
  }
  return context;
};
