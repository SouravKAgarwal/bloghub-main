import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "bloghub-146f2.firebaseapp.com",
  projectId: "bloghub-146f2",
  storageBucket: "bloghub-146f2.appspot.com",
  messagingSenderId: "257764641256",
  appId: "1:257764641256:web:a0881ed84ed17783e97c5d",
};

export const app = initializeApp(firebaseConfig);
