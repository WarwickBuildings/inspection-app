import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
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