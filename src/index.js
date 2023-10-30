import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBVTw_RGdT5t-7lHaHarqUPohvFPBc3NKA",
  authDomain: "quizzes-f7aec.firebaseapp.com",
  projectId: "quizzes-f7aec",
  storageBucket: "quizzes-f7aec.appspot.com",
  messagingSenderId: "255259345259",
  appId: "1:255259345259:web:02a88c1080493e865dcc2e",
  measurementId: "G-69JJX4RGBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
