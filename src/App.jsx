// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Student Pages
import LandingPage from "./pages/LandingPage";
import StudentDashboard from "./pages/StudentDashboard";
import PredictorDashboard from "./pages/PredictorDashboard";
import Assessment from "./components/assessments/Assessment";
import Survey from "./pages/Survey";
import DebugUserData from "./pages/DebugUserData";
import CareerMatches from "./pages/CareerMatches";
import CareerReports from "./pages/CareerReports";
import CareerOverview from "./pages/CareerOverview";
import LearningPath from "./pages/LearningPath";
import ResumeBuilder from "./pages/ResumeBuilder";
import StudentSettings from "./pages/student/StudentSettings";
import NotificationsPage from "./pages/student/NotificationsPage";
import StudentMessaging from "./pages/student/StudentMessaging";
import ResetPassword from "./pages/ResetPassword";

// NEW: Profile and Assessment Flow
import ProfileSurvey from "./pages/ProfileSurvey";
import ProfileView from "./pages/ProfileView";
import AcademicTestsList from "./pages/AcademicTestsList";
import AcademicAssessmentsList from "./pages/AcademicAssessmentsList";
import TechnicalAssessmentsList from "./pages/TechnicalAssessmentsList";
import TechnicalAssessmentRouter from "./pages/TechnicalAssessmentRouter";
import AssessmentDebugger from "./pages/AssessmentDebugger";

// Career Roadmap Pages
import CareerRoadmap from "./pages/CareerRoadmap";
import ModuleLearning from "./pages/ModuleLearning";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentsList from "./pages/admin/StudentsList";
import StudentsAnalytics from "./pages/admin/StudentsAnalytics";
import CareerAnalytics from "./pages/admin/CareerAnalytics";
import AssessmentManagement from "./pages/admin/AssessmentManagement";
import StudentDetails from "./pages/admin/StudentDetails";
import StudentImpersonation from "./pages/admin/StudentImpersonation";
import SystemSettings from "./pages/admin/SystemSettings";
import ResourcesManagement from "./pages/admin/ResourcesManagement";
import AdminMessaging from "./pages/admin/AdminMessaging";
import EmployersList from "./pages/admin/EmployersList";
import EmployerVerificationPage from "./pages/admin/EmployerVerification";
import MigrationGuide from "./pages/admin/MigrationGuide";
import DatasetViewer from "./pages/admin/DatasetViewer";

// Employer Pages
import EmployerLandingPage from "./pages/employer/EmployerLandingPage";
import EmployerLogin from "./pages/employer/EmployerLogin";
import EmployerSignup from "./pages/employer/EmployerSignup";
import EmployerVerification from "./pages/employer/EmployerVerification";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import BrowseStudents from "./pages/employer/BrowseStudents";
import StudentDetail from "./pages/employer/StudentDetail";
import SavedStudents from "./pages/employer/SavedStudents";
import EmployerSettings from "./pages/employer/EmployerSettings";

// Scripts
import FirebaseInitializer from "./scripts/runInitialization";
import UploadCodingChallenge from "./pages/UploadCodingChallenge";
import AssessmentDebug from "./pages/AssessmentDebug";

// Auth Components
import RequireAuth from "./components/RequireAuth";
import { AdminProvider, useAdmin } from "./contexts/AdminContext";
import { EmployerProvider, useEmployer } from "./contexts/EmployerContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Admin Auth Guard Component
function RequireAdmin({ children }) {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-950 to-black">
        <Loader2 className="animate-spin text-primary-400" size={48} />
      </div>
    );
  }

  return admin ? children : <Navigate to="/admin/login" replace />;
}

// Employer Auth Guard Component
function RequireEmployer({ children }) {
  const { employer, loading } = useEmployer();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-950 to-black">
        <Loader2 className="animate-spin text-blue-400" size={48} />
      </div>
    );
  }

  return employer ? children : <Navigate to="/employer/login" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <EmployerProvider>
          <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/predictor" element={<PredictorDashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        
        {/* Students List - Simple management view */}
        <Route
          path="/admin/students"
          element={
            <RequireAdmin>
              <StudentsList />
            </RequireAdmin>
          }
        />
        
        {/* Analytics - Deep analytics with charts */}
        <Route
          path="/admin/analytics"
          element={
            <RequireAdmin>
              <StudentsAnalytics />
            </RequireAdmin>
          }
        />

        {/* Career Analytics - Career path selections */}
        <Route
          path="/admin/career-analytics"
          element={
            <RequireAdmin>
              <CareerAnalytics />
            </RequireAdmin>
          }
        />

        {/* Individual Student Details */}
        <Route
          path="/admin/student/:studentId"
          element={
            <RequireAdmin>
              <StudentDetails />
            </RequireAdmin>
          }
        />

        {/* Student Impersonation - Take Assessments on Behalf */}
        <Route
          path="/admin/students/impersonate/:studentId"
          element={
            <RequireAdmin>
              <StudentImpersonation />
            </RequireAdmin>
          }
        />

        {/* Assessment Management */}
        <Route
          path="/admin/assessments"
          element={
            <RequireAdmin>
              <AssessmentManagement />
            </RequireAdmin>
          }
        />
        
        {/* Messaging */}
        <Route
          path="/admin/messaging"
          element={
            <RequireAdmin>
              <AdminMessaging />
            </RequireAdmin>
          }
        />

        {/* System Settings */}
        <Route
          path="/admin/settings"
          element={
            <RequireAdmin>
              <SystemSettings />
            </RequireAdmin>
          }
        />

        <Route path="/admin/resources" element={<ResourcesManagement />} />

        {/* Migration & Dataset Routes */}
        <Route
          path="/admin/migration-guide"
          element={
            <RequireAdmin>
              <MigrationGuide />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/dataset-viewer"
          element={
            <RequireAdmin>
              <DatasetViewer />
            </RequireAdmin>
          }
        />

        {/* Employer Management */}
        <Route
          path="/admin/employers"
          element={
            <RequireAdmin>
              <EmployersList />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/employer-verification"
          element={
            <RequireAdmin>
              <EmployerVerificationPage />
            </RequireAdmin>
          }
        />

        {/* Firebase Initializer - Development Tool */}
        <Route path="/initialize-firebase" element={<FirebaseInitializer />} />

        {/* Upload Coding Challenge - Temporary Route */}
        <Route path="/upload-coding-challenge" element={<UploadCodingChallenge />} />

        {/* Assessment Debug - Temporary Route */}
        <Route path="/assessment-debug" element={<AssessmentDebug />} />
        <Route path="/assessment-debugger" element={<AssessmentDebugger />} />

        {/* Protected Student Routes */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <StudentDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/debug-data"
          element={
            <RequireAuth>
              <DebugUserData />
            </RequireAuth>
          }
        />
        
        <Route 
          path="/dashboard/resume" 
          element={
            <RequireAuth>
              <ResumeBuilder />
            </RequireAuth>
          } 
        />

        {/* Student Settings Route */}
        <Route
          path="/student/settings"
          element={
            <RequireAuth>
              <StudentSettings />
            </RequireAuth>
          }
        />

        {/* Student Notifications Route */}
        <Route
          path="/student/notifications"
          element={
            <RequireAuth>
              <NotificationsPage />
            </RequireAuth>
          }
        />

        {/* Student Messaging Route */}
        <Route
          path="/student/messaging"
          element={
            <RequireAuth>
              <StudentMessaging />
            </RequireAuth>
          }
        />

        {/* Student Profile Route (if you want to add this later) */}
        <Route
          path="/student/profile"
          element={
            <RequireAuth>
              <StudentSettings />
            </RequireAuth>
          }
        />

        {/* NEW: Profile and Assessment Flow Routes */}
        <Route
          path="/profile-survey"
          element={
            <RequireAuth>
              <ProfileSurvey />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfileView />
            </RequireAuth>
          }
        />

        <Route
          path="/academic-tests"
          element={
            <RequireAuth>
              <AcademicTestsList />
            </RequireAuth>
          }
        />

        <Route
          path="/academic-assessments"
          element={
            <RequireAuth>
              <AcademicAssessmentsList />
            </RequireAuth>
          }
        />

        <Route
          path="/technical-assessments"
          element={
            <RequireAuth>
              <TechnicalAssessmentsList />
            </RequireAuth>
          }
        />

        <Route
          path="/technical-assessment/:id"
          element={
            <RequireAuth>
              <TechnicalAssessmentRouter />
            </RequireAuth>
          }
        />

        {/* Redirect old /assessments route to academic assessments */}
        <Route
          path="/assessments"
          element={<Navigate to="/academic-assessments" replace />}
        />

        <Route
          path="/assessments/:subjectId"
          element={
            <RequireAuth>
              <Assessment collectionName="assessments" />
            </RequireAuth>
          }
        />

        <Route
          path="/technical-assessments/:subjectId"
          element={
            <RequireAuth>
              <Assessment collectionName="technicalAssessments" />
            </RequireAuth>
          }
        />

        {/* Surveys */}
        <Route
          path="/survey/technical/:id"
          element={
            <RequireAuth>
              <Survey collectionName="technicalAssessments" />
            </RequireAuth>
          }
        />

        <Route
          path="/survey/personal/:id"
          element={
            <RequireAuth>
              <Survey collectionName="personalAssessments" />
            </RequireAuth>
          }
        />

        {/* Career Management */}
        <Route
          path="/career-matches"
          element={
            <RequireAuth>
              <CareerMatches />
            </RequireAuth>
          }
        />

        <Route
          path="/student/reports"
          element={
            <RequireAuth>
              <CareerReports />
            </RequireAuth>
          }
        />

        <Route
          path="/student/progress"
          element={
            <RequireAuth>
              <CareerOverview />
            </RequireAuth>
          }
        />

        <Route
          path="/student/learning-path"
          element={
            <RequireAuth>
              <LearningPath />
            </RequireAuth>
          }
        />

        {/* Career Roadmap Routes */}
        <Route
          path="/career-roadmap"
          element={
            <RequireAuth>
              <CareerRoadmap />
            </RequireAuth>
          }
        />
        
        <Route
          path="/career-roadmap/:roadmapId/module/:moduleId"
          element={
            <RequireAuth>
              <ModuleLearning />
            </RequireAuth>
          }
        />

        {/* Employer Routes */}
        <Route path="/employers" element={<EmployerLandingPage />} />
        <Route path="/employer/login" element={<EmployerLogin />} />
        <Route path="/employer/signup" element={<EmployerSignup />} />

        {/* Protected Employer Routes */}
        <Route
          path="/employer/verification"
          element={
            <RequireEmployer>
              <EmployerVerification />
            </RequireEmployer>
          }
        />

        <Route
          path="/employer/dashboard"
          element={
            <RequireEmployer>
              <EmployerDashboard />
            </RequireEmployer>
          }
        />

        <Route
          path="/employer/browse-students"
          element={
            <RequireEmployer>
              <BrowseStudents />
            </RequireEmployer>
          }
        />

        <Route
          path="/employer/student/:id"
          element={
            <RequireEmployer>
              <StudentDetail />
            </RequireEmployer>
          }
        />

        <Route
          path="/employer/saved-students"
          element={
            <RequireEmployer>
              <SavedStudents />
            </RequireEmployer>
          }
        />

        <Route
          path="/employer/settings"
          element={
            <RequireEmployer>
              <EmployerSettings />
            </RequireEmployer>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </EmployerProvider>
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;