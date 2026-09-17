/* ============================================================
   AVSHESH — buyer.js
   Buyer dashboard: combines the seed FARMERS with any residue
   farmers have listed through the app, lets the buyer filter/sort,
   and lets them request a pickup (feeding the Route page).
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("farmer-list")) return; // not the buyer dashboard page

  const session = requireRole("buyer");
  if (!session) return;

  document.getElementById("buyer-sub").textContent =
    (AvsheshI18n.getLang() === "hi" ? "स्वागत है, " : "Welcome back, ") + session.name.split(" ")[0];

  const supply = getCombinedSupply();
  populateCropFilter(supply);
  renderStats(supply);
  renderFarmerList(supply);

  ["filter-crop", "filter-distance", "filter-sort"].forEach((id) => {
    document.getElementById(id).addEventListener("change", () => renderFarmerList(supply));
  });
});

function populateCropFilter(supply) {
  const select = document.getElementById("filter-crop");
  const distinct = [...new Set(supply.map((s) => s.residueType))];
  distinct.forEach((type) => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    select.appendChild(opt);
  });
}

function renderStats(supply) {
  const totalKg = supply.reduce((sum, s) => sum + s.quantity, 0);
  const totalValue = supply.reduce((sum, s) => sum + s.quantity * s.price, 0);
  const requests = getRequests();

  document.getElementById("stat-available").textContent = `${totalKg.toLocaleString()} kg`;
  document.getElementById("stat-farmers").textContent = supply.length;
  document.getElementById("stat-supply").textContent = `₹${Math.round(totalValue).toLocaleString()}`;
  document.getElementById("stat-requests").textContent = requests.length;
}

function renderFarmerList(supply) {
  const cropFilter = document.getElementById("filter-crop").value;
  const distanceFilter = Number(document.getElementById("filter-distance").value);
  const sortBy = document.getElementById("filter-sort").value;

  let filtered = supply.filter((s) => {
    if (cropFilter && s.residueType !== cropFilter) return false;
    if (distanceFilter && s.distanceKm > distanceFilter) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "quantity") return b.quantity - a.quantity;
    return a.distanceKm - b.distanceKm;
  });

  const list = document.getElementById("farmer-list");
  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state"><div class="icon">🔍</div><p>${
      AvsheshI18n.getLang() === "hi" ? "इन फ़िल्टर से कोई परिणाम नहीं मिला।" : "No results match these filters."
    }</p></div>`;
    return;
  }

  const requestedIds = new Set(getRequests().map((r) => r.supplyId));

  list.innerHTML = filtered
    .map((s) => {
      const alreadyRequested = requestedIds.has(s.supplyId);
      return `
      <div class="entity-card">
        <div class="entity-avatar">🧑‍🌾</div>
        <div class="entity-main">
          <strong>${s.name}</strong>
          <div class="entity-meta">
            <span class="tag">${s.residueType}</span>
            <span>${AvsheshI18n.t("quantityLabel")}: <b>${s.quantity.toLocaleString()} kg</b></span>
            <span>${AvsheshI18n.t("distanceLabel")}: <b>${s.distanceKm} km</b></span>
            <span>${AvsheshI18n.t("priceLabel")}: <b>₹${s.price}/kg</b></span>
            <span>${s.location}</span>
          </div>
        </div>
        <div class="entity-actions">
          <button class="btn btn-outline btn-sm" onclick="viewFarmerDetails('${s.supplyId}')" data-i18n="btnViewDetails">View Details</button>
          <button class="btn btn-gold btn-sm" ${alreadyRequested ? "disabled" : ""} onclick="requestPickup('${s.supplyId}')" data-i18n="${alreadyRequested ? "btnRequested" : "btnRequestPickup"}">
            ${alreadyRequested ? AvsheshI18n.t("btnRequested") : AvsheshI18n.t("btnRequestPickup")}
          </button>
        </div>
      </div>`;
    })
    .join("");

  AvsheshI18n.apply(AvsheshI18n.getLang());
}

function viewFarmerDetails(supplyId) {
  // For seed farmers there's no dedicated detail page in this prototype;
  // for real listings, send the buyer to that listing's page.
  if (supplyId.startsWith("l")) {
    window.location.href = `listing.html?id=${supplyId}`;
  } else {
    showToast("ℹ️", supplyId, AvsheshI18n.getLang() === "hi" ? "विवरण मार्ग पृष्ठ पर पिकअप योजना में दिखाई देंगे।" : "Full details appear once you plan a pickup route.");
  }
}

function requestPickup(supplyId) {
  const supply = getCombinedSupply();
  const item = supply.find((s) => s.supplyId === supplyId);
  if (!item) return;

  const session = AvsheshAuth.getSession();
  const requests = getRequests();
  requests.push({
    supplyId,
    buyerPhone: session.phone,
    snapshot: item,
    requestedAt: Date.now(),
  });
  saveRequests(requests);

  showToast("✓", AvsheshI18n.t("toastPickupTitle"), AvsheshI18n.t("toastPickupBody"));
  renderStats(supply);
  renderFarmerList(supply);
}
