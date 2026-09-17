/* ============================================================
   AVSHESH — chatbot.js
   A floating help assistant that explains how to use the site.

   IMPORTANT: This project is a static front-end prototype with no
   AI API / backend (see app.js — auth is simulated in localStorage).
   So instead of hardcoding a handful of scripted "conversations",
   this assistant uses a small keyword-matched FAQ knowledge base
   about Avshesh's real features (listing residue, finding buyers,
   route optimization, login, language, etc.) and picks the best
   matching answer for whatever the user types.

   If a real AI backend is added later, only getBotResponse() needs
   to change — swap its body for a fetch() call to your API, e.g.:

     async function getBotResponse(query) {
       const res = await fetch('/api/chat', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ message: query, lang: lang() })
       });
       const data = await res.json();
       return data.reply;
     }

   Everything else (widget UI, history, suggestions) stays the same.
   ============================================================ */

(function () {
  const HISTORY_KEY = "avshesh_chat_history";
  const MAX_HISTORY = 40;

  function t(key, fallback) {
    if (typeof AvsheshI18n !== "undefined") return AvsheshI18n.t(key);
    return fallback || key;
  }
  function lang() {
    return typeof AvsheshI18n !== "undefined" ? AvsheshI18n.getLang() : "en";
  }

  /* ---------------- Knowledge base ---------------- */
  const FAQ = [
    {
      keywords: ["hello", "hi", "hey", "namaste", "नमस्ते", "हाय"],
      answer: {
        en: "Hi! I'm the Avshesh assistant. Ask me how to list residue, find buyers, use route optimization, or anything else about the site.",
        hi: "नमस्ते! मैं अवशेष सहायक हूँ। मुझसे पूछें कि अवशेष कैसे सूचीबद्ध करें, खरीदार कैसे खोजें, मार्ग अनुकूलन का उपयोग कैसे करें, या साइट के बारे में कुछ भी।",
      },
    },
    {
      keywords: ["how do i use", "use this website", "use the site", "how it works", "how does this work", "getting started", "get started"],
      answer: {
        en: "Avshesh connects farmers who have crop residue with nearby buyers. Choose 'I am a Farmer' to list residue, or 'I am a Buyer' to browse nearby supply. You'll need to log in or create a free account first.",
        hi: "अवशेष उन किसानों को जोड़ता है जिनके पास फसल अवशेष है, आस-पास के खरीदारों से। अवशेष सूचीबद्ध करने के लिए 'मैं एक किसान हूँ' चुनें, या आस-पास की आपूर्ति देखने के लिए 'मैं एक खरीदार हूँ' चुनें। पहले आपको लॉगिन या मुफ़्त खाता बनाना होगा।",
      },
    },
    {
      keywords: ["what can i do", "features", "do here", "options available"],
      answer: {
        en: "As a farmer, you can list residue and see interested buyers. As a buyer, you can browse nearby residue, filter by crop, distance or price, and plan an optimized pickup route.",
        hi: "किसान के रूप में, आप अवशेष सूचीबद्ध कर सकते हैं और रुचि रखने वाले खरीदारों को देख सकते हैं। खरीदार के रूप में, आप आस-पास के अवशेष ब्राउज़ कर सकते हैं, फसल/दूरी/कीमत के अनुसार फ़िल्टर कर सकते हैं, और एक अनुकूलित पिकअप मार्ग की योजना बना सकते हैं।",
      },
    },
    {
      keywords: ["list", "sell", "residue", "crop waste", "listing", "add listing", "post listing"],
      answer: {
        en: "To list residue: log in as a Farmer, open the Farmer Dashboard, fill in crop type, residue type, quantity, price and location, then click 'List Residue'. It appears instantly under 'My Listings'.",
        hi: "अवशेष सूचीबद्ध करने के लिए: किसान के रूप में लॉगिन करें, किसान डैशबोर्ड खोलें, फसल का प्रकार, अवशेष का प्रकार, मात्रा, कीमत और स्थान भरें, फिर 'अवशेष सूचीबद्ध करें' पर क्लिक करें। यह तुरंत 'मेरी लिस्टिंग' के अंतर्गत दिखाई देगा।",
      },
    },
    {
      keywords: ["buyer", "find buyers", "nearby", "supply", "browse", "buy residue", "purchase"],
      answer: {
        en: "As a buyer, open the Buyer Dashboard to see nearby residue listings. Use the filters at the top to sort by distance, price, or quantity, and by crop type.",
        hi: "खरीदार के रूप में, आस-पास की अवशेष लिस्टिंग देखने के लिए खरीदार डैशबोर्ड खोलें। दूरी, कीमत, या मात्रा और फसल के प्रकार के अनुसार क्रमबद्ध करने के लिए ऊपर दिए गए फ़िल्टर का उपयोग करें।",
      },
    },
    {
      keywords: ["route", "optimization", "optimize", "pickup", "pickups", "fuel"],
      answer: {
        en: "Route Optimization plans an efficient pickup order across multiple farms. Click 'Optimize Route' on that page to see the suggested stop order, total distance, time, and estimated fuel cost.",
        hi: "मार्ग अनुकूलन कई खेतों में एक कुशल पिकअप क्रम की योजना बनाता है। सुझाए गए स्टॉप क्रम, कुल दूरी, समय और अनुमानित ईंधन लागत देखने के लिए उस पृष्ठ पर 'मार्ग अनुकूलित करें' पर क्लिक करें।",
      },
    },
    {
      keywords: ["login", "log in", "sign up", "signup", "create account", "register", "password"],
      answer: {
        en: "Click 'Login' in the top right. You can log in, or switch to 'Create account' if you're new — just choose whether you're a Farmer or a Buyer/Business.",
        hi: "ऊपर दाईं ओर 'लॉगिन' पर क्लिक करें। आप लॉगिन कर सकते हैं या यदि आप नए हैं तो 'खाता बनाएं' पर स्विच कर सकते हैं — चुनें कि आप किसान हैं या खरीदार/व्यवसाय।",
      },
    },
    {
      keywords: ["language", "hindi", "english", "translate", "हिंदी"],
      answer: {
        en: "You can switch between English and Hindi anytime using the EN / हिं buttons in the top navigation bar.",
        hi: "आप शीर्ष नेविगेशन बार में EN / हिं बटन का उपयोग करके कभी भी अंग्रेज़ी और हिंदी के बीच स्विच कर सकते हैं।",
      },
    },
    {
      keywords: ["profile", "logout", "log out", "account settings", "my account"],
      answer: {
        en: "Once you're logged in, your name appears in the top right of the navbar. Click 'Log out' next to it to end your session.",
        hi: "एक बार लॉगिन करने के बाद, आपका नाम नेवबार के ऊपर दाईं ओर दिखाई देगा। अपना सत्र समाप्त करने के लिए उसके बगल में 'लॉग आउट' पर क्लिक करें।",
      },
    },
    {
      keywords: ["co2", "impact", "environment", "environmental", "emission", "burning", "stubble"],
      answer: {
        en: "Avshesh helps reduce stubble burning by giving farmers a paid alternative. Your dashboard shows an estimate of residue diverted and CO₂ avoided — these are demonstration figures for this prototype.",
        hi: "अवशेष किसानों को एक सशुल्क विकल्प देकर पराली जलाने को कम करने में मदद करता है। आपका डैशबोर्ड अवशेष के डायवर्जन और CO₂ की बचत का अनुमान दिखाता है — ये इस प्रोटोटाइप के लिए प्रदर्शन आंकड़े हैं।",
      },
    },
    {
      keywords: ["price", "cost", "free", "pay", "payment", "money", "charge"],
      answer: {
        en: "Using Avshesh to list residue or browse buyers is free in this prototype. Prices shown are whatever farmers and buyers set themselves for the residue.",
        hi: "इस प्रोटोटाइप में अवशेष सूचीबद्ध करने या खरीदारों को ब्राउज़ करने के लिए अवशेष का उपयोग करना मुफ़्त है। दिखाई गई कीमतें किसानों और खरीदारों द्वारा स्वयं तय की जाती हैं।",
      },
    },
    {
      keywords: ["what is avshesh", "about avshesh", "who are you", "what is this platform"],
      answer: {
        en: "Avshesh is a marketplace that connects farmers with crop residue to nearby buyers, so residue gets sold instead of burned — reducing pollution and creating extra income.",
        hi: "अवशेष एक बाज़ार है जो फसल अवशेष वाले किसानों को आस-पास के खरीदारों से जोड़ता है, ताकि अवशेष जलाने के बजाय बेचा जाए — प्रदूषण कम हो और अतिरिक्त आय हो।",
      },
    },
    {
      keywords: ["tour", "onboarding", "walkthrough", "restart tour", "guide me"],
      answer: {
        en: "You can restart the guided tour anytime using the small ❔ button next to the language switch in the top navigation bar.",
        hi: "आप शीर्ष नेविगेशन बार में भाषा स्विच के बगल में छोटे ❔ बटन का उपयोग करके कभी भी निर्देशित टूर को पुनः आरंभ कर सकते हैं।",
      },
    },
    {
      keywords: ["thank", "thanks", "shukriya", "धन्यवाद"],
      answer: {
        en: "You're welcome! Let me know if there's anything else about Avshesh I can help with.",
        hi: "आपका स्वागत है! यदि अवशेष के बारे में कुछ और है जिसमें मैं मदद कर सकूं, तो बताएं।",
      },
    },
  ];

  const FALLBACK = {
    en: "I'm not sure about that yet, but I can help with listing residue, finding buyers, route optimization, login, or language settings. Try one of the suggestions below, or rephrase your question.",
    hi: "मुझे अभी इसके बारे में निश्चित नहीं है, लेकिन मैं अवशेष सूचीबद्ध करने, खरीदार खोजने, मार्ग अनुकूलन, लॉगिन, या भाषा सेटिंग्स में मदद कर सकता हूँ। नीचे दिए गए सुझावों में से एक आज़माएं, या अपना प्रश्न दोबारा लिखें।",
  };

  const SUGGESTIONS = [
    { en: "How do I use this website?", hi: "मैं इस वेबसाइट का उपयोग कैसे करूं?" },
    { en: "What can I do here?", hi: "मैं यहां क्या कर सकता हूं?" },
    { en: "How do I get started?", hi: "मैं शुरुआत कैसे करूं?" },
    { en: "Where can I find nearby buyers?", hi: "मुझे आस-पास के खरीदार कहां मिलेंगे?" },
  ];

  function scoreEntry(query, keywords) {
    const q = query.toLowerCase();
    let s = 0;
    keywords.forEach((k) => {
      if (q.includes(k.toLowerCase())) s += k.length;
    });
    return s;
  }

  function getBotResponse(query) {
    let best = null;
    let bestScore = 0;
    FAQ.forEach((entry) => {
      const s = scoreEntry(query, entry.keywords);
      if (s > bestScore) {
        bestScore = s;
        best = entry;
      }
    });
    const L = lang();
    if (best && bestScore > 0) return best.answer[L] || best.answer.en;
    return FALLBACK[L] || FALLBACK.en;
  }

  /* ---------------- Widget state ---------------- */
  let history = [];
  let panelOpen = false;

  function loadHistory() {
    try {
      history = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]");
    } catch (e) {
      history = [];
    }
  }
  function saveHistory() {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
    } catch (e) {
      /* storage unavailable — chat still works, just won't persist */
    }
  }

  function el(tag, cls) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  function buildWidget() {
    if (document.getElementById("avshesh-chat-toggle")) return; // already built

    const fab = el("button", "av-chat-fab");
    fab.id = "avshesh-chat-toggle";
    fab.type = "button";
    fab.setAttribute("aria-label", t("chatFabLabel", "Chat with Avshesh Assistant"));
    fab.innerHTML = '<span class="av-chat-fab-icon" aria-hidden="true">💬</span>';

    const panel = el("div", "av-chat-panel");
    panel.id = "avshesh-chat-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", t("chatTitle", "Avshesh Assistant"));
    panel.hidden = true;
    panel.innerHTML =
      '<div class="av-chat-header">' +
      '<div class="av-chat-header-title"><span class="av-chat-avatar" aria-hidden="true">🌾</span>' +
      "<div><strong>" + t("chatTitle", "Avshesh Assistant") + "</strong>" +
      "<span>" + t("chatSubtitle", "Here to help you get around") + "</span></div></div>" +
      '<button type="button" class="av-chat-close" id="av-chat-close" aria-label="' +
      t("chatCloseLabel", "Close chat") + '">✕</button>' +
      "</div>" +
      '<div class="av-chat-messages" id="av-chat-messages"></div>' +
      '<div class="av-chat-suggestions" id="av-chat-suggestions"></div>' +
      '<form class="av-chat-input-row" id="av-chat-form">' +
      '<input type="text" id="av-chat-input" class="av-chat-input" autocomplete="off" placeholder="' +
      t("chatInputPlaceholder", "Ask a question...") + '" />' +
      '<button type="submit" class="av-chat-send" aria-label="' + t("chatSendLabel", "Send") + '">➤</button>' +
      "</form>";

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    fab.addEventListener("click", togglePanel);
    document.getElementById("av-chat-close").addEventListener("click", closePanel);
    document.getElementById("av-chat-form").addEventListener("submit", onSubmit);

    renderSuggestions();
    renderHistory();
  }

  function togglePanel() {
    if (panelOpen) closePanel();
    else openPanel();
  }
  function openPanel() {
    const panel = document.getElementById("avshesh-chat-panel");
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("open"));
    panelOpen = true;
    if (history.length === 0) {
      addBotMessage(
        t("chatGreeting", "Hi! I'm the Avshesh assistant. Ask me anything about using the site, or tap a suggestion below.")
      );
    }
    const input = document.getElementById("av-chat-input");
    if (input) setTimeout(() => input.focus(), 150);
  }
  function closePanel() {
    const panel = document.getElementById("avshesh-chat-panel");
    if (!panel) return;
    panel.classList.remove("open");
    setTimeout(() => {
      panel.hidden = true;
    }, 200);
    panelOpen = false;
  }

  function renderSuggestions() {
    const wrap = document.getElementById("av-chat-suggestions");
    if (!wrap) return;
    wrap.innerHTML = "";
    const L = lang();
    SUGGESTIONS.forEach((s) => {
      const chip = el("button", "av-chat-chip");
      chip.type = "button";
      chip.textContent = s[L] || s.en;
      chip.addEventListener("click", () => handleUserMessage(s[L] || s.en));
      wrap.appendChild(chip);
    });
  }

  function addMessage(text, isUser) {
    const messages = document.getElementById("av-chat-messages");
    if (!messages) return;
    const bubble = el("div", "av-chat-msg " + (isUser ? "av-chat-msg-user" : "av-chat-msg-bot"));
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }
  function addBotMessage(text) {
    addMessage(text, false);
    history.push({ role: "bot", text: text });
    saveHistory();
  }
  function addUserMessage(text) {
    addMessage(text, true);
    history.push({ role: "user", text: text });
    saveHistory();
  }
  function renderHistory() {
    history.forEach((m) => addMessage(m.text, m.role === "user"));
  }

  function showTyping() {
    const messages = document.getElementById("av-chat-messages");
    if (!messages) return;
    const bubble = el("div", "av-chat-msg av-chat-msg-bot av-chat-typing");
    bubble.id = "av-chat-typing";
    bubble.innerHTML = "<span></span><span></span><span></span>";
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }
  function hideTyping() {
    const bubble = document.getElementById("av-chat-typing");
    if (bubble) bubble.remove();
  }

  function handleUserMessage(rawText) {
    const text = (rawText || "").trim();
    if (!text) return;
    addUserMessage(text);
    const input = document.getElementById("av-chat-input");
    if (input) input.value = "";
    showTyping();
    setTimeout(() => {
      hideTyping();
      addBotMessage(getBotResponse(text));
    }, 500 + Math.random() * 450);
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("av-chat-input");
    handleUserMessage(input ? input.value : "");
  }

  function refreshForLanguage() {
    const input = document.getElementById("av-chat-input");
    if (input) input.setAttribute("placeholder", t("chatInputPlaceholder", "Ask a question..."));
    const closeBtn = document.getElementById("av-chat-close");
    if (closeBtn) closeBtn.setAttribute("aria-label", t("chatCloseLabel", "Close chat"));
    renderSuggestions();
  }

  function init() {
    loadHistory();
    buildWidget();
    // Keep suggestions / placeholder in sync with the site's language toggle
    document.addEventListener("click", (e) => {
      if (e.target.closest(".lang-switch button")) {
        setTimeout(refreshForLanguage, 30);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);

  window.AvsheshChat = { open: openPanel, close: closePanel };
})();
