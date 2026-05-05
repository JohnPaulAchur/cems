# Quick Start Guide

## For React Frontend Developers

### 1. Get the code running locally

```bash
# Clone or download the project
cd campus-event-management

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:5173 in browser
```

### 2. Configure API connection

Create `.env.local`:
```
VITE_API_URL=http://localhost:8000/api
```

Replace `http://localhost:8000` with your Laravel backend URL.

### 3. Test the app

- Try Login page (use test credentials from Laravel)
- Navigate to Dashboard to see all 4 advanced features:
  - Schedule clash detection in event details
  - Study circles and networking in event modal
  - Q&A questions feed
  - Recommended events on main dashboard

### 4. Key files to understand

- `src/App.jsx` - Main app with all context providers
- `src/context/` - State management for each feature
- `src/components/dashboards/StudentDashboard.jsx` - Main page with all features
- `src/services/` - API integration layer

---

## For Laravel Backend Developers

### 1. Required Endpoints (28 total)

Group by feature:

**Schedule** (6 endpoints)
- GET /api/students/{id}/classes
- GET /api/students/{id}/exams
- GET /api/students/{id}/registered-events
- GET /api/students/{id}/schedule
- GET /api/students/{id}/upcoming-schedule
- POST /api/schedule/check-conflicts

**Networking** (7 endpoints)
- GET /api/events/{id}/study-circle
- GET /api/users/{id}/study-circles
- POST /api/study-circles
- POST /api/study-circles/{id}/join
- POST /api/study-circles/{id}/leave
- GET /api/users/{id}/course-connections
- POST /api/connections/request

Plus more for accepting requests, fetching network.

**Q&A** (7 endpoints)
- POST /api/events/{id}/questions
- GET /api/events/{id}/questions
- POST /api/questions/{id}/upvote
- POST /api/questions/{id}/unvote
- POST /api/questions/{id}/answered
- DELETE /api/questions/{id}
- POST /api/events/{id}/feedback

Plus more for feedback summary.

**Recommendations** (8 endpoints)
- GET /api/users/{id}/recommendations
- GET /api/users/{id}/recommendations/category/{category}
- GET /api/events/trending
- GET /api/users/{id}/events-by-interests
- GET /api/users/{id}/network-events
- POST /api/users/{id}/recommendation-preferences
- PUT /api/users/{id}/recommendation-weights
- GET /api/users/{id}/recommendations/{eventId}/score

### 2. Key database tables needed

```sql
-- Existing tables to use/extend
users (add: department, level, interests as JSON)
events (add: targetDepartments, targetLevels as arrays)
registrations (studentId, eventId, registeredAt)

-- New tables to create
classes (studentId, courseName, startTime, endTime, ...)
exams (studentId, courseCode, startTime, endTime, ...)
study_circles (eventId, courseName, creatorId, ...)
study_circle_members (circleId, userId, joinedAt)
connections (fromUserId, toUserId, courseName, status, ...)
questions (eventId, question, category, userId, isAnonymous, votes, ...)
question_votes (questionId, userId, voteType, createdAt)
feedback (eventId, rating, comment, userId, isAnonymous, ...)
user_preferences (userId, JSON preferences data)
```

### 3. Authentication flow

```php
// Implement JWT authentication in Laravel

// Login endpoint returns:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "department": "CS"
  }
}

// All requests include: 
// Authorization: Bearer {token}

// Validate token in middleware:
// Decode JWT
// Check signature
// Verify not expired
// Allow request if valid
```

### 4. Core business logic - Recommendation scoring

```php
// In RecommendationController or Service

public function calculateScore($event, $user) {
    $score = 0;
    
    // Department match (30%)
    if (in_array($user->department, $event->targetDepartments)) {
        $score += 30;
    }
    
    // Interest match (30%)
    $interestMatches = count(array_intersect(
        $user->interests,
        $event->tags
    ));
    $score += min($interestMatches * 10, 30);
    
    // Level match (20%)
    if (in_array($user->level, $event->targetLevels)) {
        $score += 20;
    }
    
    // Trending (10%)
    $registrationPercentage = 
        ($event->registeredCount / $event->capacity) * 100;
    
    if ($registrationPercentage > 70) {
        $score += 10;
    } elseif ($registrationPercentage > 40) {
        $score += 5;
    }
    
    // Network (10%)
    if ($this->hasAttendingConnections($event, $user)) {
        $score += 10;
    }
    
    return $score;
}
```

### 5. Schedule conflict detection

```php
// In ScheduleController

public function checkConflicts($eventId, $studentId) {
    $event = Event::find($eventId);
    $student = User::find($studentId);
    
    $conflicts = [];
    
    // Check classes
    $conflicts = array_merge($conflicts, 
        $this->findClassConflicts($student, $event)
    );
    
    // Check exams
    $conflicts = array_merge($conflicts,
        $this->findExamConflicts($student, $event)
    );
    
    // Check registered events
    $conflicts = array_merge($conflicts,
        $this->findEventConflicts($student, $event)
    );
    
    return [
        'hasConflict' => count($conflicts) > 0,
        'conflicts' => $conflicts
    ];
}

private function findClassConflicts($student, $event) {
    return $student->classes()
        ->whereBetween('startTime', [
            $event->startTime,
            $event->endTime
        ])
        ->get()
        ->map(fn($class) => [
            'type' => 'class',
            'name' => $class->courseName,
            'startTime' => $class->startTime,
            'duration' => $class->duration
        ])
        ->toArray();
}
```

### 6. Study circle auto-creation

```php
// When user registers for event

public function registerEvent($eventId, $userId) {
    $user = User::find($userId);
    $event = Event::find($eventId);
    
    // Register user
    $registration = Registration::create([
        'eventId' => $eventId,
        'userId' => $userId
    ]);
    
    // Auto-create/update study circles for each course
    foreach ($user->courses as $course) {
        $circle = StudyCircle::firstOrCreate([
            'eventId' => $eventId,
            'courseName' => $course->name
        ]);
        
        // Add user to circle if not already member
        if (!$circle->members()->where('userId', $userId)->exists()) {
            $circle->members()->attach($userId);
            
            // Notify other members
            $this->notifyCircleMembers($circle, $user);
        }
    }
    
    return $registration;
}
```

### 7. Testing endpoints with Postman

```
1. Login: POST /api/auth/login
   Body: { "email": "student@example.com", "password": "password" }
   
2. Save token from response
   
3. Test schedule endpoint:
   GET /api/students/1/classes
   Header: Authorization: Bearer {token}
   
4. Test recommendations:
   GET /api/users/1/recommendations?limit=10
   Header: Authorization: Bearer {token}
   
5. Test Q&A:
   POST /api/events/1/questions
   Body: { "question": "What is this about?", "category": "general" }
   Header: Authorization: Bearer {token}
```

---

## For Designers & UI Customizers

### 1. Color system

Edit `src/styles/globals.css`:

```css
@theme inline {
  --color-primary: #2563eb;      /* Blue */
  --color-secondary: #64748b;    /* Slate */
  --color-success: #10b981;      /* Green */
  --color-warning: #f59e0b;      /* Amber */
  --color-danger: #ef4444;       /* Red */
  --color-background: #ffffff;
  --color-foreground: #1e293b;
  --radius: 0.5rem;              /* 8px */
}
```

### 2. Typography

Currently uses default Tailwind fonts. To customize:

```css
/* In globals.css */
@theme inline {
  --font-sans: 'Your Font', sans-serif;
  --font-mono: 'Courier New', monospace;
}
```

Then import fonts in `src/main.jsx` or layout.

### 3. Component customization

- All components use Tailwind classes
- Most styles are configurable via CSS custom properties
- Components are in `src/components/` organized by feature

Example customization:
```jsx
// Change button style in a component:
// Before:
<button className="bg-blue-600 text-white px-4 py-2 rounded">

// After:
<button className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
```

### 4. Responsive design

All components use Tailwind responsive prefixes:

```jsx
<div className="
  grid grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
">
```

- Mobile-first (mobile styles first, then `md:` for tablet, `lg:` for desktop)
- Breakpoints: sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px

---

## Common Development Tasks

### Add a new feature

1. Create context: `src/context/FeatureContext.jsx`
2. Create services: `src/services/featureService.js`
3. Create components: `src/components/feature/`
4. Import provider in `App.jsx`
5. Use in components with custom hooks

### Fix a bug

1. Identify component using console error
2. Add debug logs: `console.log("[v0]", variable)`
3. Check context state in React DevTools
4. Check API response in Network tab
5. Review error handling in service layer

### Optimize performance

1. Use React.memo for expensive components
2. Implement useCallback for event handlers
3. Split contexts if too many re-renders
4. Paginate large lists
5. Cache API responses

### Test a feature

1. Log in with test account
2. Navigate to relevant dashboard/page
3. Trigger the feature (e.g., register for event)
4. Check for UI updates and API calls
5. Verify error handling with invalid data

---

## Troubleshooting

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Can't connect to API
- Check VITE_API_URL in .env.local
- Verify Laravel backend is running
- Check CORS configuration in Laravel
- Review Network tab for actual error

### Recommendations empty
- Check user has department, interests, level
- Verify events have tags and targetDepartments
- Check recommendation algorithm in context
- Review API response in Network tab

### Schedule clashes not detecting
- Verify student has classes in database
- Check event startTime and duration
- Test time comparison logic
- Review ScheduleContext state

---

## Deployment Checklist

Before going to production:

- [ ] All 28 API endpoints implemented
- [ ] Database migrations run
- [ ] JWT authentication working
- [ ] CORS configured for production URL
- [ ] Environment variables set
- [ ] Error logging enabled
- [ ] Rate limiting configured
- [ ] SSL/HTTPS enabled
- [ ] Load testing completed
- [ ] User acceptance testing done

---

## Next Steps

1. **Backend Development**
   - Implement all 28 endpoints
   - Create database schema
   - Test with Postman

2. **Integration**
   - Update VITE_API_URL
   - Test frontend with real backend
   - Handle real-world edge cases

3. **Customization**
   - Adjust colors/branding
   - Add campus-specific features
   - Configure departments/roles

4. **Testing**
   - Write unit tests
   - Write integration tests
   - Conduct user testing

5. **Deployment**
   - Build for production
   - Deploy frontend and backend
   - Monitor in production

---

## Documentation Links

- **ADVANCED_FEATURES.md** - Deep dive into each feature
- **LARAVEL_API_ENDPOINTS.md** - Complete API reference
- **ARCHITECTURE.md** - System architecture & data flow
- **README.md** - Basic project info
- **IMPLEMENTATION_SUMMARY.md** - Overview of what was built

---

## Support

For questions about:
- **Frontend code**: Review component files and context documentation
- **API integration**: Check LARAVEL_API_ENDPOINTS.md
- **Architecture decisions**: See ARCHITECTURE.md
- **Feature implementation**: See ADVANCED_FEATURES.md

Good luck with your project!
