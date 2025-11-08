// src/contexts/EmployerContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const EmployerContext = createContext();

export function EmployerProvider({ children }) {
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const ref = doc(db, "employers", firebaseUser.uid);
          const snap = await getDoc(ref);

          if (snap.exists() && snap.data().role === "employer") {
            setEmployer({ uid: firebaseUser.uid, ...snap.data() });
          } else {
            setEmployer(null);
          }
        } catch (err) {
          console.error("❌ Error fetching employer profile:", err);
          setEmployer(null);
        }
      } else {
        setEmployer(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Employer Signup
  const signupEmployer = async (email, password, employerData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      const employerProfile = {
        uid: newUser.uid,
        email: email,
        role: "employer",
        companyName: employerData.companyName,
        companyWebsite: employerData.companyWebsite,
        industry: employerData.industry,
        companySize: employerData.companySize,
        contactPerson: employerData.contactPerson,
        contactPhone: employerData.contactPhone,
        verificationStatus: "pending", // pending, tier1_verified, tier2_verified, rejected
        verificationStep: 1, // Current step in verification process
        createdAt: new Date().toISOString(),
        emailVerified: false,
        documents: [],
      };

      await setDoc(doc(db, "employers", newUser.uid), employerProfile);

      console.log("✅ Employer account created successfully");
      return newUser;
    } catch (error) {
      console.error("❌ Employer signup error:", error);

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

  // Employer Login
  const loginEmployer = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Verify this is an employer account
      const ref = doc(db, "employers", userCredential.user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists() || snap.data().role !== "employer") {
        await signOut(auth);
        throw new Error("No employer account found with these credentials.");
      }

      return userCredential;
    } catch (error) {
      console.error("❌ Employer login error:", error);

      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password.");
      } else if (error.code === "auth/invalid-credential") {
        throw new Error("Invalid email or password.");
      } else if (error.code === "auth/too-many-requests") {
        throw new Error("Too many failed login attempts. Please try again later.");
      } else {
        throw error;
      }
    }
  };

  // Logout
  const logoutEmployer = async () => {
    try {
      await signOut(auth);
      setEmployer(null);
    } catch (error) {
      console.error("❌ Employer logout error:", error);
      throw new Error("Failed to log out. Please try again.");
    }
  };

  // Update Employer Profile
  const updateEmployerProfile = async (updates) => {
    if (!employer) {
      throw new Error("No employer logged in");
    }

    try {
      const employerRef = doc(db, "employers", employer.uid);
      await updateDoc(employerRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      setEmployer((prev) => ({ ...prev, ...updates }));
      return true;
    } catch (error) {
      console.error("❌ Error updating employer profile:", error);
      throw new Error("Failed to update profile. Please try again.");
    }
  };

  // Refresh Employer Data
  const refreshEmployerData = async () => {
    if (!auth.currentUser) return;

    try {
      const ref = doc(db, "employers", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().role === "employer") {
        setEmployer({ uid: auth.currentUser.uid, ...snap.data() });
      }
    } catch (error) {
      console.error("❌ Error refreshing employer data:", error);
    }
  };

  const value = {
    employer,
    loading,
    signupEmployer,
    loginEmployer,
    logoutEmployer,
    updateEmployerProfile,
    refreshEmployerData,
  };

  return (
    <EmployerContext.Provider value={value}>
      {!loading && children}
    </EmployerContext.Provider>
  );
}

export function useEmployer() {
  const context = useContext(EmployerContext);
  if (!context) {
    throw new Error("useEmployer must be used within an EmployerProvider");
  }
  return context;
}
