# VMAS Frontend - Vehicle Management Authentication System

## Overview
Modern React frontend application for VMAS with JWT authentication and role-based access control.

## Features

### Authentication
- **Login**: User authentication with JWT tokens
- **Register**: New user registration with role selection
- **Logout**: Secure session termination

### User Roles
- **ADMIN**: Full system access, user management
- **CONTROLLER**: Controller-specific features
- **DRIVER**: Driver-specific features

### Pages
- **Login Page**: Sign in to the system
- **Register Page**: Create new account
- **Dashboard**: Role-specific overview and statistics
- **Users Page**: Admin-only user management (CRUD operations)

## Technology Stack
- React 18.2
- React Router DOM 6.20
- Axios 1.6.2
- Vite 5.0.8

## Project Structure
```
ems-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with user info
│   │   └── PrivateRoute.jsx    # Protected route wrapper
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication state management
│   ├── pages/
│   │   ├── LoginPage.jsx       # Login form
│   │   ├── RegisterPage.jsx    # Registration form
│   │   ├── DashboardPage.jsx   # Dashboard with stats
│   │   └── UsersPage.jsx       # User management (Admin only)
│   ├── services/
│   │   └── api.js              # API client with axios
│   ├── App.jsx                 # Main app component with routing
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## API Endpoints Used

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (requires auth)

### User Management (Protected)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Backend running on http://localhost:8080

### Install Dependencies
```bash
cd ems-frontend
npm install
```

### Run Development Server
```bash
npm run dev
```
The app will be available at http://localhost:3000

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Configuration

### Backend API URL
Edit `src/services/api.js` to change the backend URL:
```javascript
const API_BASE_URL = 'http://localhost:8080/api'
```

### Proxy Configuration
The Vite proxy is configured in `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true
  }
}
```

## Usage

### 1. Register a New Account
- Navigate to http://localhost:3000/register
- Fill in username, email, password
- Select role (DRIVER, CONTROLLER, or ADMIN)
- Optionally add profile picture URL
- Submit to create account

### 2. Login
- Navigate to http://localhost:3000/login
- Enter username and password
- Click "Sign In"

### 3. Dashboard
- After login, view role-specific dashboard
- ADMIN sees user statistics
- CONTROLLER and DRIVER see their respective dashboards

### 4. User Management (Admin Only)
- Navigate to "Users" in the navbar
- View all system users
- Create new users with "Create New User" button
- Edit user details with "Edit" button
- Delete users with "Delete" button

## Default Test Users

Based on the Postman collection:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Controller:**
- Username: `controller1`
- Password: `controller123`

**Driver:**
- Username: `driver1`
- Password: `driver123`

## Security Features

### JWT Token Management
- Tokens stored in localStorage
- Auto-attached to all authenticated requests
- Auto-redirect to login on 401/403 responses

### Role-Based Access Control (RBAC)
- Private routes protected with authentication check
- Admin-only pages blocked for non-admin users
- API calls include JWT bearer token

### Protected Routes
All routes except `/login` and `/register` require authentication:
- `/dashboard` - Accessible to all authenticated users
- `/users` - Accessible only to ADMIN role

## Styling
- Custom CSS with gradient backgrounds
- Responsive design for mobile and desktop
- Role-based color coding
- Modern card-based UI
- Modal dialogs for forms

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend has CORS enabled for http://localhost:3000

### Token Expiration
If you get 401/403 errors, the token may have expired. Logout and login again.

### API Connection
Ensure the backend is running on http://localhost:8080 before starting the frontend.

## License
Part of the VMAS system - Vehicle Management Authentication System
