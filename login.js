/* ============================================================
   AVSHESH — login.js
   Simulated authentication: accounts are stored in localStorage.
   There is no backend and no real security — this is a prototype.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const switchToSignup = document.getElementById("switch-to-signup");
  const switchToLogin = document.getElementById("switch-to-login");
  const businessField = document.getElementById("signup-business-field");

  function showLogin() {
    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");
    loginForm.style.display = "flex";
    signupForm.style.display = "none";
    switchToSignup.style.display = "block";
    switchToLogin.style.display = "none";
  }
  function showSignup() {
    tabSignup.classList.add("active");
    tabLogin.classList.remove("active");
    signupForm.style.display = "flex";
    loginForm.style.display = "none";
    switchToLogin.style.display = "block";
    switchToSignup.style.display = "none";
  }

  // Visual state for role radio cards (kept in sync via JS so it also
  // works in browsers without the CSS :has() selector).
  document.querySelectorAll(".role-toggle input").forEach((radio) => {
    radio.addEventListener("change", () => {
      const group = radio.closest(".role-toggle");
      group.querySelectorAll("label").forEach((label) => label.classList.remove("is-selected"));
      radio.closest("label").classList.add("is-selected");
    });
  });
  document.querySelectorAll('.role-toggle input:checked').forEach((radio) => {
    radio.closest("label").classList.add("is-selected");
  });

  tabLogin.addEventListener("click", showLogin);
  tabSignup.addEventListener("click", showSignup);
  switchToSignup.querySelector("a").addEventListener("click", showSignup);
  switchToLogin.querySelector("a").addEventListener("click", showLogin);

  // Toggle the "business name" field depending on the selected signup role
  signupForm.querySelectorAll('input[name="signup-role"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      businessField.style.display = e.target.value === "buyer" ? "flex" : "none";
    });
  });

  // If a dashboard redirected here because login was required, show a notice
  // and preselect the role that page needed.
  const notice = sessionStorage.getItem("avshesh_login_notice");
  const roleNeeded = sessionStorage.getItem("avshesh_login_role");
  if (notice) {
    const noticeEl = document.getElementById("login-notice");
    noticeEl.style.display = "block";
    noticeEl.setAttribute("data-i18n", notice);
    noticeEl.textContent = AvsheshI18n.t(notice);
    sessionStorage.removeItem("avshesh_login_notice");
  }
  if (roleNeeded) {
    document.querySelector(`input[name="login-role"][value="${roleNeeded}"]`).checked = true;
    document.querySelector(`input[name="signup-role"][value="${roleNeeded}"]`).checked = true;
    if (roleNeeded === "buyer") businessField.style.display = "flex";
    sessionStorage.removeItem("avshesh_login_role");
  }

  // ---- Login submit ----
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const role = loginForm.querySelector('input[name="login-role"]:checked').value;
    const phone = document.getElementById("login-phone").value.trim();
    const password = document.getElementById("login-password").value;
    const errorEl = document.getElementById("login-error");

    const result = AvsheshAuth.login(phone, password, role);
    if (!result.ok) {
      errorEl.classList.add("show");
      return;
    }
    errorEl.classList.remove("show");
    redirectAfterAuth(role);
  });

  // ---- Signup submit ----
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const role = signupForm.querySelector('input[name="signup-role"]:checked').value;
    const name = document.getElementById("signup-name").value.trim();
    const business = document.getElementById("signup-business").value.trim();
    const phone = document.getElementById("signup-phone").value.trim();
    const location = document.getElementById("signup-location").value.trim();
    const password = document.getElementById("signup-password").value;
    const errorEl = document.getElementById("signup-error");

    if (!name || !phone || !location || !password) {
      errorEl.textContent = AvsheshI18n.t("authErrorFill");
      errorEl.classList.add("show");
      return;
    }

    const result = AvsheshAuth.register({ name, business, phone, location, password, role });
    if (!result.ok) {
      errorEl.textContent =
        AvsheshI18n.getLang() === "hi"
          ? "इस नंबर से पहले से एक खाता मौजूद है।"
          : "An account with this number already exists.";
      errorEl.classList.add("show");
      return;
    }
    errorEl.classList.remove("show");
    redirectAfterAuth(role);
  });

  function redirectAfterAuth(role) {
    window.location.href = role === "farmer" ? "farmer.html" : "buyer.html";
  }
});
