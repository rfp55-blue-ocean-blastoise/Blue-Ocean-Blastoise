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
  inMemoryPersistence,
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

export const googleSignIn = () => {
  setPersistence(auth, inMemoryPersistence)
    .then(() => {
      const provider = new GoogleAuthProvider();
      // In memory persistence will be applied to the signed in Google user
      // even though the persistence was set to 'none' and a page redirect
      // occurred.
      signInWithPopup(auth, provider)
      .then((res)=> {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(res);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = res.user;
      console.log({user},{token}, 'from firebase')
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

export const makeNewSession = (email, password) => {
  console.log("session", browserSessionPersistence);
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      console.log("then block of make newSession");
      return signInWithEmailAndPassword(auth, email, password);
    })
    .catch((err) => {
      console.log(err, "err from make new session");
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log({ errorCode, errorMessage });
    });
};

export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);
export default firebaseApp;
