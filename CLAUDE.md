# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevPath is a career guidance platform for students, specifically focused on development and cybersecurity career paths. The application helps students:
- Take assessments (academic, technical, and personal)
- Receive AI-powered career recommendations
- Access personalized learning roadmaps
- Track progress and generate career reports
- Build resumes tailored to their career path

**Tech Stack:** React 19, Vite, Tailwind CSS 4, Firebase (Authentication, Firestore, Cloud Functions), Framer Motion, React Router 7

## Development Commands

```bash
# Start development server (automatically opens browser)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Architecture Overview

### Application Structure

The app follows a dual-user architecture:
1. **Student Portal** - Main application for students
2. **Admin Portal** - Management dashboard for administrators

### Key Architectural Patterns

**Authentication Flow:**
- Firebase Authentication for user management
- `AuthContext` (src/components/AuthContext.jsx) provides auth state via React Context
- `RequireAuth` component guards protected student routes
- `AdminContext` + `RequireAdmin` component guards admin routes
- Separate admin authentication via `src/lib/adminAuth.js`

**Data Management:**
- Firestore collections:
  - `users` - Student profiles and metadata
  - `users/{uid}/results` - Assessment results per student
  - `users/{uid}/selectedCareer/current` - Student's chosen career path
  - `assessments` - Academic assessments
  - `technicalAssessments` - Technical skill assessments
  - `personalAssessments` - Personality/interest surveys
  - `roadmapProgress` - Learning roadmap completion tracking
  - `admins` - Admin user credentials

**Routing Structure:**
- Public routes: Landing page (`/`), Career predictor (`/predictor`)
- Student routes (protected): Dashboard, assessments, career matches, roadmap, reports, settings
- Admin routes (protected): Dashboard, student management, analytics, assessment management, system settings
- All routes defined in `src/App.jsx`

### Core Features & Components

**Student Features:**
1. **Assessment System** (`src/components/assessments/Assessment.jsx`)
   - Dynamic assessment loader supporting multiple collections
   - Progress tracking and result storage
   - Question shuffling utility (`src/utils/shuffle.js`)

2. **Career Matching** (`src/pages/CareerMatches.jsx`)
   - AI-powered career recommendations based on assessment results
   - Career selection stored in Firestore subcollection

3. **Learning Roadmap** (`src/pages/CareerRoadmap.jsx`, `src/pages/ModuleLearning.jsx`)
   - Personalized learning paths for selected careers
   - Module-based progression system
   - Progress tracking with completion states

4. **Student Dashboard** (`src/pages/StudentDashboard.jsx`)
   - Overview of career path, progress stats, and recommendations
   - Real-time data aggregation from Firestore
   - Quick actions and navigation

5. **Reports & Analytics** (`src/pages/CareerReports.jsx`)
   - Career insights and progress reports
   - PDF export functionality (`src/utils/certificateGenerator.js`)

**Admin Features:**
1. **Student Management** (`src/pages/admin/StudentsList.jsx`, `src/pages/admin/StudentDetails.jsx`)
   - View and manage all registered students
   - Detailed student profiles with assessment history

2. **Analytics Dashboard** (`src/pages/admin/StudentsAnalytics.jsx`)
   - Charts and visualizations using Chart.js/Recharts
   - Student performance metrics

3. **Assessment Management** (`src/pages/admin/AssessmentManagement.jsx`)
   - Create/edit/delete assessments across all collections

4. **Resource Management** (`src/pages/admin/ResourcesManagement.jsx`)
   - Manage learning resources and roadmap content

### Context Providers

The app uses multiple context providers (wrap hierarchy in `src/Main.jsx`):
- `AuthProvider` - User authentication state
- `AdminProvider` - Admin authentication state
- `ModalContextProvider` - Modal management for landing page
- `MobileMenuContextProvider` - Mobile navigation state

### Utility Functions

- `src/utils/assessmentUnlock.js` - Logic for unlocking assessments based on completion
- `src/utils/assessmentCompletionHandler.js` - Handles assessment submission and result storage
- `src/utils/careerRoadmapExport.js` - Export roadmap data
- `src/utils/learningResourcesExport.js` - Export learning resources
- `src/utils/content.js` - Static content and data

### Styling

- **Tailwind CSS 4** with Vite plugin (`@tailwindcss/vite`)
- Custom color scheme: `primary-*` shades (defined in Tailwind config)
- Dark theme with gradient backgrounds (`from-primary-1400 via-primary-1500 to-black`)
- **Framer Motion** for animations and transitions

## Firebase Configuration

Firebase config is initialized in `src/lib/firebase.js`. The app uses:
- **Authentication** - Email/password auth with profile management
- **Firestore** - All data storage
- **Cloud Functions** - Defined in `functions/` directory (e.g., welcome emails)

Firebase deployment config in `firebase.json`.

## Important Development Notes

**When working with assessments:**
- Assessments are stored in three collections: `assessments`, `technicalAssessments`, `personalAssessments`
- Results are stored per user in subcollections: `users/{uid}/results/{resultId}`
- Assessment unlocking logic is sequential - ensure proper ordering

**When working with career paths:**
- Career selection is stored in `users/{uid}/selectedCareer/current` document
- Roadmap progress tracked separately in `roadmapProgress/{uid}` collection
- Always validate career selection exists before showing roadmap

**When working with admin features:**
- Admin authentication is separate from student auth
- Use `AdminContext` and `useAdmin()` hook for admin state
- Admin routes require `RequireAdmin` wrapper

**Data fetching patterns:**
- Use `useAuth()` hook to get current user
- Always check if user exists before Firestore queries
- Handle loading states for better UX
- Use `refreshUserData()` from AuthContext after profile updates

## Entry Point

The application bootstraps from `src/main.jsx`, which renders the `<App />` component wrapped in necessary providers.
