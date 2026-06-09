import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
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

console.log("🔥 Admin JS loaded");

onAuthStateChanged(auth, (user) => {

  console.log("Auth state changed");
  console.log(user);

  if (!user) {

    document.body.innerHTML =
      "<h1>Not logged in</h1>";

  } else {

    document.body.innerHTML =
      "<h1>Logged in as " + user.email + "</h1>";

  }
});

async function loadJobs() {

  const snapshot = await getDocs(collection(db, "jobs"));

  const container = document.getElementById("jobList");
  container.innerHTML = "";

  snapshot.forEach((d) => {

    const job = d.data();

    const div = document.createElement("div");
    div.className = "job";

    div.innerHTML = `
      <strong>${job.jobNumber}</strong><br>
      ${job.customer} - ${job.jobType}<br>
      ${job.address || ""}<br>
      Status: ${job.status || "pending"}<br><br>
    `;

    // Mark complete button
    const completeBtn = document.createElement("button");
    completeBtn.innerText = "Mark Complete";
    completeBtn.onclick = async () => {
      await updateDoc(doc(db, "jobs", d.id), {
        status: "complete"
      });
      loadJobs();
    };

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = async () => {
      await deleteDoc(doc(db, "jobs", d.id));
      loadJobs();
    };

    div.appendChild(completeBtn);
    div.appendChild(deleteBtn);

    container.appendChild(div);
  });
}

window.createJob = async function () {

  const jobNumber = document.getElementById("jobNumber").value;
  const customer = document.getElementById("customer").value;
  const address = document.getElementById("address").value;
  const jobType = document.getElementById("jobType").value;
  const formUrl = document.getElementById("formUrl").value;

  const statusEl = document.getElementById("status");

  try {
    await addDoc(collection(db, "jobs"), {
      jobNumber,
      customer,
      address,
      jobType,
      formUrl,
      created: new Date()
    });

    statusEl.innerText = "Job created successfully ✔";

    document.getElementById("jobNumber").value = "";
    document.getElementById("customer").value = "";
    document.getElementById("formUrl").value = "";

  } catch (e) {
    console.error(e);
    statusEl.innerText = "Error creating job";
  }
};