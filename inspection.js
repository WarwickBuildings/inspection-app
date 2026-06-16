import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxzI-4C04LvHKj-g99pNr0UPiQuRs-RY0",
  authDomain: "base-checks-8057f.firebaseapp.com",
  projectId: "base-checks-8057f",
  storageBucket: "base-checks-8057f.firebasestorage.app",
  messagingSenderId: "1062442818469",
  appId: "1:1062442818469:web:e0f47b4009d9ef0af1264c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");

window.saveInspection = async function () {

  try {

    await addDoc(collection(db, "inspections"), {

      jobId: jobId,

      baseLevel:
        document.getElementById("baseLevel").checked,

      notes:
        document.getElementById("notes").value,

      created:
        serverTimestamp()
    });

    alert("Inspection saved successfully");

  } catch (error) {

    console.error(error);

    alert("Failed to save inspection");
  }
};
