import './App.css';
import { firebaseConfig } from './firebase';
import 'firebase/auth';
import * as firebase from 'firebase/app';
import { getFirestore, doc, getDoc, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SignIn from './pages/SignIn';
import InitialProfileSetup from './InitialProfileSetup';
import NewSideBar from './components/NewSideBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Friends from './pages/Friends';
import Home from './pages/Home'
import React, { useState, useEffect } from 'react';

const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function App() {
  const [uid, setUID] = useState("")
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUID(user.uid)
      sessionStorage.setItem('userSignedIn', '1');
      if (sessionStorage.getItem('profileSetUp') != '1') {
        let docSnapshot = getDoc(doc(db, 'profile', user.uid));
        if (docSnapshot._document == null) {
          sessionStorage.setItem('profileSetUp', '0');
        }
      }
    }
    else {
      sessionStorage.removeItem('userSignedIn')
    }
  });

  if (sessionStorage.getItem('userSignedIn') == '0' || sessionStorage.getItem('userSignedIn') == null) {
    return (
      <SignIn />
    )
  }
  if (sessionStorage.getItem('profileSetUp') == '0' || sessionStorage.getItem('profileSetUp') == null) {
    return (
      <InitialProfileSetup />
    )
  }
    return mainPage(uid)

  function mainPage(uid) {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="messages" element={<Messages uid={uid} />} />
            <Route path="profile" element={<Profile uid={uid} />} />
            <Route path="friends" element={<Friends uid={uid} />} />
          </Routes>
        </BrowserRouter>
      </>
    )
  }
}



export default App;
