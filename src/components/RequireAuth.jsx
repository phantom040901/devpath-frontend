import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { subscribeToMaintenanceMode } from "../services/systemSettingsService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import MaintenancePage from "../pages/MaintenancePage";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [checkingMaintenance, setCheckingMaintenance] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [bypassMaintenance, setBypassMaintenance] = useState(false);

  // Check user role, bypass permission and subscribe to maintenance mode
  useEffect(() => {
    if (!user) {
      setCheckingMaintenance(false);
      return;
    }

    // Get user role and bypass permission
    const getUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);
          setBypassMaintenance(userData.bypassMaintenance || false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();

    // Subscribe to real-time maintenance mode updates
    const unsubscribe = subscribeToMaintenanceMode((status) => {
      setMaintenanceMode(status.enabled);
      setCheckingMaintenance(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Show loading while checking authentication and maintenance status
  if (loading || checkingMaintenance) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing page if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Show maintenance page if maintenance mode is enabled (unless user is admin or has bypass permission)
  if (maintenanceMode && userRole !== 'admin' && !bypassMaintenance) {
    return <MaintenancePage />;
  }

  // Everything OK - render the protected content
  return children;
}
