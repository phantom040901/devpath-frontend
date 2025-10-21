// src/hooks/useUserPresence.js
import { useEffect, useState } from 'react';
import { ref, set, onValue, onDisconnect, serverTimestamp } from 'firebase/database';
import { realtimeDb } from '../lib/firebase';
import { useAuth } from '../components/AuthContext';

/**
 * Custom hook to track user presence in Firebase Realtime Database
 * Automatically handles connection/disconnection and cleanup
 */
export function useUserPresence() {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Reference to this user's presence
    const userStatusRef = ref(realtimeDb, `presence/${user.uid}`);

    // Reference to all online users
    const onlineUsersRef = ref(realtimeDb, 'presence');

    // Set user as online
    const userPresenceData = {
      uid: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Anonymous',
      email: user.email,
      status: 'online',
      lastSeen: serverTimestamp(),
    };

    // Set the user as online
    set(userStatusRef, userPresenceData).catch((error) => {
      console.error('Error setting user presence:', error);
    });

    // When user disconnects, remove them from presence
    onDisconnect(userStatusRef).remove();

    // Listen to all online users count
    const unsubscribe = onValue(onlineUsersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const count = Object.keys(data).length;
        setOnlineUsers(count);
      } else {
        setOnlineUsers(0);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      // Remove user from presence when component unmounts
      set(userStatusRef, null).catch((error) => {
        console.error('Error removing user presence:', error);
      });
    };
  }, [user]);

  return { onlineUsers };
}

/**
 * Hook to get online users count without setting current user as online
 * Useful for displaying count on landing page or admin dashboard
 */
export function useOnlineUsersCount() {
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const onlineUsersRef = ref(realtimeDb, 'presence');

    const unsubscribe = onValue(onlineUsersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const count = Object.keys(data).length;
        setOnlineUsers(count);
      } else {
        setOnlineUsers(0);
      }
    });

    return () => unsubscribe();
  }, []);

  return { onlineUsers };
}
