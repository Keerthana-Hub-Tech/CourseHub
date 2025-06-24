// ✅ script.js - shared client-side logic for CourseHub

// 🌐 Base API URL (adjust if deploying)
const BASE_API = "http://localhost:5000";

// ✅ Logout: clear localStorage and redirect
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username"); // ✅ Also remove username
  window.location.href = "login.html";
}

// ✅ Check if user is logged in (can be used for protected routes)
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// ✅ Get stored role
function getUserRole() {
  return localStorage.getItem("role");
}

// ✅ Set navigation highlight (optional)
function setActiveLink() {
  const links = document.querySelectorAll("nav a");
  const current = window.location.pathname;
  links.forEach(link => {
    if (link.href.includes(current)) {
      link.style.fontWeight = "bold";
      link.style.textDecoration = "underline";
    }
  });
}

// ✅ Filter courses by title (works for both admin and user dashboards)
function filterCourses() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();

  const cards = document.querySelectorAll(".course-card, .course");
  cards.forEach(card => {
    const title = card.querySelector("h3")?.textContent?.toLowerCase() || "";
    card.style.display = title.includes(filter) ? "" : "none";
  });
}

// ✅ Show toast notification (green by default, red for errors)
function showToast(message, success = true) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  if (!success) toast.style.backgroundColor = "#e74c3c"; // red for error

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ✅ Store username after login (you must call this in login logic)
function storeUsername(username) {
  localStorage.setItem("username", username);
}

// ✅ Call on page load if needed
document.addEventListener("DOMContentLoaded", () => {
  setActiveLink();
});
