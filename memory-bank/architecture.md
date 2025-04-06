# CreatorSync Architecture Documentation

## Overview

This document provides a comprehensive overview of the CreatorSync application architecture, detailing the structure of the codebase, the purpose of each major file and directory, and the relationships between different components. This serves as a reference for developers working on the project.

## Project Structure (Next.js App Router)

CreatorSync uses Next.js with the App Router, promoting a clear separation of concerns and feature-based organization.

```
creatorSync/
├── src/
│   ├── app/               # Next.js App Router: Layouts, Pages, Route Groups
│   │   ├── layout.tsx     # Root layout (Navbar, Footer, Providers)
│   │   ├── page.tsx       # Homepage (Currently basic)
│   │   ├── (auth)/        # Authentication route group
│   │   │   ├── layout.tsx # Layout specific to auth pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx # Login page component
│   │   │   ├── register/
│   │   │   │   └── page.tsx # Register page component
│   │   │   └── forgot-password/ # (Structure exists, page not fully implemented)
│   │   │       └── page.tsx
│   │   └── dashboard/     # Authenticated user area
│   │       ├── page.tsx   # Main dashboard page (displays content list)
│   │       ├── create/
│   │       │   └── page.tsx # Create new content page
│   │       ├── edit/
│   │       │   └── [id]/
│   │       │       └── page.tsx # Edit content page (dynamic route)
│   │       └── settings/
│   │           └── platforms/
│   │               └── page.tsx # View platform connections page
│   ├── components/        # React components
│   │   ├── common/        # Shared UI components (Button, Card, Input, FormErrorMessage)
│   │   ├── layout/        # Layout structure components (Navbar, Footer)
│   │   ├── providers/     # Context provider wrappers (AppProviders)
│   │   ├── auth/          # Authentication specific components (if any needed later)
│   │   └── content/       # Content related components (ContentList, CreateContentForm, EditContentForm)
│   ├── contexts/          # React Context definitions and providers (AuthContext, NotificationsContext)
│   ├── hooks/             # Custom React hooks (useAuth defined in AuthContext)
│   ├── services/          # Business logic & external services (auth, firestore, storage, notifications)
│   ├── models/            # TypeScript interfaces/types (Content, PlatformConnection, UserProfile etc.)
│   ├── utils/             # Utility functions (validation, errorHandling)
│   └── firebase/          # Firebase config (config.ts)
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

## Key Components and Logic

### Core Application (`src/app/`)
- **Root Layout (`layout.tsx`):** Sets up HTML structure, includes global styles, fonts (Inter), Font Awesome, and wraps content with `AppProviders`. Renders `Navbar` and `Footer`.
- **App Providers (`src/components/providers/AppProviders.tsx`):** Wraps the application with necessary context providers (`AuthProvider`, `NotificationsProvider`).
- **Authentication (`(auth)/`):** Contains pages for login, registration, and forgot password, using a specific layout.
- **Dashboard (`dashboard/`):** Main area for authenticated users. Includes pages for viewing content (`page.tsx`), creating content (`create/page.tsx`), editing content (`edit/[id]/page.tsx`), and viewing platform settings (`settings/platforms/page.tsx`).

### Components (`src/components/`)
- **Common:** Reusable UI elements like `Button`, `Card`, `Input`, `FormErrorMessage`.
- **Layout:** `Navbar` (displays navigation, user info, notifications) and `Footer`.
- **Content:**
    - `ContentList`: Displays a list of content items with status badges, dates, platforms, and action buttons.
    - `CreateContentForm`: Form for creating new content (title, desc, file, platforms, schedule).
    - `EditContentForm`: Form for editing existing content metadata (pre-populated, no file change).

### State Management (`src/contexts/`)
- **`AuthContext`:** Manages user authentication state (`user`, `userProfile`, `platformConnections`, `loading`). Provides functions for `signIn`, `signUp`, `logOut`, profile updates, and fetching/refreshing user data and platform connections. Exports `useAuth` hook for easy access.
- **`NotificationsContext`:** (Implementation details not fully explored in Phase 1 docs update) Likely manages fetching and displaying user notifications.

### Services (`src/services/`)
- **`auth.service.ts`:** Handles direct interaction with Firebase Authentication (creating users, signing in/out, password reset, profile updates via Firebase Auth SDK).
- **`firestore.service.ts`:** Handles interactions with Firestore database.
    - User profile CRUD (e.g., `getUserProfile`, `updateUserProfile`).
    - Platform connections (`getUserPlatformConnections`).
    - Content CRUD (`createCreatorContent`, `getUserContent`, `getCreatorContentById`, `updateCreatorContent`, `deleteContent`).
    - Notification management functions.
- **`storage.service.ts`:** Handles interactions with Firebase Storage.
    - Generic file upload (`uploadFile`).
    - Content file upload (`uploadContentFile`) using unique paths.
    - File deletion (`deleteFile`).
    - Helper for getting path from URL (`getFilePathFromURL`).
- **`notifications.service.ts`:** (Implementation details not fully explored in Phase 1 docs update) Likely handles creating, fetching, and marking notifications in Firestore.

### Models (`src/models/`)
- **`Content.ts`:** Defines the structure for content documents stored in Firestore (`creatorContent` collection).
- **`PlatformConnection.ts`:** Defines the structure for user platform connection data stored in Firestore (`users/{userId}/platformConnections` subcollection).
- (Other models like `UserProfile`, `Notification` likely exist or are needed).

### Utilities (`src/utils/`)
- **`validation.ts`:** Contains functions for validating various inputs (email, password, name, required fields, etc.).
- **`errorHandling.ts`:** Provides functions to handle and format errors, especially Firebase errors, into a consistent `AppError` structure.

### Firebase (`src/firebase/` & root `firebase/`)
- **`config.ts`:** Initializes Firebase app using environment variables.
- **Root `firebase/` directory:** Contains CLI config (`firebase.json`), security rules (`firestore.rules`, `storage.rules`), and potentially index definitions.

### Testing (`__tests__/`)
- Contains unit and integration tests using Jest and React Testing Library.
- Mirrors `src` structure.
- Includes tests for services (mocking Firebase), utilities, and some common components and pages.
- Setup (`jest.setup.js`) includes global mocks (e.g., for `next/navigation`, Firebase SDK).
- **Current Status:** Testing was paused to focus on Phase 1 feature completion. Many tests exist but some (like `useAuth.test.tsx`) were failing due to complex mocking issues. Testing needs to be revisited comprehensively.

## Architectural Patterns & Data Flow

1.  **Component Structure:** Functional components with hooks (App Router conventions).
2.  **State Management:** Combination of:
    - React Context (`AuthContext`, `NotificationsContext`) for global state (auth status, profile, connections, notifications).
    - Local component state (`useState`) for UI state, form data, loading/error flags within specific pages/components.
3.  **Data Fetching:** Primarily driven by:
    - `AuthContext` fetching user profile and platform connections on auth state change.
    - Page components (`DashboardPage`, `EditContentPage`) fetching necessary data via `useEffect` and service functions.
4.  **Service Layer:** Abstraction layer (`src/services/`) encapsulates Firebase interactions, promoting separation of concerns and testability.
5.  **Error Handling:** Centralized utility (`errorHandling.ts`) and local `try/catch` blocks in service calls and component submit handlers.
6.  **Routing:** Managed by Next.js App Router file-based routing, including route groups `(auth)` and dynamic routes `[id]`.

## Documentation (memory-bank)

The `memory-bank/` directory contains comprehensive project documentation:

```
memory-bank/
├── 01_content_creator_pain_points.md  # Research on user needs
├── 02_product_requirements_document.md # Feature requirements
├── 03_saas_proposal.md                # Business model and pricing
├── 04_tech_stack.md                   # Technology choices
├── 05_cursor_rules.md                 # Development guidelines
├── 06_implementation_plan.md          # Development roadmap
├── 07_ui_mockups.md                   # Interface designs
├── 08_business_roadmap.md             # 12-month plan
├── 09_marketing_plan.md               # Marketing strategy
├── 10_final_deliverable.md            # Compiled business plan
├── progress.md                        # Development progress tracking
└── architecture.md                    # This file - architecture overview
```

## Key Architectural Patterns

### Authentication Flow

1. User authentication through Firebase Auth
2. Custom authentication hooks (`useAuth`)
3. Protected routes with authentication checking
4. User profile data stored in Firestore
5. Role-based access control via Firebase custom claims

### Data Flow

1. UI Components request data through custom hooks
2. Hooks interact with services for business logic
3. Services call Firebase or external APIs
4. Data is cached in React Query/SWR for performance
5. Real-time updates via Firestore listeners

### Testing Strategy

1. Unit tests for hooks, services, and utilities
2. Component tests for UI elements
3. Integration tests for feature workflows
4. E2E tests for critical user journeys
5. Firebase emulator tests for backend logic

## Firebase Implementation

### Firestore Data Model

```
users/
  {userId}/                # User document
    profile: {}            # User profile data
    settings: {}           # User preferences
    platforms: {}          # Connected platforms

content/
  {userId}/
    {contentId}/           # Content document
      metadata: {}         # Content metadata
      versions: {}         # Platform-specific versions
      analytics: {}        # Performance data

schedules/
  {userId}/
    {scheduleId}/          # Schedule document
      content: {}          # Scheduled content
      platforms: []        # Target platforms

analytics/
  {userId}/
    {platform}/            # Platform-specific analytics
      {date}/              # Daily metrics

monetization/
  {userId}/
    deals/                 # Brand deals
    revenue/               # Revenue tracking
```

### Security Rules

Firebase security rules enforce:
1. User data isolation
2. Role-based access
3. Data validation
4. Rate limiting
5. User-content relationships

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