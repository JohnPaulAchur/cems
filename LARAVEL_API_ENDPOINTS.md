# Laravel API Endpoints for Advanced Features

This document outlines all the API endpoints your Laravel backend needs to implement to support the advanced features in the React frontend.

---

## 1. Schedule Service Endpoints

### Get Student Classes
```
GET /api/students/{studentId}/classes
Response:
[
  {
    id: String,
    studentId: String,
    courseName: String,
    courseCode: String,
    startTime: DateTime,
    endTime: DateTime,
    duration: Number,
    instructor: String,
    location: String,
    dayOfWeek: String,
    isActive: Boolean
  }
]
```

### Get Student Exams
```
GET /api/students/{studentId}/exams
Response:
[
  {
    id: String,
    studentId: String,
    courseCode: String,
    courseName: String,
    startTime: DateTime,
    endTime: DateTime,
    duration: Number,
    location: String,
    examType: String (midterm/final/practical)
  }
]
```

### Get Registered Events
```
GET /api/students/{studentId}/registered-events
Response:
[
  {
    id: String,
    eventId: String,
    studentId: String,
    eventName: String,
    startTime: DateTime,
    duration: Number,
    location: String,
    registeredAt: DateTime
  }
]
```

### Get Full Schedule
```
GET /api/students/{studentId}/schedule
Response:
{
  classes: Array,
  exams: Array,
  registeredEvents: Array
}
```

### Get Upcoming Schedule
```
GET /api/students/{studentId}/upcoming-schedule?daysAhead=30
Response:
{
  classes: Array,
  exams: Array,
  registeredEvents: Array,
  nextClass: Object,
  nextExam: Object,
  upcomingCount: Number
}
```

### Check Schedule Conflicts
```
POST /api/schedule/check-conflicts
Request:
{
  eventId: String,
  studentId: String,
  eventStartTime: DateTime,
  eventDuration: Number
}

Response:
{
  hasConflict: Boolean,
  conflicts: [
    {
      type: String (class/exam/event),
      name: String,
      startTime: DateTime,
      duration: Number,
      details: String
    }
  ]
}
```

---

## 2. Networking Service Endpoints

### Get Study Circle Members
```
GET /api/events/{eventId}/study-circle?courseName={courseName}
Response:
{
  eventId: String,
  courseName: String,
  members: [
    {
      id: String,
      name: String,
      email: String,
      profileImage: String,
      department: String
    }
  ],
  totalMembers: Number
}
```

### Get User Study Circles
```
GET /api/users/{userId}/study-circles
Response:
[
  {
    id: String,
    eventId: String,
    courseName: String,
    description: String,
    members: Array,
    createdAt: DateTime,
    isActive: Boolean
  }
]
```

### Create Study Circle
```
POST /api/study-circles
Request:
{
  eventId: String,
  courseName: String,
  description: String
}

Response:
{
  id: String,
  eventId: String,
  creatorId: String,
  courseName: String,
  description: String,
  members: [userId],
  createdAt: DateTime
}
```

### Join Study Circle
```
POST /api/study-circles/{circleId}/join
Request:
{
  userId: String
}

Response:
{
  success: Boolean,
  message: String,
  circleId: String
}
```

### Leave Study Circle
```
POST /api/study-circles/{circleId}/leave
Request:
{
  userId: String
}

Response:
{
  success: Boolean,
  message: String
}
```

### Get Course Connections
```
GET /api/users/{userId}/course-connections
Response:
{
  CS101: [
    {
      id: String,
      name: String,
      email: String,
      department: String,
      mutualCourses: Number
    }
  ],
  CS102: [...]
}
```

### Send Connection Request
```
POST /api/connections/request
Request:
{
  fromUserId: String,
  toUserId: String,
  courseName: String
}

Response:
{
  id: String,
  fromUserId: String,
  toUserId: String,
  courseName: String,
  status: String (pending/accepted/rejected),
  createdAt: DateTime
}
```

### Accept Connection Request
```
POST /api/connections/request/{requestId}/accept
Request: (empty)

Response:
{
  success: Boolean,
  connectionId: String,
  message: String
}
```

### Get Pending Connections
```
GET /api/users/{userId}/pending-connections
Response:
{
  sent: [
    {
      id: String,
      toUserId: String,
      toUserName: String,
      courseName: String,
      createdAt: DateTime,
      status: String
    }
  ],
  received: [
    {
      id: String,
      fromUserId: String,
      fromUserName: String,
      courseName: String,
      createdAt: DateTime
    }
  ]
}
```

### Get User Network
```
GET /api/users/{userId}/network
Response:
{
  totalConnections: Number,
  connections: [
    {
      id: String,
      name: String,
      email: String,
      department: String,
      commonCourses: Array,
      sharedEvents: Number,
      connectedAt: DateTime
    }
  ],
  suggestedConnections: Array
}
```

---

## 3. Q&A Service Endpoints

### Submit Question
```
POST /api/events/{eventId}/questions
Request:
{
  question: String,
  category: String (general/technical/clarification/feedback),
  isAnonymous: Boolean,
  userId: String (if not anonymous)
}

Response:
{
  id: String,
  eventId: String,
  question: String,
  category: String,
  submittedAt: DateTime,
  votes: 0,
  status: String (pending)
}
```

### Get Event Questions
```
GET /api/events/{eventId}/questions?sortBy=votes&limit=50
Response:
[
  {
    id: String,
    question: String,
    category: String,
    submittedAt: DateTime,
    votes: Number,
    answers: Number,
    status: String,
    isAnonymous: Boolean
  }
]
```

### Upvote Question
```
POST /api/questions/{questionId}/upvote
Request: (empty)

Response:
{
  questionId: String,
  votes: Number,
  userVoted: Boolean
}
```

### Remove Vote
```
POST /api/questions/{questionId}/unvote
Request: (empty)

Response:
{
  questionId: String,
  votes: Number
}
```

### Mark Question Answered
```
POST /api/questions/{questionId}/answered
Request: (empty, requires auth as organizer)

Response:
{
  questionId: String,
  status: String (answered),
  answeredAt: DateTime
}
```

### Delete Question
```
DELETE /api/questions/{questionId}
Request: (empty, requires auth as organizer)

Response:
{
  success: Boolean,
  message: String
}
```

### Submit Event Feedback
```
POST /api/events/{eventId}/feedback
Request:
{
  rating: Number (1-5),
  comment: String,
  categories: Array (optional),
  isAnonymous: Boolean
}

Response:
{
  id: String,
  eventId: String,
  rating: Number,
  comment: String,
  submittedAt: DateTime
}
```

### Get Feedback Summary
```
GET /api/events/{eventId}/feedback-summary
Response:
{
  totalResponses: Number,
  averageRating: Number,
  ratingDistribution: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  },
  topComments: Array,
  categoryBreakdown: Object
}
```

### Get All Feedback (Organizer)
```
GET /api/events/{eventId}/feedback
Request: (requires organizer/admin auth)

Response:
[
  {
    id: String,
    rating: Number,
    comment: String,
    category: String,
    submittedAt: DateTime
  }
]
```

---

## 4. Recommendation Service Endpoints

### Get Personalized Recommendations
```
GET /api/users/{userId}/recommendations?limit=10
Response:
[
  {
    id: String,
    name: String,
    recommendationScore: Number,
    scoreBreakdown: {
      department: Number,
      interests: Number,
      level: Number,
      trending: Number,
      connections: Number
    },
    date: DateTime,
    location: String,
    registeredCount: Number,
    capacity: Number
  }
]
```

### Get Recommendations by Category
```
GET /api/users/{userId}/recommendations/category/{category}
Response: (Same as above, filtered by category)
```

### Get Trending Events
```
GET /api/events/trending?department={dept}&limit=10
Response:
[
  {
    id: String,
    name: String,
    registrationPercentage: Number,
    registeredCount: Number,
    capacity: Number,
    trendingScore: Number
  }
]
```

### Get Events by Interests
```
GET /api/users/{userId}/events-by-interests
Response: (Events matching user's interest tags)
```

### Get Network Events
```
GET /api/users/{userId}/network-events
Response:
[
  {
    id: String,
    name: String,
    attendingConnections: Array,
    connectionCount: Number
  }
]
```

### Save Recommendation Preferences
```
POST /api/users/{userId}/recommendation-preferences
Request:
{
  departmentWeight: Number,
  interestWeight: Number,
  levelWeight: Number,
  trendingWeight: Number,
  networkWeight: Number,
  hideRegistered: Boolean,
  categories: Array
}

Response:
{
  success: Boolean,
  preferences: Object
}
```

### Update Recommendation Weights
```
PUT /api/users/{userId}/recommendation-weights
Request:
{
  department: Number,
  interests: Number,
  level: Number,
  trending: Number,
  connections: Number
}

Response:
{
  success: Boolean,
  weights: Object
}
```

### Get Score Breakdown (Transparency)
```
GET /api/users/{userId}/recommendations/{eventId}/score
Response:
{
  eventId: String,
  totalScore: Number,
  breakdown: {
    department: {
      weight: Number,
      score: Number,
      reason: String
    },
    interests: {...},
    level: {...},
    trending: {...},
    connections: {...}
  }
}
```

### Get Similar Events
```
GET /api/events/{eventId}/similar?limit=5
Response:
[
  {
    id: String,
    name: String,
    similarity: Number,
    reason: String
  }
]
```

---

## Authentication & Authorization

All endpoints require:
1. **JWT Token** in Authorization header: `Authorization: Bearer {token}`
2. **User ID** from token claims
3. **Role-based checks** where applicable (organizer, admin, student)

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Accept: application/json
```

### Error Responses
```
401 Unauthorized: {
  message: "Invalid or expired token",
  code: "UNAUTHORIZED"
}

403 Forbidden: {
  message: "Insufficient permissions",
  code: "FORBIDDEN"
}

404 Not Found: {
  message: "Resource not found",
  code: "NOT_FOUND"
}

422 Validation Error: {
  message: "Validation failed",
  errors: {
    field: ["error message"]
  }
}

500 Server Error: {
  message: "Internal server error",
  code: "SERVER_ERROR"
}
```

---

## Database Schema Requirements

### Key Tables Needed

1. **classes**
   - id, student_id, course_code, course_name, start_time, end_time, duration, instructor, location

2. **exams**
   - id, student_id, course_code, course_name, start_time, end_time, duration, location, exam_type

3. **study_circles**
   - id, event_id, course_name, creator_id, description, created_at

4. **study_circle_members**
   - circle_id, user_id, joined_at

5. **connections**
   - id, from_user_id, to_user_id, course_name, status, created_at

6. **questions**
   - id, event_id, question, category, user_id, is_anonymous, votes, status, created_at

7. **question_votes**
   - id, question_id, user_id, vote_type, created_at (prevent duplicate votes)

8. **feedback**
   - id, event_id, rating, comment, user_id, is_anonymous, created_at

9. **user_preferences**
   - user_id, recommendation_weights, hide_schedule_clashes, email_notifications

---

## Rate Limiting

Recommended rate limits:
- Questions: 10 per minute per user
- Votes: 20 per minute per user
- Connections: 5 per minute per user
- Recommendations: 100 per minute per user (heavy computation)

---

## Caching Recommendations

1. **Cache student schedule**: 5 minutes
2. **Cache recommendations**: 1 hour (or on preference change)
3. **Cache network connections**: 30 minutes
4. **Cache study circles**: Real-time updates
5. **Cache question votes**: Real-time (in-memory cache acceptable)

---

## Deployment Checklist

- [ ] All endpoints implemented and tested
- [ ] JWT authentication configured
- [ ] Database migrations created
- [ ] Indexes added for performance (student_id, event_id, user_id)
- [ ] Rate limiting configured
- [ ] Error handling implemented
- [ ] Logging enabled
- [ ] CORS configured for React frontend
- [ ] API documentation created
- [ ] Load testing completed
