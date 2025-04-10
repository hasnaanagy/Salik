# 8. API Documentation

## 8.1 Authentication Endpoints

The Salik API uses JWT (JSON Web Token) for authentication, providing secure access to protected resources.

### 8.1.1 Register User

```
POST /api/auth/signup
```

Creates a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "1234567890",
  "password": "securepassword",
  "nationalId": "ABC123456"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "User registered successfully!"
}
```

### 8.1.2 Login

```
POST /api/auth/login
```

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "phone": "1234567890",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userType": "customer"
}
```

### 8.1.3 Switch Role

```
PUT /api/auth/switch-role
```

Switches a user between customer and provider roles.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": 200,
  "message": "Role switched successfully",
  "newRole": "provider"
}
```

### 8.1.4 Get User Profile

```
GET /api/auth
```

Retrieves the current user's profile.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": 200,
  "message": "User retrieved successfully",
  "user": {
    "_id": "60d5ec9bf682d42a4cfa64a8",
    "fullName": "John Doe",
    "phone": "1234567890",
    "type": "customer",
    "profileImg": "https://example.com/path/to/image.jpg",
    "nationalIdStatus": "verified",
    "licenseStatus": "pending"
  }
}
```

## 8.2 Ride Endpoints

Endpoints for managing ride offerings and bookings.

### 8.2.1 Create Ride

```
POST /api/rides
```

Creates a new ride offering.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "startLocation": {
    "address": "123 Main St, City",
    "coordinates": [73.1234, 33.5678]
  },
  "endLocation": {
    "address": "456 Market St, City",
    "coordinates": [73.5678, 33.1234]
  },
  "departureTime": "2023-07-01T14:30:00Z",
  "availableSeats": 3,
  "price": 25,
  "description": "Comfortable ride with AC"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Ride created successfully",
  "ride": {
    "_id": "60d5ec9bf682d42a4cfa64b9",
    "provider": "60d5ec9bf682d42a4cfa64a8",
    "startLocation": {
      "address": "123 Main St, City",
      "coordinates": [73.1234, 33.5678]
    },
    "endLocation": {
      "address": "456 Market St, City",
      "coordinates": [73.5678, 33.1234]
    },
    "departureTime": "2023-07-01T14:30:00Z",
    "availableSeats": 3,
    "price": 25,
    "description": "Comfortable ride with AC",
    "status": "active",
    "createdAt": "2023-06-25T10:30:00Z"
  }
}
```

### 8.2.2 Get Rides

```
GET /api/rides
```

Retrieves available rides with optional filtering.

**Query Parameters:**
- `startLocation`: Starting location coordinates (lat,lng)
- `endLocation`: Destination coordinates (lat,lng)
- `date`: Departure date
- `seats`: Minimum available seats

**Response:**
```json
{
  "status": 200,
  "rides": [
    {
      "_id": "60d5ec9bf682d42a4cfa64b9",
      "provider": {
        "_id": "60d5ec9bf682d42a4cfa64a8",
        "fullName": "John Doe",
        "profileImg": "https://example.com/path/to/image.jpg",
        "rating": 4.8
      },
      "startLocation": {
        "address": "123 Main St, City",
        "coordinates": [73.1234, 33.5678]
      },
      "endLocation": {
        "address": "456 Market St, City",
        "coordinates": [73.5678, 33.1234]
      },
      "departureTime": "2023-07-01T14:30:00Z",
      "availableSeats": 3,
      "price": 25,
      "description": "Comfortable ride with AC",
      "status": "active",
      "createdAt": "2023-06-25T10:30:00Z"
    }
  ]
}
```

### 8.2.3 Get Ride Details

```
GET /api/rides/{rideId}
```

Retrieves detailed information about a specific ride.

**Response:**
```json
{
  "status": 200,
  "ride": {
    "_id": "60d5ec9bf682d42a4cfa64b9",
    "provider": {
      "_id": "60d5ec9bf682d42a4cfa64a8",
      "fullName": "John Doe",
      "phone": "1234567890",
      "profileImg": "https://example.com/path/to/image.jpg",
      "rating": 4.8,
      "reviewCount": 25
    },
    "startLocation": {
      "address": "123 Main St, City",
      "coordinates": [73.1234, 33.5678]
    },
    "endLocation": {
      "address": "456 Market St, City",
      "coordinates": [73.5678, 33.1234]
    },
    "departureTime": "2023-07-01T14:30:00Z",
    "availableSeats": 3,
    "price": 25,
    "description": "Comfortable ride with AC",
    "status": "active",
    "createdAt": "2023-06-25T10:30:00Z",
    "reviews": [
      {
        "_id": "60d5ec9bf682d42a4cfa64c1",
        "user": {
          "_id": "60d5ec9bf682d42a4cfa64a9",
          "fullName": "Jane Smith",
          "profileImg": "https://example.com/path/to/image2.jpg"
        },
        "rating": 5,
        "comment": "Great ride, very comfortable",
        "createdAt": "2023-06-27T15:30:00Z"
      }
    ]
  }
}
```

### 8.2.4 Update Ride

```
PUT /api/rides/{rideId}
```

Updates an existing ride offering.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "availableSeats": 2,
  "price": 30,
  "description": "Comfortable ride with AC and WiFi"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Ride updated successfully",
  "ride": {
    "_id": "60d5ec9bf682d42a4cfa64b9",
    "availableSeats": 2,
    "price": 30,
    "description": "Comfortable ride with AC and WiFi"
  }
}
```

### 8.2.5 Delete Ride

```
DELETE /api/rides/{rideId}
```

Deletes a ride offering.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": 200,
  "message": "Ride deleted successfully"
}
```

## 8.3 Service Endpoints

Endpoints for managing service offerings.

### 8.3.1 Create Service

```
POST /api/service
```

Creates a new service offering.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "type": "fuel",
  "title": "Fuel Delivery Service",
  "description": "Fast fuel delivery within 30 minutes",
  "price": 10,
  "serviceArea": {
    "coordinates": [73.1234, 33.5678],
    "radius": 10
  },
  "availability": ["morning", "afternoon"]
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Service created successfully",
  "service": {
    "_id": "60d5ec9bf682d42a4cfa64c0",
    "provider": "60d5ec9bf682d42a4cfa64a8",
    "type": "fuel",
    "title": "Fuel Delivery Service",
    "description": "Fast fuel delivery within 30 minutes",
    "price": 10,
    "serviceArea": {
      "coordinates": [73.1234, 33.5678],
      "radius": 10
    },
    "availability": ["morning", "afternoon"],
    "status": "active",
    "createdAt": "2023-06-25T10:45:00Z"
  }
}
```

### 8.3.2 Get Services

```
GET /api/service
```

Retrieves available services with optional filtering.

**Query Parameters:**
- `type`: Service type (fuel or mechanical)
- `location`: Customer location coordinates (lat,lng)
- `maxDistance`: Maximum distance in kilometers

**Response:**
```json
{
  "status": 200,
  "services": [
    {
      "_id": "60d5ec9bf682d42a4cfa64c0",
      "provider": {
        "_id": "60d5ec9bf682d42a4cfa64a8",
        "fullName": "John Doe",
        "profileImg": "https://example.com/path/to/image.jpg",
        "rating": 4.8
      },
      "type": "fuel",
      "title": "Fuel Delivery Service",
      "description": "Fast fuel delivery within 30 minutes",
      "price": 10,
      "distance": 5.2,
      "availability": ["morning", "afternoon"],
      "status": "active",
      "createdAt": "2023-06-25T10:45:00Z"
    }
  ]
}
```

### 8.3.3 Get Service Details

```
GET /api/service/{serviceId}
```

Retrieves detailed information about a specific service.

**Response:**
```json
{
  "status": 200,
  "service": {
    "_id": "60d5ec9bf682d42a4cfa64c0",
    "provider": {
      "_id": "60d5ec9bf682d42a4cfa64a8",
      "fullName": "John Doe",
      "phone": "1234567890",
      "profileImg": "https://example.com/path/to/image.jpg",
      "rating": 4.8,
      "reviewCount": 18
    },
    "type": "fuel",
    "title": "Fuel Delivery Service",
    "description": "Fast fuel delivery within 30 minutes",
    "price": 10,
    "serviceArea": {
      "coordinates": [73.1234, 33.5678],
      "radius": 10
    },
    "availability": ["morning", "afternoon"],
    "status": "active",
    "createdAt": "2023-06-25T10:45:00Z",
    "reviews": [
      {
        "_id": "60d5ec9bf682d42a4cfa64c2",
        "user": {
          "_id": "60d5ec9bf682d42a4cfa64a9",
          "fullName": "Jane Smith",
          "profileImg": "https://example.com/path/to/image2.jpg"
        },
        "rating": 5,
        "comment": "Fast and reliable service",
        "createdAt": "2023-06-28T11:30:00Z"
      }
    ]
  }
}
```

## 8.4 Booking Endpoints

Endpoints for managing ride bookings.

### 8.4.1 Book a Ride

```
POST /api/rideBooking
```

Books a seat on a ride.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "rideId": "60d5ec9bf682d42a4cfa64b9",
  "seats": 2,
  "pickupNote": "I'll be at the main entrance"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Ride booked successfully",
  "booking": {
    "_id": "60d5ec9bf682d42a4cfa64d0",
    "ride": "60d5ec9bf682d42a4cfa64b9",
    "customer": "60d5ec9bf682d42a4cfa64a9",
    "seats": 2,
    "status": "confirmed",
    "pickupNote": "I'll be at the main entrance",
    "createdAt": "2023-06-25T11:15:00Z"
  }
}
```

### 8.4.2 Get User's Bookings

```
GET /api/rideBooking/user
```

Retrieves the current user's ride bookings.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status`: Filter by booking status (upcoming, past, cancelled)

**Response:**
```json
{
  "status": 200,
  "bookings": [
    {
      "_id": "60d5ec9bf682d42a4cfa64d0",
      "ride": {
        "_id": "60d5ec9bf682d42a4cfa64b9",
        "startLocation": {
          "address": "123 Main St, City"
        },
        "endLocation": {
          "address": "456 Market St, City"
        },
        "departureTime": "2023-07-01T14:30:00Z",
        "price": 25
      },
      "provider": {
        "_id": "60d5ec9bf682d42a4cfa64a8",
        "fullName": "John Doe",
        "profileImg": "https://example.com/path/to/image.jpg"
      },
      "seats": 2,
      "status": "confirmed",
      "createdAt": "2023-06-25T11:15:00Z"
    }
  ]
}
```

### 8.4.3 Cancel Booking

```
PUT /api/rideBooking/{bookingId}/cancel
```

Cancels a ride booking.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": 200,
  "message": "Booking cancelled successfully"
}
```

## 8.5 Request Endpoints

Endpoints for managing service requests.

### 8.5.1 Create Service Request

```
POST /api/request
```

Creates a new service request.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "serviceType": "fuel",
  "location": {
    "address": "123 Main St, City",
    "coordinates": [73.1234, 33.5678]
  },
  "description": "Need 10 liters of petrol",
  "urgency": "medium"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Service request created successfully",
  "request": {
    "_id": "60d5ec9bf682d42a4cfa64e0",
    "customer": "60d5ec9bf682d42a4cfa64a9",
    "serviceType": "fuel",
    "location": {
      "address": "123 Main St, City",
      "coordinates": [73.1234, 33.5678]
    },
    "description": "Need 10 liters of petrol",
    "urgency": "medium",
    "status": "pending",
    "notifiedProviders": ["60d5ec9bf682d42a4cfa64a8", "60d5ec9bf682d42a4cfa64a7"],
    "createdAt": "2023-06-25T13:30:00Z"
  }
}
```

### 8.5.2 Get User's Requests

```
GET /api/request/user
```

Retrieves the current user's service requests.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status`: Filter by request status (pending, accepted, confirmed, completed, cancelled)

**Response:**
```json
{
  "status": 200,
  "requests": [
    {
      "_id": "60d5ec9bf682d42a4cfa64e0",
      "serviceType": "fuel",
      "location": {
        "address": "123 Main St, City"
      },
      "description": "Need 10 liters of petrol",
      "status": "pending",
      "createdAt": "2023-06-25T13:30:00Z",
      "acceptedProviders": []
    }
  ]
}
```

### 8.5.3 Accept Service Request

```
PUT /api/request/{requestId}/accept
```

Provider accepts a service request.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "estimatedTime": 30,
  "price": 15,
  "note": "I can deliver in 30 minutes"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Request accepted successfully"
}
```

### 8.5.4 Confirm Provider

```
PUT /api/request/{requestId}/confirm
```

Customer confirms a provider for their service request.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "providerId": "60d5ec9bf682d42a4cfa64a8"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Provider confirmed successfully"
}
```

### 8.5.5 Complete Request

```
PUT /api/request/{requestId}/complete
```

Marks a service request as completed.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": 200,
  "message": "Request marked as completed"
}
```

## 8.6 Review Endpoints

Endpoints for managing reviews and ratings.

### 8.6.1 Create Ride Review

```
POST /api/reviews
```

Creates a review for a ride and its provider.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "rideId": "60d5ec9bf682d42a4cfa64b9",
  "rating": 5,
  "comment": "Excellent ride, very comfortable and punctual"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Review submitted successfully",
  "review": {
    "_id": "60d5ec9bf682d42a4cfa64f0",
    "ride": "60d5ec9bf682d42a4cfa64b9",
    "provider": "60d5ec9bf682d42a4cfa64a8",
    "customer": "60d5ec9bf682d42a4cfa64a9",
    "rating": 5,
    "comment": "Excellent ride, very comfortable and punctual",
    "createdAt": "2023-06-25T16:30:00Z"
  }
}
```

### 8.6.2 Create Service Review

```
POST /api/serviceReviews
```

Creates a review for a service and its provider.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "requestId": "60d5ec9bf682d42a4cfa64e0",
  "rating": 4,
  "comment": "Good service, arrived on time"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Review submitted successfully",
  "review": {
    "_id": "60d5ec9bf682d42a4cfa64f1",
    "request": "60d5ec9bf682d42a4cfa64e0",
    "provider": "60d5ec9bf682d42a4cfa64a8",
    "customer": "60d5ec9bf682d42a4cfa64a9",
    "rating": 4,
    "comment": "Good service, arrived on time",
    "createdAt": "2023-06-25T17:15:00Z"
  }
}
```

### 8.6.3 Get Provider Reviews

```
GET /api/reviews/provider/{providerId}
```

Retrieves reviews for a specific provider.

**Response:**
```json
{
  "status": 200,
  "reviews": [
    {
      "_id": "60d5ec9bf682d42a4cfa64f0",
      "ride": {
        "_id": "60d5ec9bf682d42a4cfa64b9",
        "startLocation": {
          "address": "123 Main St, City"
        },
        "endLocation": {
          "address": "456 Market St, City"
        }
      },
      "customer": {
        "_id": "60d5ec9bf682d42a4cfa64a9",
        "fullName": "Jane Smith",
        "profileImg": "https://example.com/path/to/image2.jpg"
      },
      "rating": 5,
      "comment": "Excellent ride, very comfortable and punctual",
      "createdAt": "2023-06-25T16:30:00Z"
    }
  ],
  "serviceReviews": [
    {
      "_id": "60d5ec9bf682d42a4cfa64f1",
      "serviceType": "fuel",
      "customer": {
        "_id": "60d5ec9bf682d42a4cfa64a9",
        "fullName": "Jane Smith",
        "profileImg": "https://example.com/path/to/image2.jpg"
      },
      "rating": 4,
      "comment": "Good service, arrived on time",
      "createdAt": "2023-06-25T17:15:00Z"
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 2
}
```

## 8.7 Admin Endpoints

Endpoints for administrative functions.

### 8.7.1 Get Unverified Documents

```
GET /api/auth/unverified-documents
```

Retrieves users with unverified documents.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": 200,
  "users": [
    {
      "_id": "60d5ec9bf682d42a4cfa64a8",
      "fullName": "John Doe",
      "phone": "1234567890",
      "nationalId": "ABC123456",
      "nationalIdImage": "https://example.com/path/to/national-id.jpg",
      "licenseImage": "https://example.com/path/to/license.jpg",
      "nationalIdStatus": "pending",
      "licenseStatus": "pending"
    }
  ]
}
```

### 8.7.2 Verify Document

```
POST /api/auth/verify-document
```

Verifies a user's document.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "userId": "60d5ec9bf682d42a4cfa64a8",
  "documentType": "nationalId",
  "status": "approved"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Document verified successfully"
}
```

### 8.7.3 Create Admin

```
POST /api/auth/create-admin
```

Creates a new admin user.

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fullName": "Admin User",
  "phone": "9876543210",
  "password": "secureadminpassword",
  "nationalId": "XYZ987654"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Admin user created successfully!"
}
```

## 8.8 WebSocket Events

Real-time communication events for the Salik platform.

### 8.8.1 Provider Registration

Registers a provider with the socket server.

**Event:** `registerProvider`  
**Direction:** Client → Server  
**Payload:** Provider ID

### 8.8.2 Service Request

Sends a new service request to nearby providers.

**Event:** `customer-request`  
**Direction:** Client → Server  
**Payload:**
```json
{
  "requestId": "60d5ec9bf682d42a4cfa64e0",
  "customerId": "60d5ec9bf682d42a4cfa64a9",
  "serviceType": "fuel",
  "location": {
    "address": "123 Main St, City",
    "coordinates": [73.1234, 33.5678]
  },
  "description": "Need 10 liters of petrol",
  "notifiedProviders": ["60d5ec9bf682d42a4cfa64a8", "60d5ec9bf682d42a4cfa64a7"]
}
```

### 8.8.3 New Service Request Notification

Notifies providers of a new service request.

**Event:** `new-service-request`  
**Direction:** Server → Client  
**Payload:** Service request details

### 8.8.4 Provider Confirmation

Confirms a selected provider for a service request.

**Event:** `confirm-provider`  
**Direction:** Client → Server  
**Payload:**
```json
{
  "requestId": "60d5ec9bf682d42a4cfa64e0",
  "customerId": "60d5ec9bf682d42a4cfa64a9",
  "providerId": "60d5ec9bf682d42a4cfa64a8"
}
```

### 8.8.5 Request Confirmation Notification

Notifies the provider that they have been confirmed.

**Event:** `request-confirmed`  
**Direction:** Server → Client  
**Payload:**
```json
{
  "requestId": "60d5ec9bf682d42a4cfa64e0",
  "customerId": "60d5ec9bf682d42a4cfa64a9"
}
``` 