# Campus Event Management System - Full Stack

A complete, production-ready campus event management system with **React 19 + Vite** frontend and **Laravel 11 + MySQL** backend. Features 4 advanced systems: schedule clash detection, course-based networking, anonymous Q&A, and smart recommendations.

## Tech Stack

**Frontend:**
- React 19 with Vite
- Tailwind CSS v4
- React Router v6
- Axios HTTP client
- Context API for state management

**Backend:**
- Laravel 11
- MySQL Database
- Laravel Sanctum (JWT auth)
- RESTful API architecture

## Project Structure

```
.
├── src/                           # React Frontend
│   ├── components/
│   │   ├── common/               # Navbar, shared UI
│   │   ├── dashboards/           # Student/Staff/Admin dashboards
│   │   ├── events/               # Event components
│   │   ├── schedule/             # Clash detection
│   │   ├── networking/           # Study circles, connections
│   │   ├── qa/                   # Anonymous Q&A
│   │   └── recommendations/      # Smart event recommendations
│   ├── context/                  # State management (7 contexts)
│   ├── services/                 # API integration (4 services)
│   ├── pages/                    # Route pages
│   ├── utils/                    # Helpers and constants
│   └── styles/                   # Tailwind CSS
├── laravel-backend/              # Laravel API
│   ├── app/
│   │   ├── Models/              # 11 Eloquent models
│   │   ├── Http/Controllers/    # API controllers
│   │   └── Services/            # Business logic
│   ├── database/
│   │   ├── migrations/          # 15 database tables
│   │   └── seeders/             # Sample data
│   ├── routes/api.php           # API routes
│   ├── .env                     # Configuration
│   └── SETUP.md                 # Backend instructions
├── FULL_IMPLEMENTATION_GUIDE.md  # Complete setup guide
├── ADVANCED_FEATURES.md          # Feature documentation
└── ARCHITECTURE.md               # System design
```

## Features

### Authentication System
- User registration with role selection
- JWT-based login/logout
- Protected routes with role-based access
- Automatic token refresh and error handling

### Role-Based Dashboards

#### 1. **Student Dashboard**
- Create and submit events
- View personal events with status
- Browse approved campus events
- Filter events by status (approved, pending, rejected)
- View event details

#### 2. **Staff Dashboard**
- Review pending events
- Approve/reject events with feedback
- Create staff events
- Manage venue availability
- View approval history

#### 3. **Admin Dashboard**
- Full event management
- User management
- Venue management
- System analytics and reports
- Admin settings and configuration

#### 4. **External User Dashboard**
- Create and submit events (with payment required)
- Browse public approved events
- Manage venue bookings
- Payment processing
- Event access management

### Event Management
- Create events with detailed information
- Event status workflow (Draft → Pending → Approved/Rejected)
- Venue booking integration
- Additional features selection (speakers, projectors, catering, etc.)
- Event filtering and search

### Notification System
- Real-time toast notifications
- Notification bell with unread count
- Multiple notification types (success, error, info, warning)
- Notification dropdown with recent activities

## Getting Started

### Prerequisites
- Node.js 16+ installed
- pnpm package manager (or npm/yarn)
- Laravel backend running on `http://localhost:8000`

### Installation

1. **Install Dependencies**
```bash
pnpm install
```

2. **Configure Environment**
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local to match your Laravel backend URL
VITE_API_URL=http://localhost:8000/api
```

3. **Start Development Server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

4. **Build for Production**
```bash
pnpm build

# Preview production build
pnpm preview
```

## Environment Variables

Required environment variables (in `.env.local`):

```env
# Laravel API Base URL (required)
VITE_API_URL=http://localhost:8000/api

# Optional: WebSocket Server for real-time updates
VITE_WEBSOCKET_URL=http://localhost:6001

# Optional: Stripe Public Key for payments
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here

# App configuration
VITE_APP_TITLE=Campus Event Management System
VITE_APP_ENV=development
```

## Usage

### Authentication Flow

1. **Register**: Create a new account with your role (Student, Staff, or External User)
2. **Login**: Sign in with email and password
3. **Dashboard**: Access role-specific dashboard
4. **Logout**: Click logout in the navbar

### Creating an Event

1. Click "Create Event" button
2. Fill in event details
3. Select venue
4. Add additional features (optional)
5. Submit for approval

### Managing Events

- **Students/External Users**: View their submitted events, edit drafts, and track status
- **Staff**: Review pending events, provide feedback, and approve/reject
- **Admin**: Access all events, manage approvals, and system-wide features

## API Integration

The frontend communicates with the Laravel backend through Axios with the following interceptors:

### Request Interceptor
- Automatically adds JWT token to all requests
- Sets proper headers

### Response Interceptor
- Handles 401 (Unauthorized) responses by redirecting to login
- Centralized error handling
- Returns data directly from response

### Example API Calls

```javascript
// Events
eventService.getAllEvents()
eventService.createEvent(eventData)
eventService.approveEvent(eventId, feedback)
eventService.rejectEvent(eventId, reason)

// Venues
venueService.getAllVenues()
venueService.checkAvailability(venueId, startDate, endDate)
venueService.bookVenue(venueId, eventId, bookingData)
```

## State Management

### AuthContext
Manages:
- Current user information
- JWT token
- Login/logout/register functions
- User role and permissions

### NotificationContext
Provides:
- Toast notification functions
- success(), error(), warning(), info() methods
- Toast message configuration

### EventContext
Stores:
- Event list
- Selected event
- Filter status
- Event CRUD operations

## Styling

The application uses Tailwind CSS with custom design tokens:

### Color System
- **Primary**: Blue (#2563eb)
- **Secondary**: Indigo (#6366f1)
- **Accent**: Amber (#f59e0b)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)

### Status Colors
- **Draft**: Gray
- **Pending**: Yellow
- **Approved**: Green
- **Rejected**: Red

## Development Guidelines

### Component Organization
- One component per file
- Use functional components with hooks
- Extract reusable components to `components/` folder

### Custom Hooks
Create custom hooks in `hooks/` for shared logic:
- `useAuth()`: Access authentication state
- `useNotification()`: Show notifications
- `useEvent()`: Access event state

### API Calls
Use service layer for all API calls:
- Services located in `services/` folder
- Use Axios instance with interceptors
- Handle errors consistently

### Styling
- Use Tailwind utility classes
- Maintain consistent spacing and sizing
- Follow the color system defined in globals.css

## Features Roadmap

### Phase 1 (Current)
- ✅ Authentication system
- ✅ Role-based dashboards
- ✅ Basic event management UI
- ✅ Navbar and navigation

### Phase 2
- Event creation and submission forms
- Venue selection and booking
- Event approval workflow
- Real-time notifications (WebSocket)

### Phase 3
- Additional features payment integration
- Event analytics and statistics
- User management interface
- Advanced filtering and search

### Phase 4
- Stripe payment integration
- Event calendar view
- Email notifications
- Export functionality

## Common Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link if needed

### Adding a New API Endpoint
1. Create method in appropriate service file
2. Use `api` instance for requests
3. Handle errors in component

### Creating a Protected Route
```jsx
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

### Showing a Notification
```jsx
const { success, error } = useNotification()

success('Action completed successfully!')
error('Something went wrong!')
```

## Troubleshooting

### API Connection Issues
1. Verify Laravel backend is running
2. Check `VITE_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Ensure JWT token is being sent

### Authentication Issues
1. Clear browser localStorage
2. Check token in browser DevTools
3. Verify API endpoint returns correct token format
4. Check user role is set correctly

### Build Issues
1. Clear `node_modules`: `rm -rf node_modules`
2. Reinstall: `pnpm install`
3. Clear Vite cache: `rm -rf .vite`

## Performance Optimization

- Code splitting via React Router
- Lazy loading for dashboard components
- Memoization for context providers
- Optimized re-renders with hooks

## Security Considerations

1. **Token Storage**: JWT tokens stored in localStorage
2. **API Headers**: Authorization header in all requests
3. **Protected Routes**: Only authenticated users can access dashboards
4. **CORS**: Ensure Laravel API has proper CORS headers
5. **Sensitive Data**: Never store passwords or sensitive data in localStorage

## Support & Contact

For issues or questions about the frontend setup, please refer to:
- Vite documentation: https://vitejs.dev
- React documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com

## License

This project is part of the Campus Event Management System and is intended for educational purposes.
#   c e m s  
 