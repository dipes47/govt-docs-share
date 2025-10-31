// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBeZCqnVOMg-gJhJzonbHt7MTzOEJsiYsg",
  authDomain: "govt-docs-share-22671.firebaseapp.com",
  projectId: "govt-docs-share-22671",
  storageBucket: "govt-docs-share-22671.firebasestorage.app",
  messagingSenderId: "1084704102891",
  appId: "1:1084704102891:web:093a423cce98f425df61ae",
  measurementId: "G-L2YBXWX0KY",
};

// ✅ Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// ✅ Always pass the same `app` to all services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// if (
//   window.location.hostname === "localhost" ||
//   window.location.hostname === "127.0.0.1"
// ) {
//   // ⚠️ This must never be deployed in production!
//   auth.settings.appVerificationDisabledForTesting = true;
//   console.warn(
//     "⚠️ Firebase phone auth verification disabled for local testing."
//   );
// }

export {
  app,
  auth,
  firestore,
  storage,
  RecaptchaVerifier,
  signInWithPhoneNumber,
};
