// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            setUser({ uid: firebaseUser.uid, ...snap.data() });
          } else {
            // fallback if Firestore doc not found
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              firstName: firebaseUser.displayName?.split(" ")[0] || "User",
            });
          }
        } catch (err) {
          console.error("❌ Error fetching Firestore profile:", err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ✅ Signup with Firestore profile and welcome email
  const signup = async (email, password, extraData = {}) => {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Prepare user data for Firestore
      const userData = {
        uid: newUser.uid,
        email: email,
        firstName: extraData.firstName || "",
        lastName: extraData.lastName || "",
        course: extraData.course || "",
        yearLevel: extraData.yearLevel || "",
        createdAt: new Date().toISOString(),
        emailVerified: true, // Set to true since OTP verified
        assessmentsCompleted: [],
        careerPath: null,
        progress: {
          technical: 0,
          personal: 0,
          overall: 0,
        },
        ...extraData,
      };

      // Store user data in Firestore
      await setDoc(doc(db, "users", newUser.uid), userData);

      // Update Firebase Auth profile
      if (extraData.firstName) {
        await updateProfile(newUser, {
          displayName: `${extraData.firstName} ${extraData.lastName || ""}`.trim(),
        });
      }

      // Welcome email removed - OTP verification already confirms email
      console.log("✅ Account created successfully - OTP verified");

      return newUser;
    } catch (error) {
      console.error("❌ Signup error:", error);
      
      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        throw new Error("This email is already registered. Please sign in instead.");
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password should be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address.");
      } else {
        throw new Error(error.message || "Failed to create account. Please try again.");
      }
    }
  };

  // ✅ Login with error handling
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error("❌ Login error:", error);
      
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address.");
      } else if (error.code === "auth/too-many-requests") {
        throw new Error("Too many failed login attempts. Please try again later.");
      } else if (error.code === "auth/invalid-credential") {
        throw new Error("Invalid email or password.");
      } else {
        throw new Error(error.message || "Failed to sign in. Please try again.");
      }
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("❌ Logout error:", error);
      throw new Error("Failed to log out. Please try again.");
    }
  };

  // ✅ Update user profile data
  const updateUserProfile = async (updates) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setUser((prev) => ({ ...prev, ...updates }));
      
      return true;
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      throw new Error("Failed to update profile. Please try again.");
    }
  };

  // ✅ Refresh user data from Firestore
  const refreshUserData = async () => {
    if (!auth.currentUser) return;

    try {
      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUser({ uid: auth.currentUser.uid, ...snap.data() });
      }
    } catch (error) {
      console.error("❌ Error refreshing user data:", error);
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUserProfile,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}