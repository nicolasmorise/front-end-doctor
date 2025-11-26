// ==== CHANGE THIS TO YOUR API URL ====
const API_URL = "https://doctor-api-w54x.onrender.com";

// ==== DOM ELEMENTS ====
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("user-info");
const doctorForm = document.getElementById("doctorForm");
const loadDoctorsBtn = document.getElementById("loadDoctors");
const doctorsList = document.getElementById("doctorsList");
const findDoctorBtn = document.getElementById("findBtn");
const searchInput = document.getElementById("DoctorSearch");
const dropdown = document.getElementById("autocomplete");
const doctorInfo = document.getElementById("DoctorInfo");


// ===============================
//  LOGIN WITH GITHUB
// ===============================
loginBtn.addEventListener("click", () => {
  // Redirect to backend GitHub login
  window.location.href = `${API_URL}/auth/github`;
});


// ===============================
//  LOGOUT
// ===============================
logoutBtn.addEventListener("click", async () => {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",  // send cookies
  });

  userInfo.innerHTML = "Logged out.";
});


// ===============================
//  FETCH CURRENT USER (/me)
// ===============================
async function loadUser() {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      credentials: "include"
    });

    if (!res.ok) {
      userInfo.innerHTML = "Not logged in";
      return;
    }

    const data = await res.json();

    userInfo.innerHTML = `
      <h3>Logged in as:</h3>
      <p><strong>${data.username}</strong></p>
      <img src="${data.avatar}" width="80">
    `;

  } catch (err) {
    userInfo.innerHTML = "Error loading user";
  }
}

loadUser();


// ===============================
//  CREATE DOCTOR (POST)
// ===============================
doctorForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(doctorForm);
  const payload = Object.fromEntries(formData.entries());

  const res = await fetch(`${API_URL}/doctors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    alert("Error creating doctor");
    return;
  }

  const data = await res.json();
  alert("Doctor created!");
  console.log(data);
});


// ===============================
//  LOAD ALL DOCTORS
// ===============================
loadDoctorsBtn.addEventListener("click", async () => {
  const res = await fetch(`${API_URL}/doctors`, {
    credentials: "include"
  });

  if (!res.ok) {
    doctorsList.textContent = "Error loading doctors";
    return;
  }

  const data = await res.json();
  doctorsList.textContent = JSON.stringify(data, null, 2);
});

// ===============================
//  Find Doctor
// ===============================
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();

  if (query.length < 2) {
    dropdown.style.display = "none";
    return;
  }

  try {
    // Try all 3 API options
    const url = `${API_URL}/doctors/search?first=${query}&last=${query}`;

    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) {
      dropdown.style.display = "none";
      return;
    }

    const doctors = await res.json();

    if (!Array.isArray(doctors) || doctors.length === 0) {
      dropdown.style.display = "none";
      return;
    }

    dropdown.innerHTML = "";
    dropdown.style.display = "block";

    doctors.forEach((doc) => {
      const option = document.createElement("div");
      option.textContent = `${doc["Referring First"]} ${doc["Referring Last"]}`;

      option.addEventListener("click", () => selectDoctor(doc));

      dropdown.appendChild(option);
    });

  } catch (err) {
    console.error("Error:", err);
    dropdown.style.display = "none";
  }
});

function selectDoctor(doc) {
  dropdown.style.display = "none";

  searchInput.value = `${doc["Referring First"]} ${doc["Referring Last"]}`;

  doctorInfo.innerHTML = `
    <p><strong>First:</strong> ${doc["Referring First"]}</p>
    <p><strong>Last:</strong> ${doc["Referring Last"]}</p>
    <p><strong>Clinic:</strong> ${doc["Referring Clinic"]}</p>
    <p><strong>Phone:</strong> ${doc["Referring Phone"]}</p>
    <p><strong>Fax:</strong> ${doc["Referring Fax No"]}</p>
  `;
}