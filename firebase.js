// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZtG235Z6h9P5nZ6xT9z7hZ6tZ6hZ6tZ6",
  authDomain: "cera-test1.firebaseapp.com",
  projectId: "cera-test1",
  storageBucket: "cera-test1.appspot.com",
  messagingSenderId: "10594813589",
  appId: "1:10594813589:web:3651d8523b4003d1b779e5"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
