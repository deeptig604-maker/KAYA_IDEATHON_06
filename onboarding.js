/* ============================================================
   AVSHESH — onboarding.js
   First-time user guided tour. Highlights key UI elements with
   tooltips, dims the rest of the page, and remembers completion
   in localStorage so returning users aren't shown it again.

   The tour is built dynamically from whatever elements actually
   exist on the current page (nav, language switch, login/profile
   area, the page's main action, and the chat assistant button),
   so it works sensibly on every page without needing a separate
   script for each one, and never errors out if something isn't
   present.
   ============================================================ */

(function () {
  const STORAGE_KEY = "avshesh_onboarding_completed";

  function t(key, fallback) {
    if (typeof AvsheshI18n !== "undefined") return AvsheshI18n.t(key);
    return fallback || key;
  }
  function getSession() {
    return typeof AvsheshAuth !== "undefined" ? AvsheshAuth.getSession() : null;
  }
  function isCompleted() {
    return localStorage.getItem(STORAGE_KEY) === "true";
  }
  function setCompleted() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch (e) {
      /* ignore — worst case the tour reappears */
    }
  }
  function isEntryPage() {
    const p = window.location.pathname.split("/").pop() || "index.html";
    return p === "" || p === "index.html";
  }

  function el(tag, cls) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  /* ---------------- Build the step list from the current page ---------------- */
  function buildSteps() {
    const steps = [];
    const session = getSession();

    if (!session) {
      const loginTarget = document.querySelector("#nav-user-slot .btn, #nav-user-slot a");
      if (loginTarget) {
        steps.push({
          target: loginTarget,
          titleKey: "tourLoginTitle",
          titleFallback: "Start here",
          bodyKey: "tourLoginBody",
          bodyFallback: "Create an account or log in to access all features.",
        });
      }
    }

    const langTarget = document.querySelector(".lang-switch");
    if (langTarget) {
      steps.push({
        target: langTarget,
        titleKey: "tourLangTitle",
        titleFallback: "Choose your language",
        bodyKey: "tourLangBody",
        bodyFallback: "Choose your preferred language here.",
      });
    }

    const navTarget = document.querySelector(".nav-links");
    if (navTarget) {
      steps.push({
        target: navTarget,
        titleKey: "tourNavTitle",
        titleFallback: "Get around",
        bodyKey: "tourNavBody",
        bodyFallback: "Use this menu to explore different sections of the website.",
      });
    }

    const mainFeature =
      document.querySelector(".hero-actions") ||
      document.querySelector("#listing-form") ||
      document.querySelector(".filter-bar") ||
      document.querySelector("#optimize-btn") ||
      document.querySelector("#best-match-box");
    if (mainFeature) {
      steps.push({
        target: mainFeature,
        titleKey: "tourFeatureTitle",
        titleFallback: "The main feature",
        bodyKey: "tourFeatureBody",
        bodyFallback: "This is the main feature of our platform. Click here to get started.",
      });
    }

    if (session) {
      const profileTarget = document.querySelector("#nav-user-slot .user-chip");
      if (profileTarget) {
        steps.push({
          target: profileTarget,
          titleKey: "tourProfileTitle",
          titleFallback: "Your profile",
          bodyKey: "tourProfileBody",
          bodyFallback: "Manage your profile and account settings here.",
        });
      }
    }

    const chatTarget = document.getElementById("avshesh-chat-toggle");
    if (chatTarget) {
      steps.push({
        target: chatTarget,
        titleKey: "tourChatTitle",
        titleFallback: "Need a hand?",
        bodyKey: "tourChatBody",
        bodyFallback: "Need help? Ask our AI assistant anytime.",
      });
    }

    return steps;
  }

  /* ---------------- Tour engine ---------------- */
  let steps = [];
  let idx = 0;
  let active = false;
  let finished = false;

  function createDOM() {
    if (document.getElementById("av-tour-overlay")) return;
    const overlay = el("div", "av-tour-overlay");
    overlay.id = "av-tour-overlay";

    const spotlight = el("div", "av-tour-spotlight");
    spotlight.id = "av-tour-spotlight";

    const tooltip = el("div", "av-tour-tooltip");
    tooltip.id = "av-tour-tooltip";
    tooltip.setAttribute("role", "dialog");
    tooltip.setAttribute("aria-live", "polite");
    tooltip.innerHTML =
      '<div class="av-tour-progress" id="av-tour-progress"></div>' +
      '<h4 id="av-tour-title"></h4>' +
      '<p id="av-tour-body"></p>' +
      '<div class="av-tour-actions">' +
      '<button type="button" class="av-tour-skip" id="av-tour-skip"></button>' +
      '<div class="av-tour-nav-btns">' +
      '<button type="button" class="av-tour-back" id="av-tour-back"></button>' +
      '<button type="button" class="av-tour-next" id="av-tour-next"></button>' +
      "</div></div>";

    overlay.appendChild(spotlight);
    overlay.appendChild(tooltip);
    document.body.appendChild(overlay);

    document.getElementById("av-tour-skip").addEventListener("click", skipTour);
    document.getElementById("av-tour-back").addEventListener("click", backStep);
    document.getElementById("av-tour-next").addEventListener("click", onNextClick);

    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
  }

  function destroyDOM() {
    const overlay = document.getElementById("av-tour-overlay");
    if (overlay) overlay.remove();
    window.removeEventListener("resize", onReflow);
    window.removeEventListener("scroll", onReflow, true);
  }

  function onReflow() {
    if (!active || finished || !steps[idx]) return;
    positionOverlay(steps[idx].target);
  }

  function positionOverlay(targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const pad = 8;
    const spot = document.getElementById("av-tour-spotlight");
    if (!spot) return;
    spot.style.top = rect.top - pad + "px";
    spot.style.left = rect.left - pad + "px";
    spot.style.width = rect.width + pad * 2 + "px";
    spot.style.height = rect.height + pad * 2 + "px";
    spot.style.opacity = "1";

    const tooltip = document.getElementById("av-tour-tooltip");
    if (!tooltip) return;
    requestAnimationFrame(() => {
      const tw = tooltip.offsetWidth || 300;
      const th = tooltip.offsetHeight || 140;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const gap = 14;
      const spaceBelow = vh - rect.bottom;
      const spaceAbove = rect.top;
      let top;
      if (spaceBelow >= th + gap || spaceBelow >= spaceAbove) {
        top = rect.bottom + gap;
      } else {
        top = rect.top - th - gap;
      }
      top = Math.max(10, Math.min(top, vh - th - 10));
      let left = rect.left + rect.width / 2 - tw / 2;
      left = Math.max(10, Math.min(left, vw - tw - 10));
      tooltip.style.top = top + "px";
      tooltip.style.left = left + "px";
      tooltip.style.transform = "";
    });
  }

  function refreshLabels() {
    document.getElementById("av-tour-skip").textContent = t("tourSkip", "Skip Tour");
    document.getElementById("av-tour-back").textContent = t("tourBack", "Back");
    document.getElementById("av-tour-next").textContent =
      idx === steps.length - 1 ? t("tourFinish", "Finish") : t("tourNext", "Next");
  }

  function showStep(i) {
    idx = i;
    const step = steps[i];
    if (!step || !step.target) {
      finishTour();
      return;
    }
    const tooltip = document.getElementById("av-tour-tooltip");
    tooltip.classList.remove("av-tour-done");

    document.getElementById("av-tour-title").textContent = t(step.titleKey, step.titleFallback);
    document.getElementById("av-tour-body").textContent = t(step.bodyKey, step.bodyFallback);
    document.getElementById("av-tour-progress").textContent = i + 1 + " / " + steps.length;
    document.getElementById("av-tour-back").disabled = i === 0;
    refreshLabels();

    step.target.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => positionOverlay(step.target), 320);
  }

  function onNextClick() {
    if (finished) {
      endTour();
      return;
    }
    if (idx < steps.length - 1) {
      showStep(idx + 1);
    } else {
      finishTour();
    }
  }

  function backStep() {
    if (finished || idx === 0) return;
    showStep(idx - 1);
  }

  function skipTour() {
    setCompleted();
    endTour();
  }

  function finishTour() {
    finished = true;
    setCompleted();
    const spot = document.getElementById("av-tour-spotlight");
    if (spot) spot.style.opacity = "0";
    const tooltip = document.getElementById("av-tour-tooltip");
    tooltip.classList.add("av-tour-done");
    tooltip.style.top = "";
    tooltip.style.left = "";
    document.getElementById("av-tour-progress").textContent = "";
    document.getElementById("av-tour-title").textContent = t("tourDoneTitle", "You're all set!");
    document.getElementById("av-tour-body").textContent = t(
      "tourDoneBody",
      "You now know the basics. You can always ask our AI assistant if you need help."
    );
    document.getElementById("av-tour-skip").style.display = "none";
    document.getElementById("av-tour-back").style.display = "none";
    document.getElementById("av-tour-next").textContent = t("tourGotIt", "Got it");
  }

  function endTour() {
    active = false;
    finished = false;
    destroyDOM();
  }

  function start() {
    steps = buildSteps();
    if (steps.length === 0) return;
    idx = 0;
    finished = false;
    active = true;
    createDOM();
    // Reset skip/back visibility in case they were hidden by a previous run
    document.getElementById("av-tour-skip").style.display = "";
    document.getElementById("av-tour-back").style.display = "";
    showStep(0);
  }

  /* ---------------- "Take Tour Again" entry point ---------------- */
  function injectRestartButton() {
    const actions = document.querySelector(".nav-actions");
    if (!actions || document.getElementById("tour-restart-btn")) return;
    const btn = el("button", "tour-restart-btn");
    btn.type = "button";
    btn.id = "tour-restart-btn";
    btn.innerHTML = "❔";
    btn.setAttribute("aria-label", t("tourRestartLabel", "Take the tour again"));
    btn.title = t("tourRestartLabel", "Take the tour again");
    btn.addEventListener("click", () => start());
    actions.insertBefore(btn, actions.firstChild);
  }

  function init() {
    injectRestartButton();
    if (!isCompleted() && isEntryPage()) {
      // Small delay so the navbar, chat FAB, and page content are fully in place
      setTimeout(start, 900);
    }
  }

  document.addEventListener("DOMContentLoaded", init);

  window.AvsheshOnboarding = { start: start, isCompleted: isCompleted };
})();
