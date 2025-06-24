//  script.js - shared client-side logic for CourseHub

//  Base API URL 
const BASE_API = "http://localhost:5000";


function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username"); 
  window.location.href = "login.html";
}


function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function getUserRole() {
  return localStorage.getItem("role");
}


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


function filterCourses() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();

  const cards = document.querySelectorAll(".course-card, .course");
  cards.forEach(card => {
    const title = card.querySelector("h3")?.textContent?.toLowerCase() || "";
    card.style.display = title.includes(filter) ? "" : "none";
  });
}

// Show toast notification (green by default, red for errors)
function showToast(message, success = true) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  if (!success) toast.style.backgroundColor = "#e74c3c"; // red for error

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Store username after login (you must call this in login logic)
function storeUsername(username) {
  localStorage.setItem("username", username);
}


document.addEventListener("DOMContentLoaded", () => {
  setActiveLink();
});
