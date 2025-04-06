# CreatorSync

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<!-- Optional: Add more badges like build status, coverage, etc. -->
<!-- E.g., [![Build Status](https://img.shields.io/github/actions/workflow/status/<your-github-username>/CreatorSync/<your-workflow-file.yml>?branch=main)](https://github.com/<your-github-username>/CreatorSync/actions) -->

<!-- Placeholder Banner Removed -->

**Effortlessly manage and synchronize your content across TikTok, Instagram Reels, and X (formerly Twitter).**

CreatorSync is a web platform designed to streamline the workflow for content creators who publish across multiple short-form video and social media platforms. It provides a centralized dashboard to upload, manage, schedule, publish (manually), and analyze content performance, saving creators time and helping them maintain a consistent online presence.

## The Problem

Managing content across platforms like TikTok, Instagram, and X is time-consuming and fragmented. Creators face challenges such as:

*   Manually uploading the same content multiple times.
*   Inconsistent posting schedules.
*   Difficulty tracking performance metrics across different platforms.
*   Maintaining brand consistency.

## The Solution: CreatorSync

CreatorSync aims to solve these problems by offering:

*   **Centralized Content Hub:** Upload and manage all your video and text content in one place.
*   **Multi-Platform Scheduling:** Plan and schedule posts via a dedicated Cloud Function.
*   **Manual Publishing:** Trigger publishing actions to update content status (actual platform integration pending).
*   **Platform Connection Management:** View connected platforms (OAuth flow pending).
*   **Unified Analytics (Basic):** View aggregated views, likes, and comments on the dashboard.
*   **Profile Management:** Manage your CreatorSync profile settings.

## Key Features (Implemented)

*   **Authentication:** Secure user login and registration (Firebase Auth).
    <!-- Placeholder Image Removed -->
*   **Dashboard:** Overview of key metrics (views, likes, comments, estimated earnings - placeholders) using `StatCard`.
    <!-- Placeholder Image Removed -->
*   **Content Management:**
    *   View user-specific content in a list (`ContentList`).
    *   Upload new content (video/image) with title, description, and platform selection (`CreateContentPage`, `CreateContentForm`).
    *   File uploads to Firebase Storage with progress indicator.
    *   Edit existing content (page structure exists, needs data loading/saving logic - `/dashboard/edit/[contentId]`).
    *   Delete content with confirmation (via API route).
    *   "Like" content (via API route, optimistic UI update).
    <!-- Placeholder Image Removed -->
*   **Content Publishing & Scheduling:**
    *   Manually trigger a "Publish" action via API route (`/api/content/[contentId]/publish`) to update status.
    *   Schedule content for future publication using a datetime input.
    *   Scheduled Cloud Function (`publishScheduler`) runs periodically to find due content and update status to 'published'.
*   **Platform Settings:** View connected platforms and their status (`/dashboard/settings/platforms`).
*   **User Profile:** Basic display of user information (integrated into Dashboard/Navbar).
*   **Notifications:** User feedback via `react-hot-toast`.

## Planned Features / Next Steps

*   Implement actual OAuth flows for connecting external platforms (TikTok, Instagram, X).
*   Integrate platform-specific APIs for direct publishing within the API routes and Cloud Function.
*   Implement content editing functionality (loading/saving data on edit page).
*   Develop comprehensive analytics dashboard with charts and detailed breakdowns.
*   Add robust testing suites (Unit, Integration with Emulators, E2E).
*   Refine UI/UX and error handling.
*   Deployment configuration (CI/CD).

## Tech Stack

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Jest](https://img.shields.io/badge/-Jest-brightgreen?style=for-the-badge&logo=jest&logoColor=white)
![React Testing Library](https://img.shields.io/badge/React_Testing_Library-E33332?style=for-the-badge&logo=testing-library&logoColor=white)

*   **Framework:** [Next.js](https://nextjs.org/) (v14+ with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** Custom components + [Lucide React](https://lucide.dev/) (icons)
*   **Backend & Database:** [Firebase](https://firebase.google.com/)
    *   Authentication
    *   Firestore (Database)
    *   Cloud Storage (File Uploads)
    *   Cloud Functions (Scheduled Publishing)
    *   Firebase Admin SDK (for backend operations)
*   **State Management:** React Context API (`useAuth`, `useNotifications`)
*   **Notifications:** [React Hot Toast](https://react-hot-toast.com/)
*   **Bundle Analysis:** [@next/bundle-analyzer](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer)
*   **Testing (Setup In Place):**
    *   [Jest](https://jestjs.io/)
    *   [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
    *   Firebase Emulator Suite

## Project Structure

```
CreatorSync/
├── .github/          # GitHub Actions workflows (optional)
├── .vscode/          # VSCode settings (optional)
├── documentation/    # Project documentation (e.g., architecture.md)
├── memory-bank/      # Persistent memory for AI assistant
├── node_modules/
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js App Router (Pages, API Routes, Layouts)
│   │   ├── api/      # API route handlers
│   │   ├── dashboard/ # Protected dashboard pages
│   │   ├── (auth)/   # Route group for auth pages (login, signup)
│   │   ├── layout.tsx # Root server layout
│   │   └── page.tsx  # Root page (e.g., homepage or redirect)
│   ├── components/   # React components (UI, common, features)
│   │   ├── auth/
│   │   ├── common/
│   │   ├── content/
│   │   ├── layout/
│   │   └── ...
│   ├── contexts/     # React context providers (Auth, Notifications)
│   ├── firebase/     # Firebase configuration and services
│   │   ├── admin.ts  # Admin SDK initialization
│   │   ├── config.ts # Client SDK initialization
│   │   ├── content.ts# Firestore CRUD for content
│   │   └── functions/# Cloud Functions source
│   │       ├── index.ts
│   │       └── scheduledPublish.ts
│   ├── hooks/        # Custom React hooks (if any)
│   ├── models/       # TypeScript interfaces/types (Content, User, etc.)
│   ├── services/     # Client-side service wrappers (e.g., storage)
│   ├── styles/       # Global styles (globals.css)
│   └── utils/        # Utility functions
├── .env.local        # Local environment variables (!!! DO NOT COMMIT !!!)
├── .gitignore
├── firebase.json     # Firebase project config (Hosting, Functions, Emulators)
├── firestore.rules
├── storage.rules
├── next.config.mjs   # Next.js configuration
├── package.json
├── README.md         # This file
└── tsconfig.json
```

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [Firebase Account](https://console.firebase.google.com/)
*   [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli): `npm install -g firebase-tools`
*   [Java JDK](https://www.oracle.com/java/technologies/downloads/): Required for Firebase Emulators.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd CreatorSync
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Firebase Setup

1.  **Create Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Services:** In your Firebase project, enable:
    *   **Authentication:** Add the "Email/Password" sign-in provider.
    *   **Firestore Database:** Create a Firestore database (start in production or test mode).
    *   **Storage:** Create a Cloud Storage bucket.
3.  **Register Web App:** In Project Settings > General, register a new Web App. Copy the `firebaseConfig` object provided.
4.  **Configure Environment Variables:**
    *   Create a file named `.env.local` in the root directory.
    *   Add your Firebase web app configuration keys to `.env.local`:
        ```plaintext
        NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
        NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id # Optional
        ```
5.  **Admin SDK Credentials (for API Routes/Functions):**
    *   **Deployed Environment (e.g., Vercel, Cloud Run):** Ensure the environment has default Google Cloud credentials set up.
    *   **Local Development (Emulators Recommended):** The Admin SDK in `src/firebase/admin.ts` is set up to work automatically with running emulators.
    *   **Local Development (Without Emulators):** Go to Project Settings > Service accounts > Generate new private key. Download the JSON file. **DO NOT COMMIT THIS FILE.** Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable in your terminal or `.env.local` to the *absolute path* of this downloaded key file.
        ```plaintext
        # Add to .env.local if running locally without emulators
        # GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/serviceAccountKey.json
        ```
6.  **Configure Firebase Project:**
    *   Login to the Firebase CLI: `firebase login`
    *   Associate your local project: `firebase use --add` and select your Firebase project ID.

### Running Locally

1.  **Start Firebase Emulators (Recommended):**
    ```bash
    firebase emulators:start
    ```
    *   This starts local emulators for Auth, Firestore, Storage, and Functions.
    *   The app (`src/firebase/config.ts`) and Admin SDK (`src/firebase/admin.ts`) are configured to automatically connect to these emulators when detected.

2.  **Run the Next.js Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

*   `npm run dev`: Starts the development server (with hot reloading).
*   `npm run build`: Creates a production build.
*   `npm run start`: Starts the production server (requires `build` first).
*   `npm run lint`: Lints the codebase using Next.js ESLint config.
*   `npm test`: Runs Jest tests.
*   `npm run analyze`: Builds the app and runs the bundle analyzer.
*   `firebase emulators:start`: Starts the Firebase emulators.
*   `firebase deploy --only functions`: Deploys Cloud Functions.
*   `firebase deploy --only firestore:rules`: Deploys Firestore rules.
*   `firebase deploy --only storage:rules`: Deploys Storage rules.
*   `firebase deploy`: Deploys hosting, functions, rules, etc., as configured in `firebase.json`.

## Testing

*   **Unit/Integration Tests:** Run with `npm test`. Uses Jest and React Testing Library. Tests interacting with Firebase should utilize the running emulators.
*   **(Planned) E2E Tests:** Cypress setup is intended (`package.json` scripts exist) but tests need to be written.

## Contributing

Contributions are welcome! Please follow standard fork/pull request workflow. Ensure tests pass and linting is clean before submitting PRs.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (assuming you add one). 