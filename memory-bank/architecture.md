# CreatorSync Architecture Documentation

## Overview

This document provides a comprehensive overview of the CreatorSync application architecture, detailing the structure of the codebase, the purpose of each major file and directory, and the relationships between different components. This serves as a reference for developers working on the project.

## Project Structure

The CreatorSync application follows a feature-based structure with clean separation of concerns. Here's an overview of the top-level organization:

```
creatorSync/
├── src/                   # Source code
│   ├── app/               # Next.js application code
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Business logic and external services
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── styles/            # Global styles
│   └── firebase/          # Firebase-specific code
├── tests/                 # Test files
├── public/                # Static assets
├── .cursor/               # Cursor AI configuration
│   └── rules/             # Cursor rules for development
├── firebase/              # Firebase configuration
│   ├── functions/         # Cloud Functions
│   ├── firestore.rules    # Firestore security rules
│   ├── storage.rules      # Storage security rules
│   └── firebase.json      # Firebase configuration
└── memory-bank/           # Project documentation
```

## Key Files and Directories

### Application Core

#### `src/app/`
The core of the Next.js application using the App Router. Contains page components and routing structure.

```
app/
├── layout.tsx            # Root layout component
├── page.tsx              # Homepage component
├── (auth)/               # Authentication routes group
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── forgot-password/  # Password recovery
├── dashboard/            # Dashboard routes
├── content-studio/       # Content creation and management
├── analytics/            # Analytics and reporting
├── monetization/         # Revenue tracking and management
├── community/            # Community engagement
└── growth/               # Growth and strategy
```

#### `src/components/`
Reusable React components organized by feature and functionality.

```
components/
├── common/               # Shared UI components
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   └── ...
├── layout/               # Layout components
│   ├── Sidebar/
│   ├── Header/
│   └── ...
├── dashboard/            # Dashboard-specific components
├── content-studio/       # Content Studio components
├── analytics/            # Analytics components
├── monetization/         # Monetization components
├── community/            # Community components
└── growth/               # Growth components
```

#### `src/hooks/`
Custom React hooks for shared logic across components.

```
hooks/
├── useAuth.ts            # Authentication hook
├── useFirestore.ts       # Firestore data hook
├── usePlatformData.ts    # Social platform data hook
├── useLocalStorage.ts    # Local storage management
└── ...
```

### Firebase Integration

#### `src/firebase/`
Firebase service configuration and utility functions.

```
firebase/
├── config.ts             # Firebase initialization
├── auth.ts               # Authentication utilities
├── firestore.ts          # Firestore utilities
├── storage.ts            # Storage utilities
├── functions.ts          # Cloud Functions utilities
└── analytics.ts          # Firebase Analytics utilities
```

#### `firebase/functions/`
Cloud Functions implementation for backend logic.

```
functions/
├── src/
│   ├── index.ts          # Functions entry point
│   ├── auth/             # Authentication functions
│   ├── content/          # Content management functions
│   ├── analytics/        # Analytics processing
│   ├── monetization/     # Payment and revenue functions
│   ├── social/           # Social media API integrations
│   └── utils/            # Shared utilities
├── package.json
└── tsconfig.json
```

### Business Logic

#### `src/services/`
Services that handle business logic and external API integration.

```
services/
├── api.ts                # API client configuration
├── platformService.ts    # Social platform API handling
├── analyticsService.ts   # Analytics data processing
├── contentService.ts     # Content management logic
├── monetizationService.ts # Revenue tracking logic
└── notificationService.ts # Notification management
```

### Testing

#### `__tests__/`
Test files organized to mirror the source code structure.

```
__tests__/
├── components/           # Component tests
│   ├── Button.test.tsx   # Button component tests
│   ├── Card.test.tsx     # Card component tests
│   └── ...               # Other component tests
├── pages/                # Page tests
│   ├── HomePage.test.tsx # Home page tests
│   └── ...               # Other page tests
├── hooks/                # Hook tests
│   ├── useAuth.test.tsx  # Auth hook tests
│   └── ...               # Other hook tests
├── firebase/             # Firebase-specific tests
│   ├── auth.test.ts      # Authentication functions tests
│   └── ...               # Other Firebase service tests
└── jest.setup.js         # Jest setup and global mocks
```

## Test Implementation Approach

### UI Component Testing

1. Component tests use React Testing Library
2. Test rendering, props, user interactions, and state changes
3. Mock dependencies to isolate components
4. Focus on testing component behavior rather than implementation details

### Firebase Service Testing

1. Firebase services are mocked in tests to avoid actual Firebase calls
2. Auth functions testing mocks Firebase authentication operations
3. Firestore testing focuses on data manipulation logic
4. Integration tests may use Firebase emulators (future implementation)

### Hook Testing

1. Custom hooks are tested using `@testing-library/react-hooks`
2. Firebase dependencies are mocked in hook tests
3. Tests cover all major state and lifecycle cases

### Testing Configuration

1. Jest configuration in `jest.config.js`
2. Setup file in `jest.setup.js` with global mocks and polyfills
3. Type augmentation for Jest matchers with `@testing-library/jest-dom`
4. Module path mapping to match Next.js configuration

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