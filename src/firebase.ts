// Firebase initialization for the Classroom Equipment Tracker.
// Uses the Realtime Database for CRUD operations.
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBkIU_qs6bUAGqTsIpZEGAqdVzLoc2nbUU",
  authDomain: "ionic-crud-f11dc.firebaseapp.com",
  databaseURL:
    "https://ionic-crud-f11dc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ionic-crud-f11dc",
  storageBucket: "ionic-crud-f11dc.firebasestorage.app",
  messagingSenderId: "857372287526",
  appId: "1:857372287526:web:2a4e5065e2224564d3fce7",
  measurementId: "G-W5M45BHBYV",
};

// Initialize Firebase and export the Realtime Database instance.
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export default app;
