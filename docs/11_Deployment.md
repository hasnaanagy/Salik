# 11. Deployment

## 11.1 Backend Deployment

The Salik backend is a Node.js application that needs to be deployed with proper configuration for production use.

### 11.1.1 Deployment Architecture

The recommended backend deployment architecture consists of:

1. **Web Servers**: Multiple Node.js instances behind a load balancer
2. **Database**: MongoDB cluster with replication for high availability
3. **Cache Layer**: Redis for session storage and caching
4. **File Storage**: Cloudinary for media storage
5. **WebSocket Server**: Socket.IO for real-time communications
6. **Scheduled Jobs**: Server for running cron jobs and background tasks

```
                  ┌─────────────┐
                  │ Load Balancer│
                  └──────┬──────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
┌────────▼─────┐  ┌──────▼───────┐  ┌────▼──────────┐
│   Node.js    │  │    Node.js   │  │    Node.js    │
│   Server 1   │  │    Server 2  │  │    Server 3   │
└──────┬───────┘  └──────┬───────┘  └──────┬────────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
┌──────▼─────┐    ┌──────▼──────┐    ┌─────▼─────┐
│  MongoDB   │    │    Redis    │    │ Cloudinary│
│  Cluster   │    │    Cache    │    │  Storage  │
└────────────┘    └─────────────┘    └───────────┘
```

### 11.1.2 Preparing for Deployment

Before deploying to production, several preparatory steps are necessary:

1. **Environment Configuration**

Create a proper `.env` file for production settings:

```
# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/salik?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your-long-secure-jwt-secret-key
JWT_EXPIRY=1d

# Redis Configuration
REDIS_URL=redis://username:password@redis-host:port

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Other Services
SENTRY_DSN=https://your-sentry-dsn
```

2. **Build Process**

While Node.js doesn't require a build step like frontend applications, it's good practice to:

- Remove development dependencies
- Create a production-specific `package.json`
- Set up proper process management

```json
// package.json for production
{
  "name": "salik-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.3",
    "cloudinary": "^1.41.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.10.0",
    "multer": "^1.4.5-lts.1",
    "node-cron": "^3.0.3",
    "socket.io": "^4.8.1"
  }
}
```

3. **Security Hardening**

Implement security best practices:

- Set up proper HTTP headers
- Implement rate limiting
- Enable CORS with appropriate settings

```javascript
// Security middleware setup
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Set security headers
app.use(helmet());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// CORS configuration
const corsOptions = {
  origin: ['https://salik.com', 'https://admin.salik.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
```

### 11.1.3 Deployment Options

The backend can be deployed using several methods:

#### Docker Deployment

1. Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

2. Create a `docker-compose.yml` for local testing:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    env_file:
      - .env
    depends_on:
      - mongo
      - redis
    restart: always
  
  mongo:
    image: mongo:5
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=example
  
  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  mongo-data:
  redis-data:
```

3. Build and deploy:

```bash
# Build the Docker image
docker build -t salik-backend .

# Run with docker-compose for local testing
docker-compose up -d

# For cloud deployment (example with Google Cloud Run)
gcloud builds submit --tag gcr.io/your-project/salik-backend
gcloud run deploy salik-backend --image gcr.io/your-project/salik-backend --platform managed
```

#### Traditional VPS Deployment

For deployment on a VPS like DigitalOcean, AWS EC2, etc.:

1. Set up the server:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Optional: Install Nginx
sudo apt install -y nginx
```

2. Clone the repository:

```bash
git clone https://github.com/your-username/salik.git
cd salik/salik-backend
npm ci --only=production
```

3. Create PM2 configuration:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'salik-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
    }
  }]
};
```

4. Start the application:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

5. Configure Nginx as a reverse proxy:

```nginx
# /etc/nginx/sites-available/salik
server {
    listen 80;
    server_name api.salik.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

6. Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/salik /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 11.1.4 Continuous Deployment

Set up continuous deployment using GitHub Actions:

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    branches: [ main ]
    paths:
      - 'salik-backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: |
        cd salik-backend
        npm ci
        
    - name: Run tests
      run: |
        cd salik-backend
        npm test
        
    - name: Deploy to production
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/salik/salik-backend
          git pull
          npm ci --only=production
          pm2 reload salik-api
```

## 11.2 Web Application Deployment

The Salik web application is a React-based SPA built with Vite that needs proper deployment for production.

### 11.2.1 Build Process

1. Set up environment variables for production:

```
# .env.production
VITE_API_URL=https://api.salik.com
VITE_SOCKET_URL=wss://api.salik.com
VITE_GOOGLE_MAPS_KEY=your-google-maps-api-key
```

2. Create a production build:

```bash
# Install dependencies
cd salik-web
npm install

# Build for production
npm run build
```

This will generate a `dist` directory with optimized static files.

### 11.2.2 Static Hosting Options

The web application can be deployed to various static hosting platforms:

#### Netlify Deployment

1. Create a `netlify.toml` configuration:

```toml
[build]
  base = "salik-web/"
  publish = "dist/"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy via Netlify CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd salik-web
netlify deploy --prod
```

#### Vercel Deployment

1. Create a `vercel.json` configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "salik-web/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

2. Deploy via Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd salik-web
vercel --prod
```

#### AWS S3 + CloudFront Deployment

1. Create an S3 bucket:

```bash
aws s3 mb s3://salik-web --region us-east-1
```

2. Configure the bucket for static website hosting:

```bash
aws s3 website s3://salik-web --index-document index.html --error-document index.html
```

3. Upload the build to S3:

```bash
aws s3 sync dist/ s3://salik-web/ --delete --acl public-read
```

4. Set up CloudFront distribution for HTTPS and better performance.

### 11.2.3 Continuous Deployment

Set up GitHub Actions for web application deployment:

```yaml
# .github/workflows/deploy-web.yml
name: Deploy Web App

on:
  push:
    branches: [ main ]
    paths:
      - 'salik-web/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: |
        cd salik-web
        npm ci
        
    - name: Build
      run: |
        cd salik-web
        npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
        VITE_SOCKET_URL: ${{ secrets.VITE_SOCKET_URL }}
        VITE_GOOGLE_MAPS_KEY: ${{ secrets.VITE_GOOGLE_MAPS_KEY }}
        
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --dir=salik-web/dist --prod
      env:
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

## 11.3 Mobile Application Deployment

The Salik mobile application is built with React Native and Expo, requiring specific deployment processes for iOS and Android.

### 11.3.1 Expo Build Configuration

1. Configure `app.json` for production:

```json
{
  "expo": {
    "name": "Salik",
    "slug": "salik-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.salik",
      "buildNumber": "1.0.0",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Salik needs access to your location to find nearby rides and services."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.yourcompany.salik",
      "versionCode": 1,
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ],
      "config": {
        "googleMaps": {
          "apiKey": "your-google-maps-api-key"
        }
      }
    },
    "extra": {
      "eas": {
        "projectId": "your-expo-project-id"
      }
    }
  }
}
```

2. Set up environment variables:

```javascript
// app.config.js
export default ({ config }) => {
  return {
    ...config,
    extra: {
      apiUrl: process.env.API_URL || "https://api.salik.com",
      socketUrl: process.env.SOCKET_URL || "wss://api.salik.com",
      eas: {
        projectId: "your-expo-project-id"
      }
    }
  };
};
```

### 11.3.2 Building for iOS and Android

Using Expo Application Services (EAS) for builds:

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Configure EAS builds with `eas.json`:

```json
{
  "cli": {
    "version": ">= 0.52.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "API_URL": "https://dev-api.salik.com",
        "SOCKET_URL": "wss://dev-api.salik.com"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "API_URL": "https://staging-api.salik.com",
        "SOCKET_URL": "wss://staging-api.salik.com"
      }
    },
    "production": {
      "env": {
        "API_URL": "https://api.salik.com",
        "SOCKET_URL": "wss://api.salik.com"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABC123DEF"
      },
      "android": {
        "serviceAccountKeyPath": "./path/to/service-account.json"
      }
    }
  }
}
```

3. Build for iOS:

```bash
eas build --platform ios --profile production
```

4. Build for Android:

```bash
eas build --platform android --profile production
```

### 11.3.3 App Store and Play Store Submission

1. iOS App Store:

```bash
eas submit --platform ios --profile production
```

2. Google Play Store:

```bash
eas submit --platform android --profile production
```

### 11.3.4 Over-the-Air Updates

Configure Expo OTA updates for quick fixes without app store resubmission:

1. Set up update profiles in `eas.json`:

```json
{
  "cli": {
    "version": ">= 0.52.0"
  },
  "build": {
    // Build configurations...
  },
  "submit": {
    // Submit configurations...
  },
  "updates": {
    "url": "https://u.expo.dev/your-project-id",
    "production": {
      "channel": "production"
    },
    "staging": {
      "channel": "staging"
    },
    "development": {
      "channel": "development"
    }
  }
}
```

2. Publish an update:

```bash
eas update --branch production --message "Fix for location issue"
```

### 11.3.5 Continuous Deployment

Set up GitHub Actions for mobile app deployment:

```yaml
# .github/workflows/deploy-mobile.yml
name: Deploy Mobile App

on:
  push:
    branches: [ main ]
    paths:
      - 'salik-mobile/**'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        
    - name: Setup Expo
      uses: expo/expo-github-action@v7
      with:
        expo-version: latest
        eas-version: latest
        token: ${{ secrets.EXPO_TOKEN }}
        
    - name: Install dependencies
      run: |
        cd salik-mobile
        npm ci
        
    - name: Build preview
      if: github.ref == 'refs/heads/develop'
      run: |
        cd salik-mobile
        eas build --platform all --profile preview --non-interactive
        
    - name: Build production
      if: github.ref == 'refs/heads/main'
      run: |
        cd salik-mobile
        eas build --platform all --profile production --non-interactive
        
    - name: Submit to stores
      if: github.ref == 'refs/heads/main' && startsWith(github.event.head_commit.message, 'release:')
      run: |
        cd salik-mobile
        eas submit --platform all --profile production --non-interactive
```

## 11.4 Admin Dashboard Deployment

The Salik admin dashboard is a React application built with Vite, similar to the web application but with restricted access.

### 11.4.1 Build Process

1. Set up environment variables for production:

```
# .env.production
VITE_ADMIN_API_URL=https://api.salik.com/admin
VITE_SOCKET_URL=wss://api.salik.com
```

2. Create a production build:

```bash
# Install dependencies
cd salik-dashboard
npm install

# Build for production
npm run build
```

### 11.4.2 Deployment Considerations

The admin dashboard should be deployed with additional security considerations:

1. **Access Restriction**: 
   - IP whitelisting for admin access
   - Additional authentication layer
   - Protected hosting environment

2. **Separate Domain**:
   - Use a separate subdomain (e.g., admin.salik.com)
   - Configure separate security policies

Example Nginx configuration with IP restrictions:

```nginx
# /etc/nginx/sites-available/salik-admin
server {
    listen 80;
    server_name admin.salik.com;
    
    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name admin.salik.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/admin.salik.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.salik.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https://api.salik.com wss://api.salik.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
    
    # IP restriction
    # Uncomment to restrict access to specific IPs
    # deny all;
    # allow 203.0.113.1;  # Office IP
    # allow 198.51.100.1; # VPN IP
    
    location / {
        root /var/www/admin.salik.com;
        try_files $uri $uri/ /index.html;
    }
}
```

### 11.4.3 Continuous Deployment

Set up GitHub Actions for admin dashboard deployment:

```yaml
# .github/workflows/deploy-admin.yml
name: Deploy Admin Dashboard

on:
  push:
    branches: [ main ]
    paths:
      - 'salik-dashboard/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: |
        cd salik-dashboard
        npm ci
        
    - name: Build
      run: |
        cd salik-dashboard
        npm run build
      env:
        VITE_ADMIN_API_URL: ${{ secrets.VITE_ADMIN_API_URL }}
        VITE_SOCKET_URL: ${{ secrets.VITE_SOCKET_URL }}
        
    - name: Deploy to server
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.ADMIN_HOST }}
        username: ${{ secrets.ADMIN_USERNAME }}
        key: ${{ secrets.ADMIN_SSH_KEY }}
        source: "salik-dashboard/dist/*"
        target: "/var/www/admin.salik.com"
        strip_components: 2
``` 