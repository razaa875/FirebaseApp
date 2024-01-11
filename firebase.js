import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
const firebaseConfig = {
  apiKey: "AIzaSyBovuohbmgJ3cI0WG0eIXaAXmReZRWwOAQ",
  authDomain: "hackhaton-66d0c.firebaseapp.com",
  projectId: "hackhaton-66d0c",
  storageBucket: "hackhaton-66d0c.appspot.com",
  messagingSenderId: "680366603444",
  appId: "1:680366603444:web:1dd91dd07d6a2117efebe1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();

export {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  app,
  collection,
  addDoc,
  db,
  setDoc,
  doc,
  getDoc,
  getDocs,
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  query,
  where,
  deleteDoc,
  updateDoc,
  storage
};
