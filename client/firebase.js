import firebase from 'firebase/app'
import 'firebase/auth'
import config from '../config.js';

const firebaseAuth = firebase.initializeApp({
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
})

export const auth = firebaseAuth.auth()
export default firebaseAuth