// src/services/storageService.js
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../lib/firebase';

/**
 * Upload profile picture to Firebase Storage
 * @param {string} userId - User's ID
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} Download URL of uploaded image
 */
export const uploadProfilePicture = async (userId, file) => {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPG, PNG, or WEBP image.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Create reference to storage location
    const storageRef = ref(storage, `profilePictures/${userId}/profile.jpg`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update user document in Firestore with new profile picture URL
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      profilePictureURL: downloadURL,
      updatedAt: new Date()
    });

    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

/**
 * Delete profile picture from Firebase Storage
 * @param {string} userId - User's ID
 * @returns {Promise<void>}
 */
export const deleteProfilePicture = async (userId) => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}/profile.jpg`);
    
    // Delete from storage
    await deleteObject(storageRef);
    
    // Update user document to remove profile picture URL
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      profilePictureURL: null,
      updatedAt: new Date()
    });

    return { success: true, message: 'Profile picture deleted successfully' };
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      // Image doesn't exist, just update Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        profilePictureURL: null,
        updatedAt: new Date()
      });
      return { success: true, message: 'Profile picture removed' };
    }
    console.error('Error deleting profile picture:', error);
    throw error;
  }
};