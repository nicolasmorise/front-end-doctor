// ==== CHANGE THIS TO YOUR API URL ====
const API_URL = "https://your-api-url.com";

// ==== DOM ELEMENTS ====
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("user-info");
const doctorForm = document.getElementById("doctorForm");
const loadDoctorsBtn = document.getElementById("loadDoctors");
const doctorsList = document.getElementById("doctorsList");


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
