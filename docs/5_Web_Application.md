# 5. Web Application

## 5.1 Component Structure

The Salik web application follows a modular component structure based on React best practices, with a clear separation of concerns to ensure maintainability and scalability.

### 5.1.1 Core Component Architecture

The application adopts a hierarchical component structure:

- **Container Components**: Handle state management, data fetching, and business logic
- **Presentational Components**: Focus on UI rendering with minimal logic
- **Layout Components**: Manage the overall page structure and common elements
- **Shared Components**: Reusable UI elements used across multiple pages

### 5.1.2 Component Directory Organization

```
src/
├── components/
│   ├── HomeComponents/          # Components for the home page
│   ├── RideSearchHome/          # Ride search components
│   ├── Searchresult/            # Search results display components
│   ├── ServicesComponent/       # Service-related components
│   ├── ServicesProviderComponents/ # Provider-specific components
│   ├── Mapcomponent/           # Map integration components
│   ├── ReviewsComponents/      # Review system components
│   └── Sharedcomponent/        # Common reusable components
├── layout/                     # Application layout components
│   ├── Header.jsx              # Main navigation header
│   ├── Footer.jsx              # Page footer
│   ├── Sidebar.jsx             # Sidebar navigation
│   └── MainLayout.jsx          # Page wrapper layout
└── pages/                      # Page components
    ├── Home.jsx                # Home page
    ├── RideSearch.jsx          # Ride search page
    ├── Services.jsx            # Services page
    ├── ServiceDetails.jsx      # Service details page
    ├── Profile.jsx             # User profile page
    ├── Activity.jsx            # User activity tracking page
    └── Reviews.jsx             # Reviews management page
```

### 5.1.3 Key Component Responsibilities

- **User Authentication Components**: Handle login, registration, and profile management
- **Ride Booking Components**: Manage ride search, selection, and booking
- **Service Request Components**: Handle service search, selection, and requesting
- **Profile Components**: Display and manage user profile information
- **Review Components**: Allow users to view and submit reviews
- **Activity Components**: Track user's ride and service history
- **Map Components**: Display locations and routes using mapping services

## 5.2 State Management

Salik's web application uses Redux Toolkit for centralized state management, providing a predictable and maintainable approach to handling application data.

### 5.2.1 Redux Architecture

The Redux implementation follows a feature-based structure:

```
src/redux/
├── store.js                   # Redux store configuration
├── hooks.js                   # Custom Redux hooks
├── slices/                    # Feature-based slices
│   ├── authSlice.js           # Authentication state management
│   ├── rideSlice.js           # Ride-related state
│   ├── serviceSlice.js        # Service-related state
│   ├── bookingSlice.js        # Booking state management
│   ├── requestSlice.js        # Service request state
│   ├── reviewSlice.js         # Review state management
│   └── uiSlice.js             # UI state (modals, alerts, etc.)
└── middleware/                # Custom Redux middleware
    └── apiMiddleware.js       # API request handling middleware
```

### 5.2.2 Sample Slice Implementation

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/apiClient';

// Async thunk for fetching rides
export const fetchRides = createAsyncThunk(
  'rides/fetchRides',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/rides', { params: searchParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Ride slice with reducers
const rideSlice = createSlice({
  name: 'rides',
  initialState: {
    rides: [],
    selectedRide: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectRide: (state, action) => {
      state.selectedRide = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRides.fulfilled, (state, action) => {
        state.loading = false;
        state.rides = action.payload;
      })
      .addCase(fetchRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectRide } = rideSlice.actions;
export default rideSlice.reducer;
```

### 5.2.3 State Management Principles

- **Single Source of Truth**: All application state is stored in the Redux store
- **Immutable Updates**: State updates follow immutability patterns using Redux Toolkit
- **Action-Based Updates**: All state changes are triggered by dispatching actions
- **Selectors for Data Access**: Components access state through selector functions
- **Local Component State**: UI-specific state remains in component state when appropriate

### 5.2.4 State Persistence

The application uses Redux Persist to maintain critical user data across sessions:

- Authentication tokens
- User preferences
- Recent searches
- Incomplete form data

## 5.3 Routing

Salik's web application uses React Router for declarative routing, organizing the application into a logical hierarchy of pages.

### 5.3.1 Route Structure

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/rides" element={<RideSearch />} />
          <Route path="/rides/:id" element={<RideDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/requests" element={<Requests />} />
        </Route>
        
        {/* Provider-specific routes */}
        <Route element={<ProviderRoute />}>
          <Route path="/provider/rides" element={<ProviderRides />} />
          <Route path="/provider/services" element={<ProviderServices />} />
        </Route>
        
        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 5.3.2 Route Guards

The application implements route guards to protect routes based on authentication status and user roles:

```javascript
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute() {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export function ProviderRoute() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const isProvider = user?.type === 'provider';
  
  return isAuthenticated && isProvider ? 
    <Outlet /> : 
    <Navigate to="/login" />;
}
```

### 5.3.3 Navigation Patterns

The application implements a mix of navigation patterns:

- **Top Navigation Bar**: Primary navigation links
- **Breadcrumb Navigation**: For hierarchical navigation
- **Tab Navigation**: For related content within a page
- **Card-based Navigation**: For content exploration

### 5.3.4 Route Parameters and Query Strings

Routes leverage parameters and query strings for data filtering and selection:

```javascript
// Route parameter example
<Route path="/rides/:rideId" element={<RideDetails />} />

// Using parameters in component
function RideDetails() {
  const { rideId } = useParams();
  // Fetch ride data using ID
}

// Query string example - /services?type=fuel&location=123,456
function Services() {
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get('type');
  const location = searchParams.get('location');
  // Use parameters to filter services
}
```

## 5.4 UI Components

Salik's web application uses a combination of Material UI and custom components to create a consistent and responsive user interface.

### 5.4.1 Design System

The application follows a consistent design system with:

- **Typography**: Standardized font families, sizes, and weights
- **Color Palette**: Primary, secondary, and accent colors with light/dark variants
- **Spacing**: Consistent spacing units for margins and padding
- **Elevation**: Shadow levels for depth and hierarchy
- **Breakpoints**: Standard screen sizes for responsive design

### 5.4.2 Core UI Components

Key reusable UI components include:

- **Navigation**: App Bar, Drawer, Tabs, Breadcrumbs
- **Data Display**: Cards, Lists, Tables, Badges
- **Inputs**: Text Fields, Select Dropdowns, Date Pickers, Checkboxes
- **Feedback**: Alerts, Snackbars, Progress Indicators, Dialogs
- **Layout**: Grids, Containers, Dividers

### 5.4.3 Custom UI Components

The application extends the base Material UI with custom components:

```javascript
// Example of a custom ride card component
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledRideCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[2],
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[5],
  }
}));

export function RideCard({ ride, onSelect }) {
  return (
    <StyledRideCard>
      <CardMedia
        component="img"
        sx={{ width: 150 }}
        image={ride.providerImage || '/default-car.jpg'}
        alt="Ride provider"
      />
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography variant="h6">{ride.providerName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {ride.startLocation} → {ride.endLocation}
        </Typography>
        <Typography variant="body2">
          {new Date(ride.departureTime).toLocaleString()}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="h6" color="primary">
            ${ride.price}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {ride.availableSeats} seats available
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => onSelect(ride)}
          sx={{ mt: 2 }}
        >
          Book Now
        </Button>
      </CardContent>
    </StyledRideCard>
  );
}
```

### 5.4.4 Responsive Design

The application implements responsive design using:

- **Container Queries**: For component-level responsiveness
- **Media Queries**: For layout-level responsiveness
- **Flexbox and Grid**: For flexible layouts
- **Responsive Typography**: Font sizes that adapt to screen size
- **Conditional Rendering**: Different components for mobile and desktop

## 5.5 Form Handling & Validation

The Salik web application uses React Hook Form for efficient form management, combined with Yup for schema validation.

### 5.5.1 Form Architecture

```javascript
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';

// Validation schema
const rideSearchSchema = yup.object().shape({
  startLocation: yup.string().required('Start location is required'),
  endLocation: yup.string().required('End location is required'),
  date: yup.date().required('Date is required')
    .min(new Date(), 'Date must be in the future'),
  passengers: yup.number().required('Number of passengers is required')
    .positive('Must be at least 1 passenger')
    .integer('Must be a whole number')
    .max(10, 'Maximum 10 passengers allowed'),
});

export function RideSearchForm({ onSubmit }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(rideSearchSchema),
    defaultValues: {
      startLocation: '',
      endLocation: '',
      date: new Date(),
      passengers: 1,
    }
  });
  
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        Find a Ride
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="startLocation"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Start Location"
                fullWidth
                error={!!errors.startLocation}
                helperText={errors.startLocation?.message}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="endLocation"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="End Location"
                fullWidth
                error={!!errors.endLocation}
                helperText={errors.endLocation?.message}
              />
            )}
          />
        </Grid>
        
        {/* Other form fields */}
        
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Search Rides
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
```

### 5.5.2 Form Validation Strategies

The application employs multiple validation strategies:

- **Schema Validation**: Using Yup for declarative validation rules
- **Client-Side Validation**: Real-time validation as users type
- **Submit Validation**: Complete validation on form submission
- **Server-Side Validation**: Backend validation for security

### 5.5.3 Field-Level Validation

Common validation patterns include:

- **Required Fields**: Ensuring essential information is provided
- **Format Validation**: Checking proper formatting (emails, phone numbers)
- **Range Validation**: Ensuring numeric values are within acceptable ranges
- **Date Validation**: Verifying dates are valid and within allowed ranges
- **Cross-Field Validation**: Comparing values between different fields

### 5.5.4 Form State Management

The form state is managed using:

- **Form Values**: Current input values
- **Validation Errors**: Current validation state
- **Dirty Fields**: Tracking which fields have been modified
- **Form Submission State**: Loading, success, or error states

### 5.5.5 Complex Form Handling

For multi-step forms, the application uses:

- **Form Wizard**: Breaking complex forms into manageable steps
- **State Persistence**: Saving progress between steps
- **Conditional Fields**: Showing/hiding fields based on previous inputs
- **Dynamic Field Arrays**: Adding/removing sets of related fields 