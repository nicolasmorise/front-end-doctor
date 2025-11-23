const API = "https://doctor-api-w54x.onrender.com";

// ---------- LOGIN ----------
document.getElementById("loginBtn").addEventListener("click", () => {
  window.location.href = `${API}/auth/github`;
});

// ---------- LOGOUT ----------
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch(`${API}/auth/logout`, {
    method: "GET",
    credentials: "include",
  });
  document.getElementById("user-info").innerText = "Logged out.";
});

// ---------- CHECK AUTH ----------
async function checkUser() {
  const res = await fetch(`${API}/auth/me`, {
    credentials: "include",
  });

  if (res.status === 200) {
    const user = await res.json();
    document.getElementById("user-info").innerText =
      "Logged in as: " + user.username;
  } else {
    document.getElementById("user-info").innerText = "Not logged in.";
  }
}

checkUser();

// ---------- CREATE DOCTOR ----------
document.getElementById("doctorForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target));

  const res = await fetch(`${API}/doctors`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  alert(JSON.stringify(data, null, 2));
});

// ---------- LOAD DOCTORS ----------
document.getElementById("loadDoctors").addEventListener("click", async () => {
  const res = await fetch(`${API}/doctors`, {
    credentials: "include",
  });

  const doctors = await res.json();

  document.getElementById("doctorsList").innerText = JSON.stringify(
    doctors,
    null,
    2
  );
});
