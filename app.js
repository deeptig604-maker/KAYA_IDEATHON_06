/* ============================================================
   AVSHESH — app.js
   Shared helpers used across every page: session handling
   (simulated login, no backend), toast notifications, and
   small bits of navbar behaviour.
   ============================================================ */

const AvsheshAuth = (function () {
  const USERS_KEY = "avshesh_users";
  const SESSION_KEY = "avshesh_session";

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function findUser(phone, role) {
    return getUsers().find((u) => u.phone === phone && u.role === role);
  }

  function register(user) {
    const users = getUsers();
    if (findUser(user.phone, user.role)) {
      return { ok: false, reason: "exists" };
    }
    users.push(user);
    saveUsers(users);
    setSession(user);
    return { ok: true };
  }

  function login(phone, password, role) {
    const user = findUser(phone, role);
    if (!user || user.password !== password) {
      return { ok: false };
    }
    setSession(user);
    return { ok: true };
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  function getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  }

  return { register, login, getSession, logout, findUser };
})();

/* ---------------- Toast notifications ---------------- */
function showToast(icon, title, body, duration = 4200) {
  let stack = document.getElementById("toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.id = "toast-stack";
    document.body.appendChild(stack);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="t-icon">${icon}</span>
    <div><strong>${title}</strong><span>${body}</span></div>
  `;
  stack.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 260);
  }, duration);
}

/* ---------------- Navbar: mobile toggle + user chip ---------------- */
function initNavbar() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Highlight the current page in the nav
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (a.getAttribute("href") === current) a.classList.add("active");
  });

  // Show a user chip if logged in, otherwise a login button
  const actionsSlot = document.getElementById("nav-user-slot");
  if (actionsSlot) {
    const session = AvsheshAuth.getSession();
    if (session) {
      const initial = session.name ? session.name.trim()[0].toUpperCase() : "?";
      actionsSlot.innerHTML = `
        <div class="user-chip">
          <span class="avatar">${initial}</span>
          <span>${session.name}</span>
        </div>
        <a href="#" class="logout-link" id="logout-link" data-i18n="navLogout">Log out</a>
      `;
      document.getElementById("logout-link").addEventListener("click", (e) => {
        e.preventDefault();
        AvsheshAuth.logout();
      });
    } else {
      actionsSlot.innerHTML = `<a href="login.html" class="btn btn-outline btn-sm" data-i18n="navLogin">Login</a>`;
    }
  }
}

/* Require a logged-in user of a given role before showing a dashboard.
   If not logged in (or wrong role), redirect to login.html with a note. */
function requireRole(role) {
  const session = AvsheshAuth.getSession();
  if (!session || session.role !== role) {
    const msgKey = role === "farmer" ? "loginRequiredFarmer" : "loginRequiredBuyer";
    sessionStorage.setItem("avshesh_login_notice", msgKey);
    sessionStorage.setItem("avshesh_login_role", role);
    window.location.href = "login.html";
    return null;
  }
  return session;
}

/* ---------------- Cursor-tracking glow on cards/buttons ----------------
   Sets --mx/--my (cursor position relative to the hovered element) so
   the CSS radial-gradient glow in style.css can follow the pointer.
   Uses event delegation so it also works on cards rendered later
   (listings, buyer matches, etc.) without re-binding anything. */
const GLOW_SELECTOR =
  ".feature-card, .role-card, .stat-card, .entity-card, .best-match-box, .impact-block, .flow-step .bubble, .auth-card";

function initGlowEffect() {
  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(GLOW_SELECTOR);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initGlowEffect();
  if (typeof AvsheshI18n !== "undefined") AvsheshI18n.init();
});
