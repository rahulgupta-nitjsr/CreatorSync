# CreatorSync Architecture Documentation

## Overview

This document provides a comprehensive overview of the CreatorSync application architecture, detailing the structure of the codebase, the purpose of each major file and directory, and the relationships between different components. This serves as a reference for developers working on the project.

## Project Structure (Next.js App Router)

CreatorSync uses Next.js with the App Router, promoting a clear separation of concerns and feature-based organization.

```
creatorSync/
├── src/
│   ├── app/               # Next.js App Router: Layouts, Pages, Route Groups
│   │   ├── layout.tsx     # Root layout (Server Component - HTML structure)
│   │   ├── page.tsx       # Homepage (Currently basic)
│   │   ├── api/           # API Route Handlers
│   │   │   ├── connect/
│   │   │   │   ├── [platform]/
│   │   │   │   │   ├── callback/ # OAuth callback handler
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts    # Initiate OAuth flow
│   │   │   ├── disconnect/
│   │   │   │   └── [platform]/
│   │   │   │       └── route.ts    # Disconnect platform
│   │   │   ├── publish/
│   │   │   │   └── [contentId]/
│   │   │   │       └── route.ts    # Trigger content publishing
│   │   │   └── content/
│   │   │       └── [contentId]/
│   │   │           ├── like/       # Handle liking content
│   │   │           │   └── route.ts
│   │   │           └── route.ts    # Handle content deletion (DELETE)
│   │   ├── (auth)/        # Authentication route group
│   │   │   ├── layout.tsx 
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   └── dashboard/     # Authenticated user area
│   │       ├── page.tsx   # Main dashboard page (content list, stats)
│   │       ├── create/
│   │       │   └── page.tsx
│   │       ├── edit/
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       └── settings/
│   │           └── platforms/
│   │               └── page.tsx
│   ├── components/        # React components
│   │   ├── common/        # Shared UI components (Button, Card, Input, etc.)
│   │   ├── layout/        # Layout components (Navbar, Footer, MainLayout)
│   │   ├── providers/     # Context provider wrappers (AppProviders)
│   │   ├── auth/          
│   │   └── content/       # Content components (ContentList, Forms)
│   ├── contexts/          # React Context definitions (AuthContext, NotificationsContext)
│   ├── hooks/             # Custom React hooks (useAuth is part of AuthContext)
│   ├── services/          # Business logic & external services (auth, firestore, storage, notifications, publishing)
│   ├── models/            # TypeScript interfaces/types (Content, PlatformConnection, UserProfile)
│   ├── utils/             # Utility functions (validation, errorHandling)
│   └── firebase/          # Firebase config (config.ts - client, config.server.ts - admin)
├── __tests__/             # Test files (Jest/RTL) - Mirroring src structure (Currently contains tests for services, utils, some components)
├── __mocks__/             # Manual mocks for Jest
├── public/                # Static assets
├── .cursor/               # Cursor AI configuration
├── firebase.json          # Firebase CLI config (hosting, functions, emulators)
├── firestore.rules        # Firestore security rules
├── storage.rules          # Storage security rules
├── firestore.indexes.json # Firestore index definitions (if needed)
├── memory-bank/           # Project documentation (including this file)
├── node_modules/          # Project dependencies
├── .env.local             # Environment variables (Firebase keys etc.)
├── .gitignore             # Git ignore config
├── jest.config.js         # Jest test runner config
├── jest.setup.js          # Jest setup (global mocks)
├── next.config.js         # Next.js config (if needed beyond default)
├── package.json           # Project dependencies and scripts
├── postcss.config.js      # PostCSS config (for Tailwind)
├── tailwind.config.js     # Tailwind CSS config
└── tsconfig.json          # TypeScript config
```

## Key Components and Logic (Updated)

### Core Application (`src/app/`)
- **Root Layout (`layout.tsx`):** Server Component. Sets up HTML structure, includes global styles. Renders `MainLayout`.
- **Main Layout (`src/components/layout/MainLayout.tsx`):** Client Component. Applies main flex structure, includes `AppProviders`, `Toaster`, `Navbar`, `Footer`.
- **App Providers (`src/components/providers/AppProviders.tsx`):** Wraps the application with `AuthProvider`, `NotificationsProvider`.
- **Authentication (`(auth)/`):** Login, registration pages.
- **Dashboard (`dashboard/`):** Main authenticated area. 
    - `page.tsx`: Displays aggregate stats (views, likes, comments, earnings placeholder) and the user's content list via `ContentList`.
    - `create/page.tsx`: Content creation form.
    - `edit/[id]/page.tsx`: Content editing form and the "Publish Now" section.
    - `settings/platforms/page.tsx`: Displays platform connection status with Connect/Disconnect buttons.
- **API Routes (`api/`):** Backend handlers for specific actions.
    - `connect/[platform]`: Initiates OAuth flow, sets state cookie.
    - `connect/[platform]/callback`: Handles OAuth redirect, verifies state, exchanges code for tokens, fetches profile (placeholder), saves connection to Firestore.
    - `disconnect/[platform]`: Deletes connection from Firestore, attempts token revocation (placeholder).
    - `publish/[contentId]`: Triggers the publishing service for specified platforms.
    - `content/[contentId]`: Handles `DELETE` requests (Firestore doc + Storage file).
    - `content/[contentId]/like`: Handles `POST` requests to increment like count.

### Components (`src/components/`)
- **Common:** Reusable UI (Button, Card, Input, etc.). `StatCard` added (currently defined in Dashboard page).
- **Layout:** `Navbar`, `Footer`, `MainLayout`.
- **Content:**
    - `ContentList`: Displays content items, now includes stats (views, likes, comments) and a Like button.
    - `CreateContentForm`, `EditContentForm`.

### State Management (`src/contexts/`)
- **`AuthContext`:** Manages user auth state, profile, platform connections. Provides `signIn`, `logOut`, `getIdToken`, `refreshPlatformConnections`, etc. Imports `firestore.service` (path corrected).
- **`NotificationsContext`:** (Still largely placeholder).

### Services (`src/services/`)
- **`auth.service.ts`:** Firebase Auth interactions.
- **`firestore.service.ts`:** Firestore CRUD operations for profiles, content, connections.
- **`storage.service.ts`:** Firebase Storage interactions.
- **`notifications.service.ts`:** (Placeholder).
- **`publishing.service.ts`:** (New) Encapsulates platform publishing logic.
    - Contains placeholder functions `publishToTikTok`, `publishToInstagram`, `publishToX`.
    - Contains placeholder function `refreshAccessToken`.
    - Contains orchestration function `publishContentToPlatforms` which calls the platform-specific functions and handles token expiry checks/refresh attempts.

### Models (`src/models/`)
- **`Content.ts`:** Updated with `views`, `likes`, `commentsCount`, `publishedPlatforms`, and `estimatedEarnings` fields.
- **`PlatformConnection.ts`:** Defines connection structure.
- (Other models like `UserProfile`).

### Utilities (`src/utils/`)
- **`validation.ts`**, **`errorHandling.ts`**.

### Firebase (`src/firebase/` & root `firebase/`)
- **`config.ts`:** Client-side Firebase initialization.
- **`config.server.ts`:** (New) Server-side Firebase Admin SDK initialization using environment variables.
- Root files: Rules, CLI config.

### Testing (`__tests__/`)
- **Status:** Paused/Deferred. Contains existing tests for services, utils, components. Requires fixes (esp. `useAuth`) and expansion.

## Architectural Patterns & Data Flow (Updated)

- **API Routes:** Used for backend logic triggered by client actions (OAuth, Disconnect, Publish, Delete, Like) requiring secure operations or admin privileges.
- **Server Components (`layout.tsx`) vs Client Components (`MainLayout.tsx`, pages):** Following Next.js App Router patterns to separate concerns.
- **Client-Side Aggregation:** Basic analytics (total views, likes, etc.) are currently calculated on the client in the Dashboard page based on fetched data. Could be moved to backend/Cloud Functions for larger scale.
- **Optimistic Updates:** Used for actions like Liking and Deleting content on the Dashboard for a smoother UX, with error handling to revert if the backend call fails.

## Documentation (memory-bank)

- Updated to reflect Phase 2 & 3 progress.

## Key Architectural Patterns

(No major changes to listed patterns, but API routes are now a key part)

### Authentication Flow
(No change)

### Data Flow
1. UI Components trigger actions (button clicks).
2. Handlers call backend API Routes (for secure actions like delete, publish, OAuth) or Service functions directly (for client-side fetches like `getUserContent`).
3. API Routes use Admin SDK (`config.server.ts`) for auth/DB access.
4. Services use Client SDK (`config.ts`) or Admin SDK (if called from API route) or platform SDKs (TODO).
5. Data stored/retrieved from Firebase (Firestore, Storage).
6. State updated via Context (`AuthContext`) or local state, sometimes optimistically.

### Testing Strategy
(No change - Still Paused)

## Firebase Implementation

### Firestore Data Model (Updated)

```
users/
  {userId}/                
    // profile: {}           # (Implicitly handled by Auth, extra fields could be here)
    // settings: {}          # (Not implemented yet)
    platformConnections/     # SUBCOLLECTION
        {platformId}/        # e.g., 'tiktok', 'x'
            accessToken: "..."
            refreshToken: "..." # Optional
            expiresAt: Timestamp | null
            scope: "..."
            profileInfo: { id: "...", username: "..." } # Fetched from platform
            connectedAt: Timestamp
            status: "active" | "needs_reauth" # etc.

creatorContent/
  {contentId}/           
      userId: "..."
      title: "..."
      description: "..."
      mediaUrl: "..." | null
      mediaType: "video" | "image" | "text"
      tags: ["...", "..."]
      status: "draft" | "scheduled" | "published" | "partially_published" | ...
      createdAt: Timestamp
      updatedAt: Timestamp
      scheduledDate: Timestamp | null
      publishDate: Timestamp | null
      views: number          # Added
      likes: number          # Added
      commentsCount: number  # Added
      publishedPlatforms: {  # Added
          tiktok: { success: true, postId: "...", publishedAt: Timestamp },
          x: { success: false, error: "..." }
      }
      estimatedEarnings: {   # Added
          tiktok: 1.50,
          instagram: 0.75
      }
      error: "..." | null

# comments/ (Separate collection, linked by contentId)
#   {commentId}/
#       contentId: "..."
#       userId: "..."
#       text: "..."
#       createdAt: Timestamp

# notifications/ (Separate collection, linked by userId)
#   {notificationId}/
#       userId: "..."
#       message: "..."
#       read: boolean
#       createdAt: Timestamp

```

## Integration Points

### External APIs

1. **TikTok API**: Content management, analytics
2. **Instagram Graph API**: Content management, analytics
3. **X API (Twitter)**: Content management, analytics
4. **Payment Processors**: Stripe for subscription management

### Third-Party Services

1. **SendGrid**: Email notifications
2. **Algolia**: Search functionality
3. **Cloudinary**: Media optimization
4. **Google Analytics**: Usage tracking

## Deployment Architecture

CreatorSync uses a serverless architecture built on Firebase:

1. **Firebase Hosting**: Web application delivery
2. **Firebase Functions**: Backend logic
3. **Firestore**: Database storage
4. **Firebase Storage**: Media files
5. **Firebase Authentication**: User management
6. **Cloud CDN**: Content delivery

## Further Development

As the application evolves, this document will be updated to reflect architectural changes and new components. Always refer to the latest version for the most accurate information.

## Known Issues and Development Notes

### Next.js App Router Configuration

The current implementation shows routing issues with authentication pages:
- Routes using `/app/(auth)/login` and `/app/(auth)/register` return 404 errors
- Direct routes `/login` and `/register` are working correctly

This suggests a potential misconfiguration in the Next.js App Router setup. For the next development session, the routing structure should be reviewed and adjusted to ensure correct handling of route groups.

Possible solutions to investigate:
1. Check folder structure alignment with Next.js App Router conventions
2. Verify route group configuration in `app/(auth)` folder
3. Check if there are competing route definitions
4. Ensure proper export of Page components in auth-related files

### Firebase Integration

Some Firebase integration issues have been identified and fixed:
1. The content.ts module was importing 'firestore' instead of 'db' from config.ts
2. Type issues in Firestore document handling have been addressed with proper typing

For the next development session, all Firebase service imports should be verified for consistency before implementing additional features. 