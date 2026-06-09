import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

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

const jobsDiv = document.getElementById("jobs");

async function loadJobs() {

    jobsDiv.innerHTML = "";

    const querySnapshot =
        await getDocs(collection(db, "jobs"));

    querySnapshot.forEach((doc) => {

    const job = doc.data();

    // HIDE completed jobs (you can change this later)
    if (job.status === "complete") return;

    const card = document.createElement("div");
    card.className = "job";

    card.innerHTML = `
        <strong>${job.jobNumber}</strong><br>
        ${job.customer}<br>
        ${job.jobType}<br>
        <small>${job.address || ""}</small><br>
        <small>Status: ${job.status || "pending"}</small>
    `;

    card.addEventListener("click", () => {
        window.open(job.formUrl, "_blank");
    });

    jobsDiv.appendChild(card);
});
}

loadJobs();