/* ============================================================
   AVSHESH — listing.js
   Shows one listing's detail plus buyers ranked by match score,
   highest match first. Reads ?id=... from the URL, or falls
   back to the current farmer's most recent listing.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const session = AvsheshAuth.getSession();
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id");

  let listing = null;
  const all = getAllListings();
  if (requestedId) {
    listing = all.find((l) => l.id === requestedId);
  } else if (session && session.role === "farmer") {
    listing = getMyListings(session.phone)[0];
  } else {
    listing = all[0];
  }

  if (!listing) {
    document.getElementById("listing-empty").style.display = "block";
    document.getElementById("listing-empty").querySelector("p").textContent =
      AvsheshI18n.getLang() === "hi"
        ? "अभी कोई लिस्टिंग उपलब्ध नहीं है। एक बनाने के लिए किसान डैशबोर्ड पर जाएं।"
        : "No listing available yet. Head to the farmer dashboard to create one.";
    return;
  }

  document.getElementById("listing-content").style.display = "block";
  renderListing(listing);
});

function renderListing(listing) {
  document.getElementById("l-residue-type").textContent = listing.residueType;
  document.getElementById("l-quantity").textContent = `${listing.quantity.toLocaleString()} kg`;
  document.getElementById("l-price").textContent = `₹${listing.price}/kg`;
  document.getElementById("l-value").textContent = `₹${Math.round(listing.quantity * listing.price).toLocaleString()}`;
  document.getElementById("l-location").textContent = listing.location;
  document.getElementById("l-status").textContent = listing.status;

  const ranked = rankBuyersForListing(listing);
  const best = ranked[0];

  document.getElementById("bm-name").textContent = best.name;
  document.getElementById("bm-distance").textContent = `${best.distanceKm} km`;
  document.getElementById("bm-price").textContent = `₹${best.price}/kg`;
  document.getElementById("bm-score").textContent = `${best.matchScore}%`;

  const buyerList = document.getElementById("buyer-list");
  buyerList.innerHTML = ranked
    .map(
      (b) => `
    <div class="entity-card">
      <div class="entity-avatar">${buyerEmoji(b.type)}</div>
      <div class="entity-main">
        <strong>${b.name}</strong>
        <div class="entity-meta">
          <span class="tag">${b.type}</span>
          <span>${b.distanceKm} km ${AvsheshI18n.t("awayLabel")}</span>
          <span>${AvsheshI18n.t("needsLabel")}: <b>${listing.residueType}</b></span>
          <span>${AvsheshI18n.t("offerLabel")}: <b>₹${b.price}/kg</b></span>
        </div>
      </div>
      <div class="entity-actions">
        <span class="match-badge ${matchClass(b.matchScore)}">${b.matchScore}% ${AvsheshI18n.t("matchLabel")}</span>
        <button class="btn btn-gold btn-sm" onclick="connectWithBuyer('${b.id}', '${b.name.replace(/'/g, "")}')" data-i18n="btnConnect">Connect</button>
      </div>
    </div>`
    )
    .join("");

  AvsheshI18n.apply(AvsheshI18n.getLang());
}

function buyerEmoji(type) {
  const map = {
    "Biomass Plant": "🔥",
    "Biofuel Company": "⛽",
    "Compost Manufacturer": "🌿",
    "Animal Feed Company": "🐄",
    "Paper / Packaging Industry": "📦",
  };
  return map[type] || "🏭";
}

function connectWithBuyer(buyerId, buyerName) {
  showToast("✓", AvsheshI18n.t("toastConnectTitle"), AvsheshI18n.t("toastConnectBody"));
}
