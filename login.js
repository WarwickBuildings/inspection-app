import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxzI-4C04LvHKj-g99pNr0UPiQuRs-RY0",
  authDomain: "base-checks-8057f.firebaseapp.com",
  projectId: "base-checks-8057f",
  storageBucket: "base-checks-8057f.firebasestorage.app",
  messagingSenderId: "1062442818469",
  appId: "1:1062442818469:web:e0f47b4009d9ef0af1264c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 👇 THIS IS THE CRITICAL FIX
window.login = async function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("Trying login...", email);

  try {
    await signInWithEmailAndPassword(auth, email, password);

    console.log("LOGIN SUCCESS");

    window.location.href = "admin.html";

  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    document.getElementById("status").innerText = error.message;
  }
};