// authFunctions.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Sign up new user
export const signUpUser = async (email, password, userData) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      uid: user.uid,
      createdAt: new Date().toISOString(),
      ...userData // age, location, profession, etc.
    });
    
    return { success: true, user: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in existing user
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current user data from Firestore
export const getCurrentUserData = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, userData: docSnap.data() };
    } else {
      return { success: false, error: "User data not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen for authentication state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Change user password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "No user is currently signed in" };
    }

    // Reauthenticate user with current password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Request admin access
export const requestAdminAccess = async (userId, userData) => {
  try {
    // Update user document with admin request timestamp
    await updateDoc(doc(db, 'users', userId), {
      adminAccessRequested: true,
      adminRequestDate: new Date().toISOString(),
      adminRequestStatus: 'pending'
    });

    // Optionally, create a separate admin requests collection for tracking
    await setDoc(doc(db, 'adminRequests', userId), {
      userId: userId,
      userName: userData.name,
      userEmail: userData.email,
      requestDate: new Date().toISOString(),
      status: 'pending',
      reviewedBy: null,
      reviewDate: null
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};