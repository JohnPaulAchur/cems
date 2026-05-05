# Campus Event Management System - Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React + Vite Frontend                     │
├─────────────────────────────────────────────────────────────┤
│  Pages (Login, Register, Home, Dashboard)                    │
│  ↓                                                            │
│  Components (Dashboards, Forms, Cards, Modals)              │
│  ↓                                                            │
│  Context Providers (Auth, Event, Schedule, etc.)            │
│  ├── AuthContext (User, Token, Role)                        │
│  ├── EventContext (Events, Filtering)                       │
│  ├── ScheduleContext (Clash Detection)                      │
│  ├── NetworkingContext (Study Circles, Connections)         │
│  ├── QAContext (Questions, Votes, Feedback)                 │
│  ├── RecommendationContext (Scoring, Suggestions)           │
│  └── NotificationContext (Toasts)                           │
│  ↓                                                            │
│  Service Layer (API Integration with JWT)                    │
│  ├── api.js (Axios instance with interceptors)             │
│  ├── scheduleService.js                                      │
│  ├── networkingService.js                                    │
│  ├── qaService.js                                            │
│  ├── recommendationService.js                                │
│  ├── eventService.js                                         │
│  └── venueService.js                                         │
│  ↓                                                            │
│  Utilities (Constants, Helpers)                              │
└─────────────────────────────────────────────────────────────┘
            ↓↑ (HTTP/REST)
┌─────────────────────────────────────────────────────────────┐
│            Laravel Backend API                               │
├─────────────────────────────────────────────────────────────┤
│  Routes (API Endpoints)                                      │
│  ↓                                                            │
│  Controllers (Business Logic)                                │
│  ├── ScheduleController                                      │
│  ├── NetworkingController                                    │
│  ├── QAController                                            │
│  ├── RecommendationController                                │
│  ├── EventController                                         │
│  └── AuthController                                          │
│  ↓                                                            │
│  Models & Repositories                                       │
│  ├── User, Event, Question, StudyCircle, etc.               │
│  └── Database Queries & Transactions                         │
│  ↓                                                            │
│  Services (Complex Business Logic)                           │
│  ├── ScheduleClashService                                    │
│  ├── RecommendationEngine                                    │
│  ├── NetworkingService                                       │
│  └── NotificationService                                     │
│  ↓                                                            │
│  Database (PostgreSQL/MySQL)                                 │
│  ├── users, events, classes, exams                           │
│  ├── questions, feedback, votes                              │
│  ├── study_circles, connections                              │
│  └── user_preferences                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Architecture

### 1. User Authentication Flow
```
User Input (Email, Password)
    ↓
LoginPage Component
    ↓
api.post('/auth/login')
    ↓
Laravel Auth Controller
    ↓
Generate JWT Token
    ↓
Response: { token, user, role }
    ↓
AuthContext.setAuth()
    ↓
Store token in localStorage
    ↓
Token added to all future requests (interceptor)
    ↓
Protected Routes Enabled
```

### 2. Event Registration with Schedule Clash Detection
```
User Views Event
    ↓
Click "Register"
    ↓
ScheduleContext.detectScheduleClash()
    ↓
Fetch User Schedule:
  - scheduleService.getStudentClasses(userId)
  - scheduleService.getStudentExams(userId)
  - scheduleService.getStudentRegisteredEvents(userId)
    ↓
Compare Time Slots
    ↓
Has Conflict? 
  ├─ YES: Display ScheduleClashAlert
  │   User can:
  │   - View full schedule
  │   - Dismiss and proceed
  │   - Cancel registration
  └─ NO: Proceed with registration
    ↓
Submit Registration
    ↓
eventService.registerEvent(eventId, userId)
    ↓
Laravel: Insert into registrations table
    ↓
Success Response
    ↓
Update UI, Show Confirmation
```

### 3. Smart Recommendation Generation
```
User Views Dashboard
    ↓
RecommendationEngine Component Mounts
    ↓
recommendationService.getRecommendations(userId)
    ↓
Laravel Recommendation Engine:
  1. Fetch user profile (department, interests, level, connections)
  2. Fetch all events
  3. For each event, calculate score:
     - Department match: 30 points
     - Interest match: 10 points per matching tag (max 30)
     - Level match: 20 points
     - Trending: 5-10 points
     - Network: 10 points if connections attending
  4. Sort by score, return top 10
    ↓
Response: [
  {
    id, name, date, location,
    recommendationScore: 85,
    scoreBreakdown: { department: 30, interests: 30, ... }
  }
]
    ↓
RecommendationContext.getRecommendedEvents()
    ↓
Display RecommendedEventCard Components
    ↓
Each card shows:
  - Event details
  - Score percentage
  - Color-coded quality (green=80+, blue=60+, yellow=40+)
  - "Why recommended" breakdown
  - Register/Details buttons
```

### 4. Networking & Study Circle Creation
```
User Registers for Event
    ↓
Event Details Page Opens
    ↓
Display: "Course-Based Network" Section
    ↓
networkingService.getCourseConnections(userId)
    ↓
Laravel returns students with shared courses
    ↓
networkingService.getStudyCircleMembers(eventId, courseName)
    ↓
Display: StudyCircleCard with members
    ↓
User Action: Join Study Circle
    ↓
networkingService.joinStudyCircle(circleId, userId)
    ↓
Laravel: 
  - Check if circle exists
  - If not, create study_circles record
  - Insert into study_circle_members
  - Send notifications to existing members
    ↓
Update UI
    ↓
User now appears in circle members list
```

### 5. Q&A System - Question Submission
```
Event In Progress
    ↓
User clicks "Ask a Question" tab
    ↓
QuestionSubmission Component Displays Form
    ↓
User fills form:
  - Question text
  - Category (general, technical, clarification, feedback)
  - Toggle: Anonymous yes/no
    ↓
Click "Submit Question"
    ↓
QAContext.submitQuestion()
    ↓
qaService.submitQuestion(eventId, question, category, userId?, isAnonymous)
    ↓
Laravel Question Controller:
  - Validate input
  - Create questions table record
  - Store userId if identified, null if anonymous
  - Send notifications to organizers
    ↓
Response: { questionId, votes: 0, status: pending }
    ↓
QAContext updates eventQuestions
    ↓
Question appears in QuestionsFeed (top with 0 votes)
    ↓
Organizer can:
  - Mark as answered
  - Delete inappropriate questions
  ↓
Other students:
  - Upvote important questions
  - See status changes
```

---

## State Management Architecture

### Context Hierarchy
```
App.jsx
├── AuthProvider
│   ├── Current user object
│   ├── JWT token
│   ├── User role (student, staff, admin, external)
│   ├── Authentication state (loading, error)
│   └── Methods: login, logout, register
│
├── NotificationProvider
│   ├── Active notifications array
│   └── Methods: notify (success, error, warning, info)
│
├── EventProvider
│   ├── All events list
│   ├── User's registered events
│   ├── Event filters
│   └── Methods: getEvents, filterEvents, registerEvent
│
├── ScheduleProvider
│   ├── Student schedule (classes, exams)
│   ├── Clash detection results
│   └── Methods: detectScheduleClash, loadStudentSchedule
│
├── NetworkingProvider
│   ├── Study circles
│   ├── User's study circles
│   ├── Course connections
│   ├── Connection requests
│   └── Methods: createCircle, joinCircle, sendRequest
│
├── QAProvider
│   ├── Event questions map
│   ├── Event feedback map
│   ├── User votes map
│   └── Methods: submitQuestion, voteQuestion, submitFeedback
│
└── RecommendationProvider
    ├── Recommended events list
    ├── Score breakdowns
    ├── Scoring algorithm
    └── Methods: getRecommendedEvents, calculateScore
```

### Context Interaction Example
```
Student Registers for Event:

1. AuthContext: Provides current user ID
2. EventContext: Registers event in list
3. ScheduleContext: Detects clashes
4. NetworkingContext: Finds study circle peers
5. QAContext: Initializes questions feed for event
6. RecommendationContext: Updates recommendation scores
   (this event likely shouldn't appear in recommendations now)
7. NotificationContext: Shows success toast
```

---

## API Integration Pattern

### Standard API Call Flow
```javascript
// In a component:
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await scheduleService.getStudentClasses(userId)
      setData(response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  fetchData()
}, [userId])

// Service layer (scheduleService.js)
export const scheduleService = {
  getStudentClasses: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/classes`)
      return response.data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }
}

// Axios instance (api.js) with JWT interceptor
const api = axios.create({ baseURL: VITE_API_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
    }
    return Promise.reject(error)
  }
)
```

---

## Component Architecture

### Smart vs Presentational Components

**Smart Components** (Container Components)
- Connect to contexts
- Manage state and side effects
- Handle API calls
- Control business logic
- Examples: StudentDashboard, RecommendationEngine, EventDetailModal

**Presentational Components** (UI Components)
- Receive data via props
- Render UI based on props
- Trigger callbacks for user actions
- Reusable and testable
- Examples: StudyCircleCard, RecommendedEventCard, ScheduleClashAlert

### Component Communication
```
Parent Component (Smart)
├─ Context.Provider
│  ├─ Provides state + methods
│  └─ All children can access
├─ Child Component 1 (Smart)
│  ├─ Reads context
│  ├─ Calls context methods
│  └─ Passes data to children
├─ Child Component 2 (Presentational)
│  ├─ Receives props from parent
│  ├─ Renders UI
│  └─ Calls parent callback on user action
└─ Child Component 3 (Presentational)
   ├─ Receives props
   ├─ Displays data
   └─ Triggers parent callback
```

---

## Error Handling Strategy

### API Errors
```javascript
try {
  const data = await scheduleService.getSchedule(userId)
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized: Logout user
    AuthContext.logout()
  } else if (error.response?.status === 403) {
    // Forbidden: Show permission error
    NotificationContext.notify('error', 'You don\'t have access to this')
  } else if (error.response?.status === 404) {
    // Not found: Handle gracefully
    setData(null)
  } else if (error.response?.status >= 500) {
    // Server error: Show generic message
    NotificationContext.notify('error', 'Server error, please try again')
  } else {
    // Network error
    NotificationContext.notify('error', 'Network error')
  }
}
```

### Form Validation
```javascript
// Frontend validation before submission
const validateQuestion = (question) => {
  if (!question.trim()) {
    return 'Question cannot be empty'
  }
  if (question.length > 500) {
    return 'Question must be 500 characters or less'
  }
  if (!category) {
    return 'Please select a category'
  }
  return null // Valid
}

// Server-side validation (Laravel)
// Always validate on backend:
// - String length
// - Required fields
// - Data type checking
// - Authorization checks
```

---

## Performance Considerations

### Rendering Optimization
- Use React.memo for expensive components
- Implement shouldComponentUpdate logic
- Avoid inline functions in render
- Use useCallback for event handlers

### State Management Efficiency
- Keep context state flat and focused
- Split contexts by domain (Schedule, Networking, etc.)
- Avoid updating entire context state for single field changes
- Use selective context consumption (Provider pattern)

### API Call Optimization
- Cache schedule data for 5 minutes
- Batch related API calls (Promise.all)
- Implement pagination for large lists
- Use debouncing for search inputs

### Bundle Size Optimization
- Tree-shaking unused code
- Code splitting at route level
- Lazy load heavy components
- Minify and compress for production

---

## Security Architecture

### Authentication & Authorization
```
JWT Token Flow:
1. User logs in
2. Server generates JWT (header.payload.signature)
3. JWT stored in localStorage
4. Each request includes: Authorization: Bearer {token}
5. Server validates token signature
6. Decode to get user ID and role
7. Check role for resource access

Security Headers:
- CORS configured for frontend domain
- Content-Security-Policy for XSS protection
- X-Frame-Options to prevent clickjacking
- HttpOnly, Secure, SameSite on JWT cookies
```

### XSS Prevention
- All user input sanitized
- No dangerously setting innerHTML
- Use React's built-in escaping
- Content Security Policy headers

### CSRF Prevention
- SameSite cookie attributes
- CSRF token for state-changing requests
- Validate origin headers

### Data Protection
- JWT tokens expire (recommended 1 hour)
- Refresh token rotation
- Secure password hashing (bcrypt)
- Never log sensitive data

---

## Deployment Architecture

### Development
```
pnpm dev → Vite dev server @ localhost:5173
       ↓
Hot Module Reloading
       ↓
Real-time feedback during development
```

### Production Build
```
pnpm build → Creates dist/ folder
          ↓
       - Minified JavaScript
       - Optimized assets
       - Source maps (optional)
          ↓
pnpm preview → Test build locally
```

### Deployment Options
1. **Vercel** (Recommended for Next.js, also works for Vite)
   - Automatic builds on push
   - Global CDN
   - Built-in analytics

2. **Netlify**
   - Similar to Vercel
   - Good for Vite projects
   - Serverless functions support

3. **Self-hosted**
   - Traditional Node.js hosting
   - Docker containers
   - Requires manual deployment

4. **Static Hosting**
   - S3 + CloudFront (AWS)
   - Firebase Hosting
   - Requires separate API domain

---

## Monitoring & Debugging

### Development Tools
- React DevTools (browser extension)
- Redux DevTools for context inspection
- Network tab for API monitoring
- Console logging for debugging

### Production Monitoring
- Error tracking: Sentry
- Analytics: Google Analytics, PostHog
- Performance: Web Vitals
- Logs: ELK Stack or cloud provider

### Common Debugging Workflows
```
Issue: Recommendations not showing
→ Check RecommendationContext state
→ Verify API response in Network tab
→ Check user profile has required fields
→ Review recommendation algorithm

Issue: Schedule clash not detecting
→ Verify ScheduleContext state
→ Check student schedule API response
→ Test time comparison logic
→ Check event duration is correct

Issue: Q&A questions disappearing
→ Check QAContext eventQuestions state
→ Verify API submission response
→ Check event ID is correct in request
→ Review localStorage for errors
```

---

## Scaling Considerations

### For 1,000 Students
- Current architecture suitable
- Cache recommendations (1 hour)
- Paginate question feeds (20 per page)

### For 10,000 Students
- Implement server-side pagination everywhere
- Database indexing on userId, eventId
- API rate limiting
- Consider moving scoring to async job queue

### For 100,000+ Students
- Microservices: Separate recommendation service
- Message queues: Async processing (Kafka, RabbitMQ)
- Cache layer: Redis for frequently accessed data
- Database sharding: Partition by department/school
- CDN: Global asset distribution
- Load balancing: Distribute API across servers

---

## Summary

The architecture is designed to be:
- **Modular**: Clear separation of concerns
- **Scalable**: Can grow from hundreds to thousands of users
- **Secure**: JWT authentication, input validation, XSS protection
- **Maintainable**: Well-organized code, clear data flow
- **Performant**: Optimized context usage, API caching, lazy loading

The context-based state management keeps code simple while the service layer abstracts API complexity. Components remain focused on UI, with contexts handling business logic and state.
