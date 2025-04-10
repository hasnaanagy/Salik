# Salik - Integrated Ride-Sharing & Service Platform

![Salik Logo](logo.png)

## Overview

Salik is a comprehensive platform that connects users for ride-sharing while also enabling on-demand roadside services like fuel delivery and mechanical assistance. The ecosystem consists of four main components:

- **Web Application**: For users to book rides and services
- **Mobile Application**: For on-the-go access to all platform features
- **Admin Dashboard**: For platform management and verification
- **Backend Server**: Robust API server with real-time communication

Salik creates a community of drivers, service providers, and customers who can seamlessly interact, improving transportation accessibility while providing essential road services when needed.

## Key Features

### For Customers
- **Ride Booking**: Search and book rides based on location, date, and time
- **Service Requests**: Request fuel delivery or mechanical assistance based on your location
- **Provider Profiles**: View detailed profiles and ratings before booking
- **Reviews & Ratings**: Rate and review drivers and service providers
- **Activity Tracking**: Monitor past, upcoming, and canceled bookings
- **Request Management**: Track service requests by status (pending, accepted, confirmed, completed)

### For Service Providers
- **Ride Creation**: Create and manage ride offerings with routes and schedules
- **Service Listings**: Offer fuel delivery or mechanical services with pricing details
- **Document Verification**: Secure verification process with license and ID uploads
- **Request Handling**: Accept and manage service requests from customers
- **Activity Dashboard**: Track ride bookings and service requests

### For Administrators
- **User Management**: Approve, suspend, or manage user accounts
- **Document Verification**: Review and approve provider documents
- **Platform Monitoring**: Track all rides and services on the platform
- **Content Moderation**: Monitor reviews and reported content

### Technical Features
- **Real-time Notifications**: Socket.io integration for instant updates
- **Geolocation Services**: Find nearby services and track rides
- **Secure Authentication**: JWT-based authentication system
- **Responsive Design**: Optimized interfaces for both web and mobile
- **Data Validation**: Comprehensive input validation across all platforms

## Technologies Used

### Backend
- **Node.js** & **Express**: Server framework
- **MongoDB** with **Mongoose**: Database layer
- **Socket.io**: Real-time communication
- **JWT**: Authentication and authorization
- **Multer & Cloudinary**: File uploads and storage
- **Node-cron**: Scheduled tasks

### Web Frontend
- **React 19**: UI framework
- **Redux Toolkit**: State management
- **Material UI & Styled Components**: UI components
- **Axios**: API communication
- **React Router**: Navigation
- **Vite**: Build tool

### Mobile App
- **React Native** with **Expo**: Cross-platform mobile development
- **React Navigation**: Mobile navigation system
- **AsyncStorage**: Local data persistence
- **React Native Maps**: Map integration
- **Expo Location**: Geolocation services

### Admin Dashboard
- **React**: UI framework
- **Redux**: State management
- **Material UI**: Admin interface components
- **Vite**: Build tool

## Installation Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/salik.git
cd salik

# Install backend dependencies
cd salik-backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials:
# - MongoDB connection string
# - JWT secret
# - Cloudinary credentials (optional)

# Start the server
npm start
```

### Web Application Setup
```bash
# Navigate to web directory
cd ../salik-web
npm install
npm start
```

### Mobile Application Setup
```bash
# Navigate to mobile directory
cd ../salik-mobile
npm install
npx expo start
```

### Admin Dashboard Setup
```bash
# Navigate to dashboard directory
cd ../salik-dashboard
npm install
npm start
```

## Usage Guide

### Customer Journey

#### Booking a Ride
1. Create an account or sign in
2. Navigate to "Book a Ride"
3. Enter your start and end locations, date, and time
4. Browse available rides and select one
5. Confirm booking details and complete payment if applicable
6. Track ride status in the Activity screen

#### Requesting a Service
1. Navigate to "Services"
2. Select service type (Fuel or Mechanical)
3. Share your location or enter it manually
4. Add service details and description of the issue
5. Submit request and wait for provider responses
6. Select a provider from those who accepted
7. Track service status and rate upon completion

### Provider Journey

#### Creating a Ride
1. Sign in as a provider (or switch to provider mode)
2. Complete verification by uploading license and ID
3. Once approved, navigate to "Create Ride"
4. Enter route details, date, time, and available seats
5. Set pricing and any additional information
6. Publish the ride and manage bookings

#### Offering Services
1. Navigate to "My Services"
2. Select service type to offer (Fuel or Mechanical)
3. Set your service area, pricing, and availability
4. Respond to incoming service requests
5. Communicate with customers and complete services

### Admin Functions
1. Log in to the admin dashboard
2. Review pending provider verifications
3. Manage users, rides, and services
4. Handle reported content and disputes

## Project Structure

```
salik/
├── salik-web/                 # User web application
│   ├── src/
│   │   ├── api/               # API integration
│   │   ├── assets/            # Static resources
│   │   ├── components/        # Reusable UI components
│   │   ├── custom/            # Custom UI elements
│   │   ├── CustomHook/        # React custom hooks
│   │   ├── layout/            # Layout components
│   │   ├── pages/             # Page components
│   │   ├── redux/             # State management
│   │   ├── styles/            # Global styles
│   │   ├── validation/        # Form validation
│   │   └── main.jsx           # Entry point
│   └── public/                # Public assets
│
├── salik-backend/             # Backend API server
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── cornJobs.js            # Scheduled tasks
│   └── server.js              # Main server file
│
├── salik-mobile/              # Mobile application
│   ├── app/                   # Expo Router screens
│   │   └── (tabs)/            # Tab navigation screens
│   ├── components/            # UI components
│   ├── api/                   # API integration
│   ├── redux/                 # State management
│   ├── assets/                # Static resources
│   ├── constants/             # App constants
│   └── styles/                # Styling
│
└── salik-dashboard/           # Admin dashboard
    ├── src/
    │   ├── api/               # API integration
    │   ├── components/        # Dashboard components
    │   ├── layout/            # Layout components
    │   ├── pages/             # Admin pages
    │   └── redux/             # State management
    └── public/                # Public assets
```

## API Documentation

Salik's API is organized around REST principles. All API operations use standard HTTP methods and return JSON responses.

### Base URL
```
https://api.salik.com/api
```

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/signup` | POST | Register a new user |
| `/auth/login` | POST | Authenticate user |
| `/auth/switch-role` | PUT | Switch between customer and provider roles |
| `/auth/` | GET | Get current user profile |

### Rides
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/rides` | GET | List available rides |
| `/rides` | POST | Create a new ride |
| `/rides/:id` | GET | Get ride details |
| `/rides/:id` | PUT | Update ride details |
| `/rides/:id` | DELETE | Cancel/delete a ride |

### Ride Bookings
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/rideBooking` | POST | Book a ride |
| `/rideBooking/:id` | GET | Get booking details |
| `/rideBooking/:id/status` | PUT | Update booking status |
| `/rideBooking/user/:userId` | GET | Get user's bookings |

### Services
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/service` | GET | Get available services |
| `/service` | POST | Create a new service |
| `/service/:id` | GET | Get service details |
| `/service/provider/:providerId` | GET | Get provider's services |

### Service Requests
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/request` | POST | Create service request |
| `/request/:id` | GET | Get request details |
| `/request/:id/accept` | PUT | Accept a request (provider) |
| `/request/:id/confirm` | PUT | Confirm a provider (customer) |
| `/request/:id/complete` | PUT | Mark request as completed |

### Reviews
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reviews` | POST | Create a ride review |
| `/reviews/provider/:providerId` | GET | Get provider reviews |
| `/serviceReviews` | POST | Create a service review |
| `/serviceReviews/provider/:providerId` | GET | Get provider service reviews |

### WebSocket Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `registerProvider` | Client -> Server | Register provider for notifications |
| `customer-request` | Client -> Server | New service request from customer |
| `new-service-request` | Server -> Client | Notify provider of new request |
| `confirm-provider` | Client -> Server | Customer confirms a provider |
| `request-confirmed` | Server -> Client | Notify provider of confirmation |

## Contributing Guidelines

We welcome contributions to the Salik platform! Please follow these steps:

1. **Fork the Repository**
   ```
   https://github.com/your-username/salik.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit Your Changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to the Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Code Style Guidelines

- Follow existing naming conventions
- Write meaningful commit messages
- Add comprehensive JSDoc comments
- Include tests for new features
- Update documentation for API changes

### Development Workflow

1. Select an issue to work on or create a new one
2. Discuss approach in the issue comments
3. Implement the feature or fix
4. Add tests and documentation
5. Submit a pull request
6. Address review comments

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact Information

- **Project Maintainer**: Your Name
- **Email**: contact@salik.com
- **Website**: [www.salik.com](https://www.salik.com)
- **GitHub Repository**: [github.com/your-username/salik](https://github.com/your-username/salik)

## Acknowledgments

- All the amazing contributors to this project
- Open source libraries and frameworks that made this possible
- The broader ride-sharing and community service community

---

Copyright © 2023-2024 Salik. All rights reserved. 