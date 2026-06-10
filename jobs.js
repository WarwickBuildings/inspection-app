import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

let currentStaffName = null;
let currentUserUid = null;

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

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

   const userRef = doc(db, "users", user.uid);

const userSnap = await getDoc(userRef);

if (!userSnap.exists()) {
  return;
}

  const userData = userSnap.data();

currentUserUid = user.uid;
currentStaffName = userData.name;

loadJobs(currentUserUid);

  } catch (error) {

  console.error(error);

  alert(
    "Error loading user profile:\n\n" +
    error.message
  );
}
});

async function loadJobs() {

  const container = document.getElementById("jobList");
  if (!container) return;

  container.innerHTML = "";

  const showCompleted = document.getElementById("showCompleted")?.checked;

  const snapshot = await getDocs(collection(db, "jobs"));

  snapshot.forEach((d) => {

    const job = d.data();

    // 🔐 UID-based filtering
    if (job.assignedToUid !== currentUserUid) {
      return;
    }

    // 🔥 hide completed unless checkbox is ticked
    if (!showCompleted && job.status === "complete") {
      return;
    }

    const div = document.createElement("div");
    div.className = "job";

    div.innerHTML = `
      <h3>${job.jobNumber}</h3>
      <p>${job.customer}</p>
      <p>${job.address || ""}</p>
      <p>Status: ${job.status || "pending"}</p>
    `;

    container.appendChild(div);
  });
}

if (!showCompleted && job.status === "complete") {
  return;
}

    // Only show jobs assigned to this user
    if (job.assignedTo !== staffName) {
      return;
    }

    const div = document.createElement("div");
    div.className = "job";

    const mapsLink =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(job.address || "");

    div.innerHTML = `
      <h3>${job.jobNumber || ""}</h3>
      <p>${job.customer || ""}</p>
      <p>${job.address || ""}</p>
      <p>Status: ${job.status || "pending"}</p>

      <a href="${job.formUrl || "#"}" target="_blank">
        Open Inspection Form
      </a>

      <br><br>

<p>
  <label>
    <input
      type="checkbox"
      ${job.status === "complete" ? "checked" : ""}
      onchange="toggleComplete('${d.id}', this.checked)"
    >
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

window.startJourney = async function(jobId, mapsLink) {

  try {

    await updateDoc(doc(db, "jobs", jobId), {
      status: "travelling"
    });

    window.open(mapsLink, "_blank");

    location.reload();

  } catch (error) {

    console.error(error);
  }
};

window.toggleComplete = async function(jobId, checked) {

  try {

    await updateDoc(doc(db, "jobs", jobId), {
      status: checked ? "complete" : "pending"
    });

    location.reload();

  } catch (error) {

    console.error(error);
  }
};

window.logout = async function () {

  await signOut(auth);

  window.location.href = "login.html";
};

window.loadJobs = function () {
  if (currentStaffName) {
    loadJobs(currentStaffName);
  }
};
