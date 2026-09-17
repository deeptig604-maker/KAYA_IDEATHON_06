/* ============================================================
   AVSHESH — i18n.js
   Simple English / Hindi language toggle.
   Elements tagged data-i18n="key" get their textContent replaced.
   Elements tagged data-i18n-ph="key" get their placeholder replaced.
   ============================================================ */

const DICT = {
  // ---- Brand / common ----
  brandName: { en: "Avshesh", hi: "अवशेष" },
  navDashboard: { en: "Dashboard", hi: "डैशबोर्ड" },
  navMarketplace: { en: "Marketplace", hi: "बाज़ार" },
  navFarmer: { en: "Farmer", hi: "किसान" },
  navBuyer: { en: "Buyer", hi: "खरीदार" },
  navListings: { en: "My Listings", hi: "मेरी लिस्टिंग" },
  navRoute: { en: "Route Optimization", hi: "मार्ग अनुकूलन" },
  navProfile: { en: "Profile", hi: "प्रोफ़ाइल" },
  navLogin: { en: "Login", hi: "लॉगिन" },
  navLogout: { en: "Log out", hi: "लॉग आउट" },

  // ---- Landing page ----
  heroKicker: { en: "A marketplace for farm residue", hi: "फसल अवशेष के लिए एक बाज़ार" },
  heroTitle: { en: "Turn Crop Waste Into Income", hi: "फसल के अवशेष को बनाएं आय" },
  heroLead: { en: "Sell your agricultural residue to nearby buyers instead of burning it.", hi: "अपने कृषि अवशेष को जलाने के बजाय आस-पास के खरीदारों को बेचें।" },
  ctaFarmer: { en: "I am a Farmer", hi: "मैं एक किसान हूँ" },
  ctaBuyer: { en: "I am a Buyer", hi: "मैं एक खरीदार हूँ" },
  roleFarmerDesc: { en: "List residue, get matched, earn more", hi: "अवशेष सूचीबद्ध करें, मिलान पाएं, अधिक कमाएं" },
  roleBuyerDesc: { en: "Find nearby supply, plan pickups", hi: "आस-पास आपूर्ति खोजें, पिकअप की योजना बनाएं" },

  flowTitle: { en: "How Avshesh works", hi: "अवशेष कैसे काम करता है" },
  flowSub: { en: "From a field of stubble to a booked pickup, in five simple steps.", hi: "खेत के अवशेष से लेकर पिकअप बुक होने तक, पाँच सरल चरणों में।" },
  flowFarmer: { en: "Farmer", hi: "किसान" },
  flowList: { en: "List Residue", hi: "अवशेष सूचीबद्ध करें" },
  flowBuyers: { en: "Nearby Buyers", hi: "आस-पास के खरीदार" },
  flowMatch: { en: "Best Match", hi: "सर्वश्रेष्ठ मिलान" },
  flowPickup: { en: "Optimized Pickup", hi: "अनुकूलित पिकअप" },
  flowIncome: { en: "Income + Less Burning", hi: "आय + कम जलाना" },

  featTitle: { en: "Built for the whole exchange", hi: "पूरे लेन-देन के लिए बनाया गया" },
  feat1Title: { en: "Sell Residue", hi: "अवशेष बेचें" },
  feat1Desc: { en: "Farmers can list their available crop residue in under a minute.", hi: "किसान एक मिनट से भी कम समय में अपना उपलब्ध फसल अवशेष सूचीबद्ध कर सकते हैं।" },
  feat2Title: { en: "Find Nearby Buyers", hi: "आस-पास के खरीदार खोजें" },
  feat2Desc: { en: "The system identifies suitable buyers based on distance and residue type.", hi: "प्रणाली दूरी और अवशेष के प्रकार के आधार पर उपयुक्त खरीदारों की पहचान करती है।" },
  feat3Title: { en: "Optimize Pickup", hi: "पिकअप अनुकूलित करें" },
  feat3Desc: { en: "The system suggests an efficient route to collect residue from multiple farms.", hi: "प्रणाली कई खेतों से अवशेष एकत्र करने के लिए एक कुशल मार्ग सुझाती है।" },

  impactTitle: { en: "Impact so far", hi: "अब तक का प्रभाव" },
  impactResidue: { en: "kg Residue Listed", hi: "किलो अवशेष सूचीबद्ध" },
  impactFarmers: { en: "Farmers", hi: "किसान" },
  impactBuyers: { en: "Buyers", hi: "खरीदार" },
  impactCO2: { en: "kg CO₂ Avoided", hi: "किलो CO₂ बचा" },
  impactDisclaimer: { en: "Prototype figures for demonstration purposes.", hi: "प्रदर्शन उद्देश्यों के लिए प्रोटोटाइप आंकड़े।" },

  // ---- Auth ----
  authWelcome: { en: "Welcome to Avshesh", hi: "अवशेष में आपका स्वागत है" },
  authSub: { en: "One account, for listing residue or finding it.", hi: "अवशेष सूचीबद्ध करने या खोजने के लिए एक खाता।" },
  tabLogin: { en: "Log in", hi: "लॉगिन करें" },
  tabSignup: { en: "Create account", hi: "खाता बनाएं" },
  iAmFarmer: { en: "Farmer", hi: "किसान" },
  iAmBuyer: { en: "Buyer / Business", hi: "खरीदार / व्यवसाय" },
  labelName: { en: "Full name", hi: "पूरा नाम" },
  labelPhone: { en: "Phone number", hi: "फ़ोन नंबर" },
  labelLocation: { en: "Location", hi: "स्थान" },
  labelBusiness: { en: "Business / Company name", hi: "व्यवसाय / कंपनी का नाम" },
  labelPassword: { en: "Password", hi: "पासवर्ड" },
  btnLogin: { en: "Log in", hi: "लॉगिन करें" },
  btnSignup: { en: "Create account", hi: "खाता बनाएं" },
  authNoAccount: { en: "New to Avshesh?", hi: "अवशेष में नए हैं?" },
  authHaveAccount: { en: "Already have an account?", hi: "पहले से खाता है?" },
  authSwitchSignup: { en: "Create one", hi: "एक बनाएं" },
  authSwitchLogin: { en: "Log in", hi: "लॉगिन करें" },
  authErrorFill: { en: "Please fill all required fields.", hi: "कृपया सभी आवश्यक फ़ील्ड भरें।" },
  authErrorFind: { en: "No account found with these details. Try creating one.", hi: "इन विवरणों से कोई खाता नहीं मिला। एक बनाने का प्रयास करें।" },

  // ---- Farmer dashboard ----
  farmerGreeting: { en: "Good morning", hi: "सुप्रभात" },
  farmerGreetingSub: { en: "Here's how your residue is doing today.", hi: "आज आपका अवशेष कैसा प्रदर्शन कर रहा है, यहां देखें।" },
  statResidueListed: { en: "Residue Listed", hi: "अवशेष सूचीबद्ध" },
  statEarnings: { en: "Potential Earnings", hi: "संभावित आय" },
  statInterested: { en: "Interested Buyers", hi: "रुचि रखने वाले खरीदार" },
  statPickups: { en: "Pickups Completed", hi: "पूर्ण पिकअप" },
  formTitle: { en: "List Your Crop Residue", hi: "अपना फसल अवशेष सूचीबद्ध करें" },
  labelCropType: { en: "Crop Type", hi: "फसल का प्रकार" },
  labelResidueType: { en: "Residue Type", hi: "अवशेष का प्रकार" },
  labelQuantity: { en: "Quantity (kg)", hi: "मात्रा (किलो)" },
  labelPrice: { en: "Expected Price per kg (₹)", hi: "प्रति किलो अपेक्षित मूल्य (₹)" },
  labelAvailableFrom: { en: "Available From", hi: "कब से उपलब्ध" },
  btnListResidue: { en: "List Residue", hi: "अवशेष सूचीबद्ध करें" },
  myListingsTitle: { en: "My Listings", hi: "मेरी लिस्टिंग" },
  impactYourTitle: { en: "Your Environmental Impact", hi: "आपका पर्यावरणीय प्रभाव" },
  toastListedTitle: { en: "Residue listed successfully!", hi: "अवशेष सफलतापूर्वक सूचीबद्ध हुआ!" },
  toastListedBody: { en: "Your listing is now visible to nearby buyers.", hi: "आपकी लिस्टिंग अब आस-पास के खरीदारों को दिखाई दे रही है।" },
  viewNearbyBuyers: { en: "View Nearby Buyers", hi: "आस-पास के खरीदार देखें" },

  // ---- Listing page ----
  listingQuantity: { en: "Quantity", hi: "मात्रा" },
  listingPrice: { en: "Price", hi: "मूल्य" },
  listingValue: { en: "Expected Value", hi: "अपेक्षित मूल्य" },
  listingLocation: { en: "Location", hi: "स्थान" },
  listingStatus: { en: "Status", hi: "स्थिति" },
  nearbyBuyersTitle: { en: "Nearby Buyers", hi: "आस-पास के खरीदार" },
  bestMatchLabel: { en: "Best Match", hi: "सर्वश्रेष्ठ मिलान" },
  btnViewBuyer: { en: "View Buyer", hi: "खरीदार देखें" },
  btnConnect: { en: "Connect", hi: "जुड़ें" },
  matchLabel: { en: "Match", hi: "मिलान" },
  awayLabel: { en: "away", hi: "दूर" },
  needsLabel: { en: "Needs", hi: "आवश्यकता" },
  offerLabel: { en: "Offer", hi: "प्रस्ताव" },
  earningsLabel: { en: "Est. earnings", hi: "अनुमानित आय" },
  toastConnectTitle: { en: "Interest sent!", hi: "रुचि भेजी गई!" },
  toastConnectBody: { en: "The buyer has been notified of your listing.", hi: "खरीदार को आपकी लिस्टिंग के बारे में सूचित कर दिया गया है।" },

  // ---- Buyer dashboard ----
  buyerHeaderTitle: { en: "Buyer Dashboard", hi: "खरीदार डैशबोर्ड" },
  statAvailableResidue: { en: "Available Residue", hi: "उपलब्ध अवशेष" },
  statNearbyFarmers: { en: "Nearby Farmers", hi: "आस-पास के किसान" },
  statPotentialSupply: { en: "Potential Supply", hi: "संभावित आपूर्ति" },
  statActiveRequests: { en: "Active Requests", hi: "सक्रिय अनुरोध" },
  nearbyResidueTitle: { en: "Nearby Residue", hi: "आस-पास का अवशेष" },
  filterCrop: { en: "All Crops", hi: "सभी फसलें" },
  filterDistance: { en: "Any Distance", hi: "कोई भी दूरी" },
  filterSort: { en: "Sort by", hi: "इसके अनुसार क्रमबद्ध करें" },
  sortDistance: { en: "Nearest first", hi: "निकटतम पहले" },
  sortPrice: { en: "Lowest price first", hi: "सबसे कम कीमत पहले" },
  sortQuantity: { en: "Largest quantity first", hi: "सबसे बड़ी मात्रा पहले" },
  btnViewDetails: { en: "View Details", hi: "विवरण देखें" },
  btnRequestPickup: { en: "Request Pickup", hi: "पिकअप का अनुरोध करें" },
  btnRequested: { en: "Requested", hi: "अनुरोध भेजा गया" },
  toastPickupTitle: { en: "Pickup request sent!", hi: "पिकअप अनुरोध भेजा गया!" },
  toastPickupBody: { en: "The farmer will be notified.", hi: "किसान को सूचित किया जाएगा।" },
  distanceLabel: { en: "Distance", hi: "दूरी" },
  quantityLabel: { en: "Quantity", hi: "मात्रा" },
  priceLabel: { en: "Price", hi: "मूल्य" },
  planRouteCta: { en: "Plan a pickup route for requested farmers", hi: "अनुरोधित किसानों के लिए पिकअप मार्ग बनाएं" },

  // ---- Route page ----
  routeTitle: { en: "Pickup Route", hi: "पिकअप मार्ग" },
  routeTotalDistance: { en: "Total Distance", hi: "कुल दूरी" },
  routeEstTime: { en: "Estimated Time", hi: "अनुमानित समय" },
  routeFarmers: { en: "Farmers", hi: "किसान" },
  routeTotalResidue: { en: "Total Residue", hi: "कुल अवशेष" },
  routeFuel: { en: "Estimated Fuel", hi: "अनुमानित ईंधन" },
  routeFuelCost: { en: "Estimated Fuel Cost", hi: "अनुमानित ईंधन लागत" },
  btnOptimizeRoute: { en: "Optimize Route", hi: "मार्ग अनुकूलित करें" },
  routeOrderTitle: { en: "Pickup order", hi: "पिकअप क्रम" },
  aiNote: { en: "AI-inspired route optimization prototype — a nearest-neighbor heuristic, not a trained AI model.", hi: "AI-प्रेरित मार्ग अनुकूलन प्रोटोटाइप — यह एक निकटतम-पड़ोसी नियम है, प्रशिक्षित AI मॉडल नहीं।" },
  toastRouteTitle: { en: "Route optimized!", hi: "मार्ग अनुकूलित हुआ!" },
  toastRouteBody: { en: "Distance reduced.", hi: "दूरी कम हुई।" },

  // ---- Generic ----
  footerTag: { en: "Reducing stubble burning, one pickup at a time.", hi: "एक-एक पिकअप से पराली जलाना कम करना।" },
  loginRequiredFarmer: { en: "Please log in as a farmer to continue.", hi: "जारी रखने के लिए कृपया किसान के रूप में लॉगिन करें।" },
  loginRequiredBuyer: { en: "Please log in as a buyer to continue.", hi: "जारी रखने के लिए कृपया खरीदार के रूप में लॉगिन करें।" },

  // ---- Chatbot assistant ----
  chatFabLabel: { en: "Chat with Avshesh Assistant", hi: "अवशेष सहायक से चैट करें" },
  chatTitle: { en: "Avshesh Assistant", hi: "अवशेष सहायक" },
  chatSubtitle: { en: "Here to help you get around", hi: "आपकी मदद के लिए यहां है" },
  chatCloseLabel: { en: "Close chat", hi: "चैट बंद करें" },
  chatSendLabel: { en: "Send", hi: "भेजें" },
  chatInputPlaceholder: { en: "Ask a question...", hi: "एक प्रश्न पूछें..." },
  chatGreeting: {
    en: "Hi! I'm the Avshesh assistant. Ask me anything about using the site, or tap a suggestion below.",
    hi: "नमस्ते! मैं अवशेष सहायक हूँ। साइट का उपयोग करने के बारे में मुझसे कुछ भी पूछें, या नीचे दिए गए किसी सुझाव पर टैप करें।",
  },

  // ---- Onboarding tour ----
  tourLoginTitle: { en: "Start here", hi: "यहाँ से शुरू करें" },
  tourLoginBody: { en: "Create an account or log in to access all features.", hi: "सभी सुविधाओं तक पहुंचने के लिए खाता बनाएं या लॉगिन करें।" },
  tourLangTitle: { en: "Choose your language", hi: "अपनी भाषा चुनें" },
  tourLangBody: { en: "Choose your preferred language here.", hi: "अपनी पसंदीदा भाषा यहां चुनें।" },
  tourNavTitle: { en: "Get around", hi: "नेविगेट करें" },
  tourNavBody: { en: "Use this menu to explore different sections of the website.", hi: "वेबसाइट के विभिन्न अनुभागों को देखने के लिए इस मेनू का उपयोग करें।" },
  tourFeatureTitle: { en: "The main feature", hi: "मुख्य विशेषता" },
  tourFeatureBody: { en: "This is the main feature of our platform. Click here to get started.", hi: "यह हमारे प्लेटफ़ॉर्म की मुख्य विशेषता है। शुरू करने के लिए यहां क्लिक करें।" },
  tourProfileTitle: { en: "Your profile", hi: "आपकी प्रोफ़ाइल" },
  tourProfileBody: { en: "Manage your profile and account settings here.", hi: "अपनी प्रोफ़ाइल और खाता सेटिंग्स यहां प्रबंधित करें।" },
  tourChatTitle: { en: "Need a hand?", hi: "मदद चाहिए?" },
  tourChatBody: { en: "Need help? Ask our AI assistant anytime.", hi: "मदद चाहिए? कभी भी हमारे AI सहायक से पूछें।" },
  tourDoneTitle: { en: "You're all set!", hi: "आप तैयार हैं!" },
  tourDoneBody: {
    en: "You now know the basics. You can always ask our AI assistant if you need help.",
    hi: "अब आप मूल बातें जानते हैं। यदि आपको मदद चाहिए तो आप हमेशा हमारे AI सहायक से पूछ सकते हैं।",
  },
  tourNext: { en: "Next", hi: "अगला" },
  tourBack: { en: "Back", hi: "पीछे" },
  tourSkip: { en: "Skip Tour", hi: "टूर छोड़ें" },
  tourFinish: { en: "Finish", hi: "समाप्त" },
  tourGotIt: { en: "Got it", hi: "समझ गया" },
  tourRestartLabel: { en: "Take the tour again", hi: "फिर से टूर लें" },
};

const AvsheshI18n = (function () {
  const STORAGE_KEY = "avshesh_lang";

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    apply(lang);
  }

  function t(key) {
    const lang = getLang();
    const entry = DICT[key];
    if (!entry) return key;
    return entry[lang] || entry.en;
  }

  function apply(lang) {
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
  }

  function init() {
    apply(getLang());
    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
    });
  }

  return { getLang, setLang, t, apply, init };
})();
