import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import config from "../config.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsVd5gnKLy2an0CNPI0mhPc6tp2TEYyzE",
  authDomain: "blue-ocean-60c5e.firebaseapp.com",
  projectId: "blue-ocean-60c5e",
  storageBucket: "blue-ocean-60c5e.appspot.com",
  messagingSenderId: "65790250639",
  appId: "1:65790250639:web:462603e1d525a253f2aafa",
  measurementId: "G-XGRLGJB7V3",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export const makeNewSession = (email, password) => {
  console.log('session', browserSessionPersistence)
  setPersistence(auth, browserSessionPersistence)
    .then(()=> {
      console.log('then block of make newSession')
      return signInWithEmailAndPassword(auth, email, password)
    })
    .catch((err)=>{
      console.log(err, 'err from make new session')
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log({errorCode, errorMessage})
    })
};

export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export default firebaseApp;
