# Advanced Features Implementation Guide

## Overview
This document details the four advanced features implemented in the Campus Event Management System that differentiate it from existing solutions.

---

## 1. Schedule Clash Detection System

### Purpose
Automatically alerts students when an event they're interested in conflicts with their existing classes, exams, or registered events.

### Components
- **ScheduleContext** (`src/context/ScheduleContext.jsx`): Manages schedule state and clash detection logic
- **ScheduleClashAlert** (`src/components/schedule/ScheduleClashAlert.jsx`): Displays clash warnings with details
- **ScheduleViewer** (`src/components/schedule/ScheduleViewer.jsx`): Shows student's complete schedule with filtering
- **scheduleService** (`src/services/scheduleService.js`): API integration for fetching student schedules

### Key Features
- Real-time conflict detection between event time and student classes/exams
- Color-coded warning system (red for conflicts, yellow for near-conflicts)
- Expandable details showing conflicting classes, exams, and time slots
- Integration with student profile data (classes, exams, registered events)

### Data Flow
```
Student Registration → detectScheduleClash()
  ↓
Check Against: Student Classes + Exams + Registered Events
  ↓
Conflict Found → Display ScheduleClashAlert
  ↓
Student Decision: Proceed/Cancel
```

### Laravel API Integration
```
GET /students/{studentId}/classes
GET /students/{studentId}/exams
GET /students/{studentId}/registered-events
GET /students/{studentId}/upcoming-schedule?daysAhead=30
POST /schedule/check-conflicts (eventId, studentId)
```

---

## 2. Course-Based Networking & Study Circles

### Purpose
Connects students in the same courses attending the same event, enabling peer learning and networking opportunities.

### Components
- **NetworkingContext** (`src/context/NetworkingContext.jsx`): Manages study circles and connections
- **StudyCircleCard** (`src/components/networking/StudyCircleCard.jsx`): Displays individual study circle with join/leave options
- **CourseConnections** (`src/components/networking/CourseConnections.jsx`): Shows course-based peer connections
- **networkingService** (`src/services/networkingService.js`): API calls for networking features

### Key Features
- **Study Circles**: Auto-generated groups of students in same course attending same event
- **Course Connections**: Identify peers in your courses attending the event
- **Connection Requests**: Send/accept connection requests to classmates with shared interests
- **Network View**: See your established connections and pending requests

### Data Flow
```
Event Registration → Check User Courses
  ↓
Find: Other Students with Same Courses
  ↓
Create/Display: Study Circle Cards + Connection Suggestions
  ↓
Student: Join Circle or Send Connection Request
  ↓
Update: Network Graph
```

### Study Circle Features
- Auto-populated with students in same course
- Show member count and list (expandable)
- Join/Leave functionality
- Event-specific grouping (new circle per event)

### Laravel API Integration
```
GET /events/{eventId}/study-circle?courseName=CS101
GET /users/{userId}/study-circles
POST /study-circles (eventId, courseName, description)
POST /study-circles/{circleId}/join (userId)
POST /study-circles/{circleId}/leave (userId)
GET /users/{userId}/course-connections
POST /connections/request (fromUserId, toUserId, courseName)
POST /connections/request/{requestId}/accept
GET /users/{userId}/pending-connections
GET /users/{userId}/network
```

---

## 3. Anonymous Question & Interaction System

### Purpose
Allows students to ask questions and provide feedback anonymously during events, encouraging participation from shy or uncertain students.

### Components
- **QAContext** (`src/context/QAContext.jsx`): Manages questions, voting, and feedback
- **QuestionSubmission** (`src/components/qa/QuestionSubmission.jsx`): Form for submitting questions
- **QuestionsFeed** (`src/components/qa/QuestionsFeed.jsx`): Displays all questions with voting and organizer controls
- **qaService** (`src/services/qaService.js`): API integration for Q&A system

### Key Features
- **Anonymous Submission**: Questions can be submitted without identifying the asker
- **Question Categories**: General, Technical, Clarification, Feedback
- **Upvoting System**: Community-driven question prioritization
- **Status Tracking**: Track if questions are answered, resolved, or pending
- **Organizer Tools**: Mark questions as answered, delete inappropriate questions
- **Event Feedback**: Separate feedback system with ratings and comments

### Question Flow
```
During Event:
Student → Submit Question (Anonymous)
  ↓
Question Added to Feed (Sorted by Votes)
  ↓
Other Students: Upvote/Downvote Questions
  ↓
Organizer: Mark as Answered or Delete
  ↓
After Event: Feedback Submission
```

### Character Limits & Validation
- Question: 500 characters max
- Feedback comment: Configurable, typically 250 chars
- Category: Required (dropdown selection)
- Anonymous: Default true, can be disabled by user

### Laravel API Integration
```
POST /events/{eventId}/questions (question, category)
GET /events/{eventId}/questions?sortBy=votes
POST /questions/{questionId}/upvote
POST /questions/{questionId}/unvote
POST /questions/{questionId}/answered
DELETE /questions/{questionId}
POST /events/{eventId}/feedback (rating, comment, categories)
GET /events/{eventId}/feedback-summary
GET /events/{eventId}/feedback (organizer only)
```

---

## 4. Smart Event Recommendation Engine

### Purpose
Provides personalized event suggestions based on student department, interests, academic level, trending popularity, and network activity.

### Components
- **RecommendationContext** (`src/context/RecommendationContext.jsx`): Scoring algorithm and recommendation logic
- **RecommendedEventCard** (`src/components/recommendations/RecommendedEventCard.jsx`): Individual event card with score breakdown
- **RecommendationEngine** (`src/components/recommendations/RecommendationEngine.jsx`): Main recommendation display with filtering
- **recommendationService** (`src/services/recommendationService.js`): API integration

### Recommendation Algorithm

#### Scoring Components (Total: 100 points)

1. **Department Match (30%)**
   - Full points if event targets student's department
   - Zero points if mismatch
   ```javascript
   event.targetDepartments.includes(student.department) ? 30 : 0
   ```

2. **Interest Match (30%)**
   - Points based on tag overlap
   - Each matching tag: +10 points (max 30)
   ```javascript
   matchingTags.length * 10 (capped at 30)
   ```

3. **Student Level Match (20%)**
   - Full points if event targets student's level (1st year, 2nd year, etc.)
   - Zero points if mismatch
   ```javascript
   event.targetLevels.includes(student.level) ? 20 : 0
   ```

4. **Trending Events (10%)**
   - High points for popular events (70%+ registered)
   - Medium points for moderate popularity (40-70%)
   - Zero for low popularity
   ```javascript
   registrationPercentage > 70 ? 10 : registrationPercentage > 40 ? 5 : 0
   ```

5. **Network Connections (10%)**
   - Points if any attendees are in student's network
   - Encourages events where friends are attending
   ```javascript
   event.attendeeIds.some(id => student.connections.includes(id)) ? 10 : 0
   ```

#### Example Score Breakdown
```
Event: "Web Development Workshop"
Student: Computer Science, Year 2, Interested in Web Dev

Department Match:     +30 (CS department event)
Interest Match:       +30 (3 tags match: web, development, programming)
Level Match:          +20 (Year 2 event)
Trending:             +10 (150/200 registered = 75%)
Network:              +10 (2 friends attending)
────────────────────────
TOTAL SCORE:          100% (Highly Recommended)
```

### Recommendation Categories

Dynamically generated based on user profile:
- **Your Interests**: Events matching user's interest tags
- **Department Events**: All events for student's department
- **Trending Now**: Events with 60%+ registration
- **Coming Soon**: Events happening within next 7 days

### Smart Filtering
- Category-based filtering
- Sorting by relevance score
- Hiding already-registered events
- Recommendations update as profile changes

### User Experience
1. Dashboard shows "Recommended For You" section
2. Each event shows:
   - Recommendation score (0-100%)
   - Color-coded quality indicator (green=80+, blue=60+, yellow=40+, gray=<40)
   - Transparent score breakdown
   - "Why recommended" tooltip with scoring details
3. User can like/heart favorite recommendations
4. Can adjust recommendation preferences in settings

### Laravel API Integration
```
GET /users/{userId}/recommendations?limit=10
GET /users/{userId}/recommendations/category/{category}
GET /events/trending?department=CS&limit=10
GET /users/{userId}/events-by-interests
GET /users/{userId}/network-events
POST /users/{userId}/recommendation-preferences (preferences data)
PUT /users/{userId}/recommendation-weights (custom weights)
GET /users/{userId}/recommendations/{eventId}/score (transparency)
GET /events/{eventId}/similar?limit=5
```

---

## Integration Points

### User Profile Requirements
```javascript
{
  id: String,
  name: String,
  email: String,
  department: String,
  level: String,           // 1st year, 2nd year, etc.
  interests: Array,        // Tags/interests
  courses: Array,          // Course codes
  connections: Array,      // User IDs of connections
  createdAt: Date,
  preferences: {
    recommendationFilters: Array,
    emailNotifications: Boolean,
    hideScheduleClashes: Boolean
  }
}
```

### Event Data Requirements
```javascript
{
  id: String,
  name: String,
  description: String,
  date: Date,
  startTime: Time,
  endTime: Time,
  duration: Number,        // minutes
  location: String,
  image: String,           // URL
  organizer: String,       // User ID
  capacity: Number,
  registeredCount: Number,
  status: String,          // approved, pending, etc.
  targetDepartments: Array,
  targetLevels: Array,
  tags: Array,
  attendeeIds: Array,      // Registered student IDs
}
```

---

## Performance Considerations

1. **Schedule Clash Detection**: 
   - Cache student schedule in context
   - Only check conflicts when registering for new event
   - Pre-load schedule on dashboard

2. **Networking**:
   - Paginate large connection lists
   - Lazy-load study circle members
   - Cache user's courses

3. **Q&A System**:
   - Load questions on-demand (pagination)
   - Real-time vote counts via context
   - Archive old questions after event

4. **Recommendations**:
   - Calculate scores server-side for complex data
   - Cache recommendations for 1 hour
   - Batch update scoring weights

---

## Future Enhancements

1. **Real-time WebSocket Support**: Live Q&A with instant updates
2. **ML-Based Recommendations**: Advanced clustering algorithms
3. **Calendar Integration**: Sync with Google Calendar/Outlook
4. **Notification System**: Push notifications for clash alerts and recommendations
5. **Study Group Chat**: In-app messaging for study circles
6. **Analytics Dashboard**: For organizers to track engagement

---

## Testing

Each feature includes:
- Unit tests for context functions
- Integration tests for API calls
- Component tests for UI interactions
- End-to-end tests for feature workflows
