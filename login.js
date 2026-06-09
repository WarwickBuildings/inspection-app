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

window.login = async function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const statusEl = document.getElementById("status");

  statusEl.innerText = "";

  try {

    await signInWithEmailAndPassword(auth, email, password);

    console.log("LOGIN SUCCESS");

    window.location.href = "admin.html";

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    statusEl.innerText =
      "Login failed: " + error.message;
  }
};
