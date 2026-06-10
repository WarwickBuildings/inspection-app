import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
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
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadJobs();
});

async function loadJobs() {

  const container = document.getElementById("jobList");

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "jobs"));

  snapshot.forEach((d) => {

    const job = d.data();

    const div = document.createElement("div");

    div.className = "job";

    const mapsLink =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(job.address || "");

    div.innerHTML = `
      <h3>${job.jobNumber}</h3>
      <p>${job.customer}</p>
      <p>${job.address || ""}</p>
      <p>Status: ${job.status || "pending"}</p>

      <a href="${job.formUrl}" target="_blank">
        Open Inspection Form
      </a>

      <br><br>

      <a href="${mapsLink}" target="_blank">
        Open in Google Maps
      </a>
    `;

    container.appendChild(div);
  });
}