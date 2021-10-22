import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  browserSessionPersistence,
  setPersistence,
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

export const googleSignIn = async () => {
  try {
    setPersistence(auth, browserSessionPersistence);
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(res);
    const token = credential.accessToken;
    const email = res.user.email;
    return email;
  } catch (error) {
    const { errorCode, errorMessage, email } = error;
    const credential = GoogleAuthProvider.credentialFromError(error);
    return errorMessage;
  }
};

export const makeNewSession = async (email, password) => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    const {code, message} = error;
    return message
  }
};

export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);
export default firebaseApp;
