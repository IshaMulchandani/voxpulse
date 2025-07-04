// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDvzP5mSZkL4HLVGZPMbbXiE_0MpNIQvUA",
  authDomain: "voxpulse-2c308.firebaseapp.com",
  projectId: "voxpulse-2c308",
  storageBucket: "voxpulse-2c308.firebasestorage.app",
  messagingSenderId: "560260025348",
  appId: "1:560260025348:web:f258b8e3b4491a6a1bb951",
  measurementId: "G-NP5EZ03N5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;