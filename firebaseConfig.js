// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-AphDL2sXeUmFgELFP-U9DzY-0GuSD3k",
  authDomain: "fir-react-native-52eaa.firebaseapp.com",
  projectId: "fir-react-native-52eaa",
  storageBucket: "fir-react-native-52eaa.appspot.com",
  messagingSenderId: "287305226963",
  appId: "1:287305226963:web:526ea809eb12056b511226",
  measurementId: "G-NRLFRNYCD9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app)
export { auth };
export { db };