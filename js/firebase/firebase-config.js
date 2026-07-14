const turanFirebaseConfig = {
  apiKey: "AIzaSyCP_qa-SVPJ4jhNn29yzeJtLJae0eQkieA",
  authDomain: "bozorcha-f3475.firebaseapp.com",
  projectId: "bozorcha-f3475",
  storageBucket: "bozorcha-f3475.firebasestorage.app",
  messagingSenderId: "333480505903",
  appId: "1:333480505903:web:b01b5cfc7bbe50deeaccda",
  databaseURL: "https://bozorcha-f3475-default-rtdb.firebaseio.com",
  measurementId: "G-GZYPG8FEXZ"
};

firebase.initializeApp(turanFirebaseConfig);

const turanAuth = firebase.auth();
const turanDb = firebase.database();
