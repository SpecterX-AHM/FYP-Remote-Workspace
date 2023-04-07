import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//firestore
export const db = firebase.firestore();
export default firebase

// Initialize Provider & Export
export const microsoftProvider = new firebase.auth.OAuthProvider('microsoft.com')
export const googleProvider = new firebase.auth.GoogleAuthProvider()

export const auth = firebase.auth();