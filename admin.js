import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
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

document.addEventListener("DOMContentLoaded", () => {

  const jobType = document.getElementById("jobType");
  const repairSection = document.getElementById("repairSection");

  if (!jobType || !repairSection) return;

  jobType.addEventListener("change", () => {

    if (jobType.value === "Repair") {
      repairSection.style.display = "block";
    } else {
      repairSection.style.display = "none";
    }

  });

});

// -------------------- FORM TEMPLATES --------------------
const formTemplates = {
  "Garage": "https://tally.so/r/44OR5A",
  "Office": "https://tally.so/r/obzg51",
  "Ground Screw Base": "https://tally.so/r/b5zXBZ"
};

// -------------------- AUTH GUARD --------------------
onAuthStateChanged(auth, async (user) => {

  console.log("ADMIN AUTH:", user);

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User profile not found");
      window.location.href = "login.html";
      return;
    }

    const userData = userSnap.data();

    console.log("ADMIN USER DATA:", userData);

    if (userData.role !== "admin") {
      alert("Access denied: Admins only");
      window.location.href = "jobs.html";
      return;
    }

    loadJobs();
    loadStaffDropdown();

  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error);
    alert(error.message);
    window.location.href = "login.html";
  }
});

// -------------------- LOAD JOBS --------------------
async function loadJobs() {

  const container = document.getElementById("jobList");
  if (!container) return;

  container.innerHTML = "";

  try {

    const snapshot = await getDocs(collection(db, "jobs"));

    snapshot.forEach((d) => {

      const job = d.data();

      const div = document.createElement("div");
      div.className = "job";

      div.innerHTML = `
        <strong>${job.jobNumber || ""}</strong><br>
        ${job.customer || ""} - ${job.jobType || ""}<br>
        Assigned: ${job.assignedToName || "Unassigned"}<br>
        ${job.address || ""}<br>
        Status: ${job.status || "pending"}<br><br>
      `;

      const completeBtn = document.createElement("button");
      completeBtn.innerText = "Mark Complete";

      completeBtn.onclick = async () => {
        await updateDoc(doc(db, "jobs", d.id), {
          status: "complete"
        });
        loadJobs();
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";

      deleteBtn.onclick = async () => {
        if (!confirm("Delete this job?")) return;
        await deleteDoc(doc(db, "jobs", d.id));
        loadJobs();
      };

      div.appendChild(completeBtn);
      div.appendChild(document.createTextNode(" "));
      div.appendChild(deleteBtn);

      container.appendChild(div);
    });

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Error loading jobs.</p>";
  }
}

// -------------------- AUTO FORM TEMPLATE --------------------
document.getElementById("jobType")?.addEventListener("change", function () {

  const selectedType = this.value;
  const urlField = document.getElementById("formUrl");

  if (formTemplates[selectedType]) {
    urlField.value = formTemplates[selectedType];
  } else {
    urlField.value = "";
  }
});

// -------------------- CREATE JOB --------------------
window.createJob = async function () {

  const jobNumber = document.getElementById("jobNumber").value;
  const customer = document.getElementById("customer").value;
  const address = document.getElementById("address").value;
  const jobType = document.getElementById("jobType").value;
  const formUrl = document.getElementById("formUrl").value;
  const assignedToUid = document.getElementById("assignedTo").value;

  const statusEl = document.getElementById("status");

  try {

    await addDoc(collection(db, "jobs"), {
  jobNumber,
  customer,
  address,
  jobType,
  formUrl,

  assignedToUid,
  assignedToName: document.getElementById("assignedTo").options[
    document.getElementById("assignedTo").selectedIndex
  ].text,

  status: "pending",
  created: new Date()
});

    statusEl.innerText = "Job created successfully ✔";

    document.getElementById("jobNumber").value = "";
    document.getElementById("customer").value = "";
    document.getElementById("address").value = "";
    document.getElementById("formUrl").value = "";

    loadJobs();

  } catch (e) {
    console.error(e);
    statusEl.innerText = "Error creating job";
  }
};

// -------------------- STAFF DROPDOWN --------------------
async function loadStaffDropdown() {

  const select = document.getElementById("assignedTo");
  if (!select) return;

  select.innerHTML = `<option value="">Unassigned</option>`;

  try {

    const snapshot = await getDocs(collection(db, "users"));

    snapshot.forEach((docSnap) => {

      const user = docSnap.data();

      if (user.role !== "staff") return;

      const option = document.createElement("option");
      option.value = docSnap.id;
      option.textContent = user.name;

      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading staff:", error);
  }
}

// -------------------- LOGOUT --------------------
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};
