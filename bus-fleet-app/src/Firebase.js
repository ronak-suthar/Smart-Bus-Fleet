// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUkUK-m0CjxXh4laVmaHKr-tUJSmYFSHI",
  authDomain: "smart-bus-fleet.firebaseapp.com",
  projectId: "smart-bus-fleet",
  storageBucket: "smart-bus-fleet.appspot.com",
  messagingSenderId: "292217918631",
  appId: "1:292217918631:web:a36d9f9377fc48e6d8f782",
  measurementId: "G-CW65GNRCGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore();

