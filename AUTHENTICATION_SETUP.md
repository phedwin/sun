# Authentication & Collaboration Setup Guide

## Overview
This application now has a complete database schema for:
- User authentication (Google & Facebook OAuth)
- Progress tracking
- Streak management
- Collaborative rooms
- Leaderboard system

## Database Schema Created

### Tables:
1. **User** - Stores user accounts from OAuth
2. **Session** - Manages user sessions
3. **Progress** - Tracks problem-solving progress
4. **Streak** - Manages daily streaks
5. **Room** - Collaborative coding rooms
6. **RoomMember** - Room membership

## Next Steps (Implementation Required)

### 1. Backend Server Setup
You need to create a backend server to handle:
- OAuth authentication flow
- Session management
- WebSocket connections for real-time collaboration

#### Option A: Express.js Backend
```bash
npm install express express-session passport passport-google-oauth20 passport-facebook cors
npm install @types/express @types/express-session @types/passport -D
```

#### Option B: Next.js API Routes (Recommended)
```bash
npm install next-auth
```

### 2. OAuth App Credentials

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:1313/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

#### Facebook OAuth:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs:
   - `http://localhost:1313/api/auth/callback/facebook`
   - `https://yourdomain.com/api/auth/callback/facebook`

### 3. Environment Variables

Add to `.env`:
```env
# Database
DATABASE_URL="file:./dev.db"

# OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# Session Secret
SESSION_SECRET="generate-a-random-secret-here"
NEXTAUTH_SECRET="generate-another-random-secret"
NEXTAUTH_URL="http://localhost:1313"

# WebSocket Server
WS_PORT="3001"
```

### 4. Real-time Collaboration

For collaborative rooms with video/audio:

#### WebRTC Setup:
```bash
npm install socket.io socket.io-client simple-peer
npm install @types/socket.io -D
```

#### Features to Implement:
- Real-time code synchronization
- Cursor position sharing
- Video/audio streaming
- User presence indicators

### 5. Current Implementation Status

✅ **Completed:**
- SQLite database schema
- Prisma ORM setup
- Database models for all features

⏳ **Requires Implementation:**
- Backend server (Express or Next.js API)
- OAuth integration
- Session management
- WebSocket server
- Real-time collaboration
- Video/audio infrastructure

## Simplified Demo Implementation

For immediate testing without full OAuth, I can create:
1. Mock authentication (username-only login)
2. LocalStorage-based sessions
3. Basic leaderboard
4. Streak tracking

This would let you test the features while you set up OAuth credentials.

Would you like me to:
A. Create the full backend server structure (requires OAuth setup)
B. Create a simplified demo version with mock auth
C. Provide detailed step-by-step instructions for OAuth setup
