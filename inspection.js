import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  // your existing config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);

const jobId = params.get("id");

window.saveInspection = async function () {

  try {

    await addDoc(collection(db, "inspections"), {

      jobId,

      baseLevel:
        document.getElementById("baseLevel").checked,

      notes:
        document.getElementById("notes").value,

      created:
        serverTimestamp()
    });

    alert("Inspection saved");

  } catch (error) {

    console.error(error);

    alert("Save failed");
  }
};
