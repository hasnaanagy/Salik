# 10. Development

## 10.1 Development Workflow

Salik follows a structured development workflow designed to maintain code quality and collaboration efficiency.

### 10.1.1 Git Workflow

The project uses a feature branch workflow:

1. **Main Branch**: The `main` branch contains production-ready code
2. **Development Branch**: The `dev` branch contains code for the next release
3. **Feature Branches**: Created from `dev` for specific features
4. **Release Branches**: Created when preparing a new release
5. **Hotfix Branches**: Created from `main` for urgent production fixes

```bash
# Creating a feature branch
git checkout dev
git pull origin dev
git checkout -b feature/new-feature-name

# Making changes and committing
git add .
git commit -m "Feature: Add description of changes"

# Pushing to remote and creating a pull request
git push origin feature/new-feature-name
# Create PR from feature/new-feature-name to dev
```

### 10.1.2 Issue Tracking

All development work should be tied to an issue in the issue tracker:

1. **Bug Reports**: Document unexpected behavior with steps to reproduce
2. **Feature Requests**: Describe new functionality with acceptance criteria
3. **Enhancements**: Suggest improvements to existing features
4. **Technical Debt**: Track code that needs refactoring

Each issue should include:
- Clear title describing the task
- Detailed description
- Acceptance criteria
- Priority and severity labels
- Assigned components and modules

### 10.1.3 Pull Request Process

1. **Create PR**: Open a pull request from your feature branch to `dev`
2. **PR Description**: Include issue references and summary of changes
3. **CI Checks**: Automated tests and linting will run
4. **Code Review**: At least one reviewer must approve changes
5. **Address Feedback**: Make requested changes if needed
6. **Merge**: Once approved and all checks pass, merge the PR

```markdown
# Pull Request Template

## Description
Brief description of the changes

## Issue
Fixes #[issue-number]

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Enhancement
- [ ] Breaking change

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have added tests where applicable
- [ ] Documentation has been updated
```

### 10.1.4 Release Process

1. **Create Release Branch**: Branch off from `dev` as `release/vX.Y.Z`
2. **Version Bump**: Update version numbers in package.json files
3. **Release Candidate Testing**: Deploy to staging environment for testing
4. **Bug Fixes**: Fix any issues directly in the release branch
5. **Final Review**: Conduct final code and documentation review
6. **Merge to Main**: Merge release branch to `main` with a version tag
7. **Update Dev**: Merge changes back to `dev` branch

```bash
# Creating a release
git checkout dev
git checkout -b release/v1.2.0

# Version bumping and fixes
# Make necessary changes

# Merging to main
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Version 1.2.0"
git push origin main --tags

# Update dev branch
git checkout dev
git merge --no-ff release/v1.2.0
git push origin dev
```

## 10.2 Coding Standards

Consistent coding standards are enforced across all Salik repositories to ensure maintainability and readability.

### 10.2.1 JavaScript/TypeScript Guidelines

#### Code Formatting

The project uses ESLint and Prettier for code formatting:

```javascript
// .eslintrc.js example
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  plugins: ['react', 'react-hooks'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'warn',
    'react/prop-types': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
```

#### Naming Conventions

- **Files**: Use kebab-case for filenames (e.g., `user-profile.jsx`)
- **Components**: Use PascalCase for React components (e.g., `UserProfile`)
- **Functions**: Use camelCase for functions (e.g., `getUserData()`)
- **Variables**: Use camelCase for variables (e.g., `userData`)
- **Constants**: Use UPPER_SNAKE_CASE for constants (e.g., `MAX_USERS`)
- **CSS Classes**: Use kebab-case for CSS classes (e.g., `user-avatar`)

#### Code Structure

- Limit files to 300-400 lines max; split larger files
- Group related functionality into modules
- Keep functions small and focused (< 50 lines)
- Use meaningful variable and function names
- Add JSDoc comments for non-trivial functions

```javascript
/**
 * Calculates the distance between two geographic coordinates
 * using the Haversine formula.
 * 
 * @param {Object} point1 - The first coordinate
 * @param {number} point1.latitude - Latitude of first point
 * @param {number} point1.longitude - Longitude of first point
 * @param {Object} point2 - The second coordinate
 * @param {number} point2.latitude - Latitude of second point
 * @param {number} point2.longitude - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateDistance(point1, point2) {
  // Implementation details...
}
```

### 10.2.2 React Component Standards

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Separate business logic from presentation
- Use PropTypes or TypeScript for type checking
- Follow container/presentation component pattern

```jsx
// Good component example
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useData } from '../hooks/useData';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

function UserProfile({ userId }) {
  const { data: user, loading, error } = useData(`/api/users/${userId}`);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {/* More user details */}
    </div>
  );
}

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired
};

export default UserProfile;
```

### 10.2.3 API Design Guidelines

- Use RESTful principles for endpoint design
- Standardize response formats across all endpoints
- Include proper error handling and status codes
- Implement validation for all inputs
- Document all endpoints with JSDoc

```javascript
/**
 * Create a new service request
 * 
 * @route POST /api/request
 * @param {Object} req.body - Request body
 * @param {string} req.body.serviceType - Type of service requested
 * @param {Object} req.body.location - Location coordinates
 * @param {string} req.body.description - Request description
 * @param {string} req.body.urgency - Request urgency level
 * @returns {Object} The created request object
 * @throws {400} If validation fails
 * @throws {401} If user is not authenticated
 * @throws {500} If server error occurs
 */
exports.createRequest = async (req, res) => {
  try {
    // Implementation details...
  } catch (error) {
    // Error handling...
  }
};
```

### 10.2.4 Database Standards

- Use schema validation for MongoDB models
- Implement proper indexing for performance
- Use soft deletes instead of hard deletes
- Include created/updated timestamps on all documents
- Document all schemas with comments

```javascript
// MongoDB schema example
const mongoose = require('mongoose');

/**
 * Service request schema
 */
const requestSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['fuel', 'mechanical'],
    required: true
  },
  location: {
    address: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere' // Geospatial index
    }
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notifiedProviders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  acceptedProviders: [{
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    estimatedTime: Number,
    price: Number,
    note: String,
    acceptedAt: Date
  }],
  confirmedProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Add indexes
requestSchema.index({ serviceType: 1 });
requestSchema.index({ status: 1 });
requestSchema.index({ customer: 1 });

module.exports = mongoose.model('Request', requestSchema);
```

## 10.3 Testing

Salik employs a comprehensive testing strategy to ensure reliability and quality.

### 10.3.1 Testing Strategy

The testing approach includes:

1. **Unit Testing**: Testing individual components and functions
2. **Integration Testing**: Testing interactions between components
3. **API Testing**: Validating API endpoints and responses
4. **End-to-End Testing**: Testing complete user flows
5. **Mobile Testing**: Platform-specific mobile testing

### 10.3.2 Unit Testing

Unit tests focus on testing individual functions and components in isolation:

```javascript
// Example Jest unit test for a utility function
import { calculateDistance } from '../utils/distance-utils';

describe('calculateDistance', () => {
  test('calculates distance between two points correctly', () => {
    const point1 = { latitude: 34.0522, longitude: -118.2437 };
    const point2 = { latitude: 40.7128, longitude: -74.0060 };
    
    const distance = calculateDistance(point1, point2);
    
    // Distance between LA and NY should be approximately 3935 km
    expect(distance).toBeCloseTo(3935, -2); // Within 100 km
  });
  
  test('returns 0 for identical points', () => {
    const point = { latitude: 34.0522, longitude: -118.2437 };
    
    const distance = calculateDistance(point, point);
    
    expect(distance).toBe(0);
  });
  
  test('handles edge cases', () => {
    // Test null values, equator crossing, etc.
  });
});
```

### 10.3.3 Integration Testing

Integration tests verify that different parts of the application work together:

```javascript
// Example integration test for authentication flow
import axios from 'axios';
import { setupTestDatabase, teardownTestDatabase } from '../test-utils/db';
import { startTestServer } from '../test-utils/server';

describe('Authentication Flow', () => {
  let server;
  let api;
  
  beforeAll(async () => {
    await setupTestDatabase();
    server = await startTestServer();
    api = axios.create({
      baseURL: `http://localhost:${server.port}/api`
    });
  });
  
  afterAll(async () => {
    await teardownTestDatabase();
    await server.stop();
  });
  
  test('user can register, login, and access protected routes', async () => {
    // Register a new user
    const registerResponse = await api.post('/auth/signup', {
      fullName: 'Test User',
      phone: '1234567890',
      password: 'Password123',
      nationalId: 'TEST12345'
    });
    
    expect(registerResponse.status).toBe(201);
    
    // Login with the new user
    const loginResponse = await api.post('/auth/login', {
      phone: '1234567890',
      password: 'Password123'
    });
    
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.data).toHaveProperty('token');
    
    const { token } = loginResponse.data;
    
    // Access a protected route
    const profileResponse = await api.get('/auth', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.data.user).toHaveProperty('fullName', 'Test User');
  });
});
```

### 10.3.4 API Testing

API tests validate the behavior of backend endpoints:

```javascript
// Example API test using supertest
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.TEST_MONGO_URI);
  });
  
  afterAll(async () => {
    // Clean up database
    await User.deleteMany({});
    await mongoose.connection.close();
  });
  
  describe('POST /api/auth/signup', () => {
    test('creates a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          fullName: 'API Test User',
          phone: '9876543210',
          password: 'SecurePass123',
          nationalId: 'API12345'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully!');
      
      // Verify user was created in database
      const user = await User.findOne({ phone: '9876543210' });
      expect(user).not.toBeNull();
      expect(user.fullName).toBe('API Test User');
    });
    
    test('returns error with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          fullName: 'Incomplete User'
          // Missing other required fields
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required fields');
    });
  });
});
```

### 10.3.5 End-to-End Testing

E2E tests validate complete user flows using tools like Cypress:

```javascript
// Example Cypress E2E test for ride booking flow
describe('Ride Booking Flow', () => {
  beforeEach(() => {
    // Set up test data and login
    cy.fixture('testUser').then((user) => {
      cy.login(user.phone, user.password);
    });
    
    cy.visit('/');
  });
  
  it('allows user to search for and book a ride', () => {
    // Search for rides
    cy.get('[data-test="ride-search-form"]').within(() => {
      cy.get('[data-test="start-location"]').type('Test Start Location');
      cy.get('[data-test="end-location"]').type('Test End Location');
      cy.get('[data-test="date-picker"]').click();
      cy.get('.date-picker-available').first().click();
      cy.get('[data-test="search-button"]').click();
    });
    
    // Select first available ride
    cy.get('[data-test="ride-result"]').first().click();
    
    // View ride details
    cy.get('[data-test="ride-details"]').should('be.visible');
    cy.get('[data-test="provider-name"]').should('not.be.empty');
    
    // Book the ride
    cy.get('[data-test="book-button"]').click();
    
    // Confirm booking
    cy.get('[data-test="confirm-booking"]').click();
    
    // Verify booking success
    cy.get('[data-test="booking-success"]').should('be.visible');
    
    // Check activity screen for booking
    cy.visit('/activity');
    cy.get('[data-test="upcoming-rides"]').should('contain', 'Test End Location');
  });
});
```

### 10.3.6 Test Coverage

The project aims for high test coverage with specific targets:

- **Unit Tests**: 80%+ coverage of utility functions and hooks
- **Component Tests**: 70%+ coverage of UI components
- **API Tests**: 90%+ coverage of all API endpoints
- **E2E Tests**: Coverage of all critical user flows

## 10.4 Debugging

Effective debugging techniques are essential for resolving issues in the Salik platform.

### 10.4.1 Backend Debugging

For Node.js backend:

```javascript
// Using debug module for better debugging
const debug = require('debug')('salik:auth');

exports.login = async (req, res) => {
  debug('Login attempt for user: %s', req.body.phone);
  try {
    const user = await User.findOne({ phone: req.body.phone });
    debug('User found: %o', user ? { id: user._id, type: user.type } : 'No user found');
    
    // Rest of the login logic
    
  } catch (error) {
    debug('Login error: %o', error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};
```

To run with debugging:
```bash
DEBUG=salik:* node server.js
```

For more advanced debugging, use Node.js inspector:
```bash
node --inspect server.js
```

### 10.4.2 Frontend Debugging

For React applications:

1. **React DevTools**: Use browser extension for component inspection
2. **Redux DevTools**: Monitor state changes and actions
3. **Console Logging**: Use structured console messages

```javascript
// Debugging React components
function UserProfileDebug({ userId }) {
  const { data, loading, error } = useUserData(userId);
  
  console.group('UserProfile Render');
  console.log('Props:', { userId });
  console.log('State:', { data, loading, error });
  console.groupEnd();
  
  // Component logic...
}
```

### 10.4.3 Mobile Debugging

For React Native applications:

1. **Expo DevTools**: For Expo-based apps
2. **React Native Debugger**: Standalone debugger application
3. **Flipper**: Facebook's mobile app debugger

```javascript
// Using Expo's logging system
import * as Logs from 'expo-logs';

function LocationDebugger() {
  const { location, error } = useLocation();
  
  useEffect(() => {
    if (location) {
      Logs.log('Location updated', {
        coords: location.coords,
        timestamp: location.timestamp
      });
    }
    if (error) {
      Logs.error('Location error', { message: error.message });
    }
  }, [location, error]);
  
  // Component logic...
}
```

### 10.4.4 Error Tracking

Production error tracking with Sentry:

```javascript
// Setting up Sentry in Express backend
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// ...routes and middleware...

// Error handler should be before any other error middleware
app.use(Sentry.Handlers.errorHandler());
```

## 10.5 Performance Optimization

Strategies for optimizing performance across the Salik platform.

### 10.5.1 Backend Optimization

Key backend optimization strategies:

1. **Database Indexing**: Create proper indexes for frequently queried fields
   ```javascript
   // Example: Adding indexes to ride schema
   rideSchema.index({ departureTime: 1 });
   rideSchema.index({ provider: 1 });
   rideSchema.index({ 
     startLocation: '2dsphere',
     endLocation: '2dsphere'
   });
   ```

2. **Query Optimization**: Use projection and pagination
   ```javascript
   // Only fetch needed fields
   const rides = await Ride.find({ status: 'active' })
     .select('startLocation endLocation departureTime price availableSeats')
     .populate('provider', 'fullName profileImg rating')
     .sort({ departureTime: 1 })
     .limit(10)
     .skip(page * 10);
   ```

3. **Caching**: Implement Redis for frequently accessed data
   ```javascript
   // Example: Caching provider details
   async function getProviderDetails(providerId) {
     // Check cache first
     const cachedData = await redisClient.get(`provider:${providerId}`);
     if (cachedData) {
       return JSON.parse(cachedData);
     }
     
     // Fetch from database if not in cache
     const provider = await User.findById(providerId)
       .select('fullName profileImg rating reviewCount');
     
     // Cache the result (expire after 10 minutes)
     await redisClient.set(
       `provider:${providerId}`, 
       JSON.stringify(provider),
       'EX',
       600
     );
     
     return provider;
   }
   ```

4. **Server-Side Pagination**: Always paginate large result sets
   ```javascript
   // Example pagination middleware
   function paginate(req, res, next) {
     const page = parseInt(req.query.page) || 0;
     const limit = parseInt(req.query.limit) || 10;
     
     req.pagination = {
       skip: page * limit,
       limit: Math.min(limit, 50) // Cap maximum limit
     };
     
     next();
   }
   
   // Usage in route
   router.get('/rides', paginate, rideController.getRides);
   ```

### 10.5.2 Frontend Optimization

Web application optimization techniques:

1. **Code Splitting**: Split bundles for faster loading
   ```javascript
   // React lazy loading
   const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
   
   function App() {
     return (
       <Router>
         <Suspense fallback={<LoadingSpinner />}>
           <Route path="/profile" component={ProfilePage} />
         </Suspense>
       </Router>
     );
   }
   ```

2. **Memoization**: Prevent unnecessary re-renders
   ```javascript
   // Using React.memo for components
   const RideCard = React.memo(function RideCard({ ride, onSelect }) {
     // Component implementation
   });
   
   // Using useMemo and useCallback hooks
   function RideList({ rides }) {
     const sortedRides = useMemo(() => {
       return [...rides].sort((a, b) => 
         new Date(a.departureTime) - new Date(b.departureTime)
       );
     }, [rides]);
     
     const handleSelect = useCallback((rideId) => {
       // Selection logic
     }, []);
     
     return (
       <div>
         {sortedRides.map(ride => (
           <RideCard 
             key={ride.id} 
             ride={ride} 
             onSelect={handleSelect}
           />
         ))}
       </div>
     );
   }
   ```

3. **Virtualization**: Efficiently render large lists
   ```javascript
   // Using react-window for large lists
   import { FixedSizeList } from 'react-window';
   
   function RideList({ rides }) {
     const Row = ({ index, style }) => (
       <div style={style}>
         <RideCard ride={rides[index]} />
       </div>
     );
     
     return (
       <FixedSizeList
         height={500}
         width="100%"
         itemCount={rides.length}
         itemSize={150}
       >
         {Row}
       </FixedSizeList>
     );
   }
   ```

4. **Image Optimization**: Optimize and lazy load images
   ```javascript
   // Using lazy loading for images
   function ProfileImage({ src, alt }) {
     return (
       <img 
         src={src} 
         alt={alt} 
         loading="lazy" 
         width="200" 
         height="200"
       />
     );
   }
   ```

### 10.5.3 Mobile Optimization

React Native performance optimizations:

1. **Memoization**: Use memoization to prevent re-renders
   ```javascript
   // Using React.memo and useCallback
   const ServiceCard = React.memo(({ service, onPress }) => {
     return (
       <TouchableOpacity onPress={() => onPress(service.id)}>
         {/* Card content */}
       </TouchableOpacity>
     );
   });
   
   function ServiceList({ services }) {
     const handlePress = useCallback((id) => {
       // Handle press
     }, []);
     
     return (
       <FlatList
         data={services}
         renderItem={({ item }) => (
           <ServiceCard service={item} onPress={handlePress} />
         )}
         keyExtractor={item => item.id}
       />
     );
   }
   ```

2. **FlatList Optimization**: Tune FlatList performance
   ```javascript
   <FlatList
     data={largeDataset}
     renderItem={renderItem}
     keyExtractor={item => item.id}
     initialNumToRender={10}
     maxToRenderPerBatch={10}
     windowSize={5}
     removeClippedSubviews={true}
     getItemLayout={(data, index) => ({
       length: 100,
       offset: 100 * index,
       index,
     })}
   />
   ```

3. **Image Optimization**: Use FastImage for better image loading
   ```javascript
   import FastImage from 'react-native-fast-image';
   
   function OptimizedImage({ uri }) {
     return (
       <FastImage
         style={{ width: 200, height: 200 }}
         source={{ uri }}
         resizeMode={FastImage.resizeMode.cover}
         priority={FastImage.priority.normal}
       />
     );
   }
   ```

4. **Hermes Engine**: Enable Hermes JavaScript engine
   ```javascript
   // In app.json for Expo
   {
     "expo": {
       "jsEngine": "hermes"
     }
   }
   ```

### 10.5.4 Performance Monitoring

Implement performance monitoring:

1. **Server Monitoring**: Use tools like New Relic or Datadog
   ```javascript
   // Example with New Relic
   require('newrelic');
   const express = require('express');
   const app = express();
   
   // Rest of server setup
   ```

2. **Client-Side Monitoring**: Track performance metrics
   ```javascript
   // Example with web-vitals
   import { getCLS, getFID, getLCP } from 'web-vitals';
   
   function sendToAnalytics({ name, delta, id }) {
     const payload = { name, delta, id };
     navigator.sendBeacon('/analytics', JSON.stringify(payload));
   }
   
   getCLS(sendToAnalytics);
   getFID(sendToAnalytics);
   getLCP(sendToAnalytics);
   ```