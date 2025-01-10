// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

let firebaseApp: any;
let auth: any;

const loadFirebaseConfig = async () => {
  import.meta.env.VITE_REACT_APP_SERVER_URL;

  try {
    // ✅ Hardcoded Firebase Config (Replace with your actual credentials)
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };

    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    console.log("✅ Firebase Initialized from JSON!");
  } catch (error) {
    console.error("❌ Failed to load Firebase config:", error);
  }
};

loadFirebaseConfig();

export { firebaseApp, auth };
