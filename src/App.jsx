// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Student Pages
import LandingPage from "./pages/LandingPage";
import StudentDashboard from "./pages/StudentDashboard";
import PredictorDashboard from "./pages/PredictorDashboard";
import AssessmentsList from "./pages/AssessmentsList";
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

// Career Roadmap Pages
import CareerRoadmap from "./pages/CareerRoadmap";
import ModuleLearning from "./pages/ModuleLearning";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentsList from "./pages/admin/StudentsList";
import StudentsAnalytics from "./pages/admin/StudentsAnalytics";
import AssessmentManagement from "./pages/admin/AssessmentManagement";
import StudentDetails from "./pages/admin/StudentDetails";
import SystemSettings from "./pages/admin/SystemSettings";
import ResourcesManagement from "./pages/admin/ResourcesManagement";
import AdminMessaging from "./pages/admin/AdminMessaging";

// Scripts
import FirebaseInitializer from "./scripts/runInitialization";

// Auth Components
import RequireAuth from "./components/RequireAuth";
import { AdminProvider, useAdmin } from "./contexts/AdminContext";
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

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
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
        
        {/* Individual Student Details */}
        <Route
          path="/admin/student/:studentId"
          element={
            <RequireAdmin>
              <StudentDetails />
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

        {/* Firebase Initializer - Development Tool */}
        <Route path="/initialize-firebase" element={<FirebaseInitializer />} />

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

        <Route
          path="/assessments"
          element={
            <RequireAuth>
              <AssessmentsList />
            </RequireAuth>
          }
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

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;