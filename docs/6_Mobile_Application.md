# 6. Mobile Application

## 6.1 Component Structure

The Salik mobile application is built with React Native and Expo, following a modular architecture that promotes code reusability and maintainability.

### 6.1.1 Directory Organization

```
salik-mobile/
├── app/                       # Expo Router screens
│   ├── (tabs)/                # Tab-based navigation screens
│   │   ├── index.js           # Home tab
│   │   ├── profile.js         # Profile tab
│   │   ├── activity.js        # Activity tab
│   │   └── requests.js        # Requests tab
│   ├── login.js               # Login screen
│   ├── signup.js              # Signup screen
│   ├── addTrip.js             # Add trip screen
│   ├── addService.js          # Add service screen
│   └── _layout.js             # Root layout component
├── components/                # Reusable components
│   ├── UserComponents/        # User-related components
│   ├── TripComponents/        # Trip-related components
│   ├── SevicesComponents/     # Service-related components
│   ├── ReviewsComponents/     # Review components
│   ├── RequestComponent/      # Request components
│   ├── MapComponent/          # Map integration components
│   ├── HomeComponets/         # Home screen components
│   └── SharedComponents/      # Common utility components
├── api/                       # API integration
├── redux/                     # State management
├── constants/                 # Application constants
├── styles/                    # Global styles
└── assets/                    # Images, fonts, etc.
```

### 6.1.2 Component Hierarchy

The mobile application follows a hierarchical component structure:

- **Screen Components**: Full-screen UI containers mapped to routes
- **Container Components**: Stateful components that manage data and logic
- **Presentational Components**: UI-focused components with minimal logic
- **Shared Components**: Reusable UI elements used across screens

### 6.1.3 Key Components

#### Authentication Components

```jsx
// components/UserComponents/loginForm.jsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';

/**
 * Login form component for authenticating users
 */
export default function LoginForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [errors, setErrors] = useState({});
  
  const handleLogin = async () => {
    try {
      const result = await dispatch(loginUser(formData));
      // Handle successful login
    } catch (error) {
      // Handle login error
    }
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={formData.phone}
        onChangeText={(text) => setFormData({...formData, phone: text})}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({...formData, password: text})}
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFB800',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
```

#### Ride Components

```jsx
// components/TripComponents/tripCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

/**
 * Trip card component displays a single ride option
 */
export default function TripCard({ trip }) {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TripDetails', { tripId: trip.id })}
    >
      <View style={styles.header}>
        <Image source={{ uri: trip.providerImage }} style={styles.profileImage} />
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{trip.providerName}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFB800" />
            <Text style={styles.rating}>{trip.rating} ({trip.reviews})</Text>
          </View>
        </View>
        <Text style={styles.price}>${trip.price}</Text>
      </View>
      
      <View style={styles.routeContainer}>
        <Text style={styles.location}>{trip.startLocation}</Text>
        <FontAwesome name="arrow-right" size={16} color="#666" />
        <Text style={styles.location}>{trip.endLocation}</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.time}>
          {new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.seats}>{trip.availableSeats} seats available</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Additional styles...
});
```

## 6.2 Navigation Flow

The Salik mobile app uses Expo Router for navigation, which provides a file-system based routing similar to Next.js.

### 6.2.1 Navigation Structure

```
app/
├── (tabs)/             # Tab navigator
│   ├── index.js        # Home screen
│   ├── profile.js      # Profile screen
│   ├── activity.js     # Activity screen
│   └── requests.js     # Requests screen
├── login.js            # Login screen
├── signup.js           # Signup screen
├── splash.js           # Splash screen
├── intro.js            # Onboarding screens
├── addTrip.js          # Create trip screen
├── addService.js       # Create service screen
├── request.js          # Service request screen
├── reviews.js          # Reviews screen
├── license.js          # License upload screen
└── _layout.js          # Root layout with navigation config
```

### 6.2.2 Navigation Implementation

The app uses a combination of tab navigation for main screens and stack navigation for nested flows:

```jsx
// app/_layout.js
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);
  
  useEffect(() => {
    // Keep splash screen visible while checking authentication
    SplashScreen.preventAutoHideAsync();
    
    // Hide splash screen once auth state is determined
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);
  
  return (
    <Stack>
      {/* Common screens available to all users */}
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="intro" options={{ headerShown: false }} />
      
      {/* Authentication screens */}
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="login" options={{ title: 'Login' }} />
          <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
        </>
      ) : null}
      
      {/* Main app screens */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="addTrip" options={{ title: 'Create Trip' }} />
      <Stack.Screen name="addService" options={{ title: 'Add Service' }} />
      <Stack.Screen name="request" options={{ title: 'Request Service' }} />
      <Stack.Screen name="reviews" options={{ title: 'Reviews' }} />
      <Stack.Screen name="license" options={{ title: 'Upload License' }} />
    </Stack>
  );
}
```

### 6.2.3 Tab Navigation

The main application experience uses tab navigation:

```jsx
// app/(tabs)/_layout.js
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function TabsLayout() {
  const { user } = useSelector(state => state.auth);
  const isProvider = user?.type === 'provider';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFB800',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={22} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="clipboard-list" size={22} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="bell" size={22} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### 6.2.4 Deeplinking

The app supports deep linking to directly navigate to specific screens:

```javascript
// app.json
{
  "expo": {
    // Other configurations...
    "scheme": "salik",
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://salik.com"
        }
      ]
    ]
  }
}
```

Examples of supported deep links:
- `salik://login` - Opens the login screen
- `salik://profile` - Opens the profile tab
- `salik://requests` - Opens the requests tab

## 6.3 State Management

The Salik mobile app uses Redux for global state management, following the same architecture as the web application.

### 6.3.1 Redux Configuration

```javascript
// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { combineReducers } from 'redux';

import authReducer from './slices/authSlice';
import rideReducer from './slices/rideSlice';
import serviceReducer from './slices/serviceSlice';
import requestReducer from './slices/requestSlice';
import profileReducer from './slices/profileSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['auth'], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  rides: rideReducer,
  services: serviceReducer,
  requests: requestReducer,
  profile: profileReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register.date', 'auth.user.createdAt'],
      },
    }),
});

export const persistor = persistStore(store);
```

### 6.3.2 Redux Integration

The Redux store is integrated at the app's entry point:

```javascript
// App.js
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { ExpoRoot } from 'expo-router';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ExpoRoot />
      </PersistGate>
    </Provider>
  );
}
```

### 6.3.3 Async Storage Integration

AsyncStorage is used for data persistence:

```javascript
// Example of using AsyncStorage directly for app preferences
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppPreferences = {
  async saveThemePreference(isDarkMode) {
    try {
      await AsyncStorage.setItem('theme_preference', JSON.stringify({ isDarkMode }));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  },
  
  async getThemePreference() {
    try {
      const preference = await AsyncStorage.getItem('theme_preference');
      return preference ? JSON.parse(preference) : { isDarkMode: false };
    } catch (error) {
      console.error('Error getting theme preference:', error);
      return { isDarkMode: false };
    }
  },
  
  async clearAllPreferences() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing preferences:', error);
    }
  }
};
```

## 6.4 Location Services

The Salik mobile app heavily relies on location services for ride sharing and service requests.

### 6.4.1 Location Permissions

The app requests location permissions using Expo's location module:

```javascript
// hooks/useLocation.js
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setIsLoading(false);
          return;
        }
        
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        setLocation(currentLocation);
      } catch (error) {
        setErrorMsg('Error getting location: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  
  return { location, errorMsg, isLoading };
}
```

### 6.4.2 Map Integration

The app uses React Native Maps for map visualization:

```jsx
// components/MapComponent/RideMap.jsx
import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { getRouteCoordinates } from '../../api/mapService';

export default function RideMap({ startLocation, endLocation }) {
  const mapRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  
  useEffect(() => {
    // Fetch route coordinates when locations change
    if (startLocation && endLocation) {
      fetchRoute();
    }
  }, [startLocation, endLocation]);
  
  const fetchRoute = async () => {
    try {
      const coordinates = await getRouteCoordinates(startLocation, endLocation);
      setRouteCoordinates(coordinates);
      
      // Fit map to show the entire route
      if (mapRef.current && coordinates.length > 0) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: startLocation?.latitude || 37.78825,
          longitude: startLocation?.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {startLocation && (
          <Marker
            coordinate={{
              latitude: startLocation.latitude,
              longitude: startLocation.longitude,
            }}
            title="Start"
          />
        )}
        
        {endLocation && (
          <Marker
            coordinate={{
              latitude: endLocation.latitude,
              longitude: endLocation.longitude,
            }}
            title="Destination"
          />
        )}
        
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FFB800"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: 300,
  },
});
```

### 6.4.3 Geocoding

The app uses geocoding to convert between addresses and coordinates:

```javascript
// api/geocodingService.js
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';

export async function geocodeAddress(address) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );
    
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return {
        latitude: lat,
        longitude: lng,
        address: response.data.results[0].formatted_address,
      };
    }
    
    throw new Error('No results found');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

export async function reverseGeocode(latitude, longitude) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );
    
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    }
    
    throw new Error('No results found');
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
}
```

## 6.5 Offline Capabilities

The Salik mobile app implements offline capabilities to ensure a smooth user experience even with intermittent connectivity.

### 6.5.1 Offline Storage

The app uses a combination of Redux Persist and AsyncStorage for offline data:

- **User Profile**: Cached for offline access
- **Active Bookings**: Stored locally for viewing without connectivity
- **Recent Searches**: Maintained for quick access in offline mode
- **Draft Requests**: Saved locally until connectivity is restored

### 6.5.2 Connection Detection

The app monitors network connectivity to adjust functionality:

```javascript
// hooks/useNetworkStatus.js
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    
    return () => unsubscribe();
  }, []);
  
  return { isConnected };
}
```

### 6.5.3 Offline Mode UI

The app shows appropriate UI for offline mode:

```jsx
// components/SharedComponents/OfflineBanner.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export default function OfflineBanner() {
  const { isConnected } = useNetworkStatus();
  
  if (isConnected) {
    return null;
  }
  
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        You are offline. Some features may be limited.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#f8d7da',
    padding: 10,
    alignItems: 'center',
  },
  text: {
    color: '#721c24',
    fontWeight: '500',
  },
});
```

### 6.5.4 Request Queueing

The app queues actions when offline for execution when connectivity is restored:

```javascript
// redux/middleware/offlineQueueMiddleware.js
import NetInfo from '@react-native-community/netinfo';
import { createAction } from '@reduxjs/toolkit';

// Action types
export const QUEUE_ACTION = 'offline/queueAction';
export const ONLINE = 'offline/online';
export const OFFLINE = 'offline/offline';

// Actions
export const queueAction = createAction(QUEUE_ACTION);
export const online = createAction(ONLINE);
export const offline = createAction(OFFLINE);

// Middleware
export const offlineQueueMiddleware = store => next => action => {
  if (action.type === OFFLINE) {
    // We're offline, queue the action
    if (action.meta && action.meta.requiresConnection) {
      return store.dispatch(queueAction(action));
    }
  }
  
  if (action.type === ONLINE) {
    // We're back online, process the queue
    const state = store.getState();
    const actionsToProcess = state.offline.queue;
    
    // Process each queued action
    actionsToProcess.forEach(queued => {
      store.dispatch(queued);
    });
    
    // Clear the queue
    return next(action);
  }
  
  return next(action);
};

// Connection monitor
export function setupNetworkMonitoring(store) {
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      store.dispatch(online());
    } else {
      store.dispatch(offline());
    }
  });
}
``` 