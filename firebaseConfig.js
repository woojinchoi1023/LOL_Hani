import firebase from "firebase/compat/app";

// 사용할 파이어베이스 서비스 주석을 해제합니다
//import "firebase/compat/auth";
import "firebase/compat/database";
//import "firebase/compat/firestore";
//import "firebase/compat/functions";
import "firebase/compat/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCL0Nqvsbm8TAh0m3_wLNb8njVx1uw9LAQ",
    authDomain: "numullbo.firebaseapp.com",
    databaseURL: "https://numullbo-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "numullbo",
    storageBucket: "numullbo.appspot.com",
    messagingSenderId: "29645057276",
    appId: "1:29645057276:web:17a5f50545674ce416fb79",
    measurementId: "G-H61VCEJCMK"
  };
  

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const firebase_db = firebase.database()