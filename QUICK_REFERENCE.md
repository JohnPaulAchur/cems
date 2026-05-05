# Campus Event Management System - Quick Reference Card

## Start Development NOW (2 Commands)

### Terminal 1: Frontend
```bash
cd /vercel/share/v0-project
pnpm dev
```
→ Runs on `http://localhost:5173`

### Terminal 2: Backend
```bash
cd /vercel/share/v0-project/laravel-backend
php artisan serve
```
→ Runs on `http://localhost:8000`

**Note:** Database must be set up first (see below)

---

## First-Time Setup (5 Steps)

### Step 1: Backend Database Setup
```bash
# Create .env file
cp laravel-backend/.env.example laravel-backend/.env

# Generate key
php artisan key:generate

# Create database in MySQL
mysql -u root -p
CREATE DATABASE campus_events;
EXIT;

# Run migrations & seeds
php artisan migrate
php artisan db:seed
```

### Step 2: Install Dependencies
```bash
# Frontend
pnpm install

# Backend already has composer.json
cd laravel-backend && composer install
```

### Step 3: Set API URL
Create `src/.env.local` (in root, not laravel-backend):
```env
VITE_API_URL=http://localhost:8000/api
```

### Step 4: Start Both Servers
```bash
# Terminal 1
pnpm dev

# Terminal 2
cd laravel-backend && php artisan serve
```

### Step 5: Login
- Visit `http://localhost:5173`
- Use: `student1@campus.com` / `password123`

---

## Key URLs

| Component | URL | Port |
|-----------|-----|------|
| Frontend | http://localhost:5173 | 5173 |
| Backend API | http://localhost:8000/api | 8000 |
| Laravel Artisan Tinker | php artisan tinker | - |
| MySQL Database | localhost:3306 | 3306 |

---

## Project Structure Quick Map

```
Frontend Files (src/)
├── App.jsx - Main app with routing
├── main.jsx - Entry point
├── components/ - All UI components
├── context/ - 7 state providers
├── services/ - 4 API service layers
└── styles/ - Tailwind CSS

Backend Files (laravel-backend/)
├── app/Models/ - 11 database models
├── app/Services/ - Business logic
├── app/Http/Controllers/ - API endpoints
├── database/migrations/ - 15 tables
├── database/seeders/ - Sample data
├── routes/api.php - Route definitions
└── .env - Configuration
```

---

## Test Credentials

```
Role: Admin
Email: admin@campus.com
Password: password123

Role: Staff
Email: staff1@campus.com
Password: password123

Role: Student
Email: student1@campus.com
Password: password123

Role: Student (20 more)
Email: student2@campus.com through student20@campus.com
Password: password123
```

---

## Common Commands

### Frontend
```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm preview          # Preview build
```

### Backend
```bash
php artisan serve                 # Start API server
php artisan migrate              # Run migrations
php artisan db:seed              # Load sample data
php artisan migrate:fresh --seed # Reset database
php artisan tinker               # Interactive shell
php artisan routes:list          # Show all routes
```

---

## API Endpoints Cheat Sheet

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login
POST   /api/auth/logout         - Logout (protected)
GET    /api/auth/me             - Current user (protected)
```

### Events
```
GET    /api/events              - List all events
POST   /api/events              - Create event (protected)
GET    /api/events/{id}         - Event details
POST   /api/events/{id}/register        - Register (protected)
POST   /api/events/{id}/approve         - Approve (staff)
```

### Features
```
GET    /api/student/schedule              - Get schedule (protected)
GET    /api/events/recommended             - Recommendations (protected)
GET    /api/events/{id}/study-circles      - Study circles
POST   /api/events/{id}/questions          - Ask question
GET    /api/events/{id}/questions          - Get questions
POST   /api/questions/{id}/vote            - Vote on question
POST   /api/connections/{userId}           - Connect with student
```

---

## Database Tables (15)

| Core | Schedule | Features | Analytics |
|------|----------|----------|-----------|
| users | student_classes | study_circles | event_attendee_stats |
| events | student_exams | anonymous_questions | recommendation_logs |
| venues | event_approvals | connections | |
| event_registrations | | study_circle_members | |
| | | question_votes | |
| | | student_interests | |

---

## Architecture at a Glance

```
Client (Browser)
    ↓ HTTPS
React App (Vite)
    ├─ Context API (State)
    ├─ Components (40+)
    └─ Services (Axios)
         ↓ REST API
Laravel Backend (8000)
    ├─ Authentication (Sanctum)
    ├─ Controllers (API endpoints)
    ├─ Services (Business logic)
    └─ Models (Eloquent ORM)
         ↓ SQL
MySQL Database
    ├─ 15 Tables
    ├─ Relationships
    └─ Constraints
```

---

## Troubleshooting

### "Port 8000 already in use"
```bash
php artisan serve --port=8001
# Update VITE_API_URL to port 8001
```

### "Can't connect to database"
```bash
# Check MySQL is running
# Verify .env has correct DB_* variables
# Ensure database exists: CREATE DATABASE campus_events;
```

### "CORS error in console"
```bash
# Update laravel-backend/.env:
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### "API requests return 401"
```bash
# Token expired or invalid
# Login again to get new token
# Check that Bearer token is being sent in Authorization header
```

### "Migration errors"
```bash
php artisan migrate:fresh --seed
# This resets database and reloads sample data
```

---

## What's What

### What's the Frontend?
React app you see in browser. Displays events, handles user registration, shows recommendations. Located in `src/`

### What's the Backend?
Laravel API server. Handles all business logic, database queries, authentication. Located in `laravel-backend/`

### What's the Database?
MySQL database stores all data (users, events, classes, exams, Q&A, etc.). 15 tables with relationships.

### What's Each Advanced Feature?
1. **Schedule Clash**: Checks if event conflicts with student's classes/exams
2. **Study Circles**: Groups students from same courses for peer collaboration
3. **Q&A**: Anonymous questions with community voting (no auth required to vote)
4. **Recommendations**: AI algorithm suggests events based on student profile

---

## File Sizes (Approximately)

- Frontend code: ~50 KB
- Backend code: ~100 KB
- Database structure: 15 tables
- Sample data: 100+ records
- Documentation: 1000+ lines
- **Total: 80+ files, 10,000+ lines**

---

## Deployment Checklist

- [ ] Update environment variables
- [ ] Run database migrations
- [ ] Build frontend (`pnpm build`)
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy Laravel to PHP hosting
- [ ] Configure CORS URLs
- [ ] Enable HTTPS
- [ ] Set up email notifications
- [ ] Configure backups
- [ ] Load test

---

## Support Resources

| Document | Purpose |
|----------|---------|
| README.md | Start here |
| FULL_IMPLEMENTATION_GUIDE.md | Complete setup walkthrough |
| PROJECT_COMPLETION_SUMMARY.md | What was built |
| ARCHITECTURE.md | System design details |
| ADVANCED_FEATURES.md | Feature algorithms |
| LARAVEL_API_ENDPOINTS.md | Complete API documentation |
| laravel-backend/SETUP.md | Backend specific setup |
| QUICK_START.md | Quick development start |

---

## One-Minute Summary

- **Frontend**: React 19 app with 40+ components, 4 advanced features
- **Backend**: Laravel 11 REST API with 40+ endpoints
- **Database**: 15 MySQL tables with sample data
- **Features**: Schedule clash detection, networking, Q&A, recommendations
- **Ready**: Fully functional, can run now, ready to deploy
- **Time to start**: 2 commands in 2 terminal windows

---

## Next Action

```bash
# Get started:
cd /vercel/share/v0-project
pnpm dev

# In another terminal:
cd laravel-backend
php artisan serve

# Then visit http://localhost:5173
```

**That's it! You're ready to explore the system.**

For questions, refer to documentation files or check the code - it's well-commented!
