# Routing Guide

This project uses React Router DOM with a centralized route configuration and a shared Layout (Sidebar + Header) for all pages.

## File Structure

```
src/
├── routes/
│   └── index.jsx         # Centralized route configuration
├── pages/
│   ├── Dashboard.jsx     # Page components (content only)
│   └── CreateTicket.jsx
├── components/
│   ├── Layout.jsx        # Layout with Sidebar + Header + Outlet
│   └── ProtectedRoute.jsx  # Route protection wrapper
└── hooks/
    └── useAuth.js        # Authentication hook (for future use)
```

## Layout Structure

All routes are wrapped in a **Layout component** that provides:
- **Sidebar** (AppSidebar) - Fixed on the left
- **Header** (SiteHeader) - Fixed at the top
- **Outlet** - Where page content is rendered

This means the Sidebar and Header stay visible on all pages, and only the main content area changes.

## Adding a New Route

### Step 1: Create Your Page Component

Create a new file in `src/pages/`:

```jsx
// src/pages/YourPage.jsx
export default function YourPage() {
  return (
    <div>
      <h1>Your Page Content</h1>
      {/* Only page-specific content here */}
      {/* Sidebar and Header are handled by Layout */}
    </div>
  )
}
```

### Step 2: Add Route to Configuration

Edit `src/routes/index.jsx` and add your route to the `children` array:

```jsx
import YourPage from '../pages/YourPage'

export const routes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      // ... existing routes
      {
        path: 'your-page', // Note: no leading slash for nested routes
        element: <YourPage />,
      },
    ],
  },
]
```

**Important:** For nested routes (inside Layout), don't use a leading slash in the path. The full URL will be `/your-page`.

### Step 3: Public Routes (Without Layout)

If you need a route without Sidebar/Header (like login page), add it outside the Layout:

```jsx
export const routes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      // ... protected routes with Layout
    ],
  },
  // Public route without Layout
  {
    path: '/login',
    element: <Login />, // No Layout, no ProtectedRoute
  },
]
```

## Current Routes

All routes below have Sidebar + Header (via Layout):

- `/` - Dashboard (protected, default route)
- `/dashboard` - Dashboard (protected, same as `/`)
- `/create-ticket` - Create Ticket page (protected)

## Protected Routes

The `ProtectedRoute` wraps the entire Layout, so all routes inside are protected. To enable authentication:

1. **Implement authentication in `src/hooks/useAuth.js`**
   - Add logic to check if user is authenticated
   - Return `isAuthenticated` and `isLoading` states

2. **Uncomment authentication check in `src/components/ProtectedRoute.jsx`**
   - The code is already there, just uncomment it

3. **Add a public login route** (example):
   ```jsx
   {
     path: '/login',
     element: <Login />, // Outside Layout, no ProtectedRoute
   }
   ```

## Navigation

Use React Router's `Link` or `useNavigate` hook:

```jsx
import { Link, useNavigate } from 'react-router-dom'

// Using Link component
<Link to="/dashboard">Go to Dashboard</Link>
<Link to="/create-ticket">Create Ticket</Link>

// Using navigate hook
const navigate = useNavigate()
navigate('/dashboard')
navigate('/create-ticket')
```

## How It Works

1. **Layout Component** (`src/components/Layout.jsx`)
   - Contains SidebarProvider, AppSidebar, SiteHeader
   - Uses `<Outlet />` to render child route components
   - Wraps all protected routes

2. **Page Components** (`src/pages/*.jsx`)
   - Only contain page-specific content
   - No need to include Sidebar/Header (handled by Layout)
   - Rendered inside Layout's Outlet

3. **Route Configuration** (`src/routes/index.jsx`)
   - Parent route: Layout wrapped in ProtectedRoute
   - Child routes: Individual pages
   - All child routes automatically get Sidebar + Header

## Benefits of This Structure

✅ **Consistent Layout** - Sidebar and Header on every page  
✅ **DRY Principle** - Layout defined once, used everywhere  
✅ **Centralized Configuration** - All routes in one file  
✅ **Easy to Maintain** - Add/modify routes without touching multiple files  
✅ **Ready for Authentication** - ProtectedRoute wraps entire Layout  
✅ **Scalable** - Easy to add new routes as your app grows  
