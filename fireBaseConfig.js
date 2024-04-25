import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyCjfYe-eDrhGqqJHwa6rWkCGr0Epr55KKo",
  authDomain: "pastgifts.firebaseapp.com",
  databaseURL: "https://pastgifts-default-rtdb.firebaseio.com",
  projectId: "pastgifts",
  storageBucket: "pastgifts.appspot.com",
  messagingSenderId: "1074906139850",
  appId: "1:1074906139850:web:4c6d566a4dc1a3b0567833",
  measurementId: "G-HQ59YK0WVR"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);

const auth = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});





  export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
  export const FIREBASE_DB = getDatabase(FIREBASE_APP);
  export const FIREBASE_STG = getStorage(FIREBASE_APP);
  export const FIREBASE_STR = getFirestore(FIREBASE_APP);