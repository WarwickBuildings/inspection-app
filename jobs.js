import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

let currentUserUid = null;
let currentStaffName = null;

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

// ---------------- AUTH ----------------
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User profile not found");
      return;
    }

    const userData = userSnap.data();

    currentUserUid = user.uid;
    currentStaffName = userData.name;

    loadJobs();

  } catch (error) {
    console.error(error);
    alert("Error loading user profile: " + error.message);
  }
});

// ---------------- LOAD JOBS ----------------
async function loadJobs() {

  const container = document.getElementById("jobList");
  if (!container) return;

  container.innerHTML = "";

  const showCompleted = document.getElementById("showCompleted")?.checked;

  const q = query(
  collection(db, "jobs"),
  orderBy("jobNumber", "asc")
);

const snapshot = await getDocs(q);

  snapshot.forEach((d) => {

    const job = d.data();

    // 🔐 UID FILTER (CORE FIX)
    if (job.assignedToUid !== currentUserUid) {
      return;
    }

    // 🔥 hide completed unless checkbox ticked
    if (!showCompleted && job.status === "complete") {
      return;
    }

    const div = document.createElement("div");
    div.className = "job";

    const destination = encodeURIComponent(job.address || "");

const mapsLink =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  destination;

    div.innerHTML = `
  <h3>${job.jobNumber || ""}</h3>

  <p>${job.customer || ""}</p>

  <p>${job.address || ""}</p>

  <p>Status: ${job.status || "pending"}</p>
`;

if (job.jobType === "Repair") {

  div.innerHTML += `
    <p><strong>Repair Instructions:</strong></p>

    <p>${job.repairDetails || "No instructions provided"}</p>
  `;

} else {

  div.innerHTML += `
    <a href="${job.formUrl || "#"}" target="_blank">
      Open Inspection Form
    </a>
  `;
}

div.innerHTML += `

  <br><br>

  <p>
    <label>
      <input type="checkbox"
        ${job.status === "complete" ? "checked" : ""}
        onchange="toggleComplete('${d.id}', this.checked)">
      Inspection Complete
    </label>
  </p>

  <button onclick="startJourney('${d.id}', '${mapsLink}')">
    Open in Google Maps
  </button>
`;

    container.appendChild(div);
  });
}

// ---------------- ACTIONS ----------------
window.startJourney = async function(jobId, mapsLink) {

  try {

    await updateDoc(doc(db, "jobs", jobId), {
      status: "travelling"
    });

  } catch (error) {

    console.error(error);
  }

  window.location.href = mapsLink;
};

window.toggleComplete = async function(jobId, checked) {

  await updateDoc(doc(db, "jobs", jobId), {
    status: checked ? "complete" : "pending"
  });

  loadJobs();
};

// ---------------- LOGOUT ----------------
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

// ---------------- GLOBAL REFRESH ----------------
window.loadJobs = loadJobs;
