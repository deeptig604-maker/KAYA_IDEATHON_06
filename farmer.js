/* ============================================================
   AVSHESH — farmer.js
   Farmer dashboard: create listings (saved to localStorage),
   show quick stats, and a simple environmental impact estimate.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("listing-form")) return; // not the farmer dashboard page

  const session = requireRole("farmer");
  if (!session) return; // requireRole already redirected to login

  document.getElementById("greeting-name").textContent = `, ${session.name.split(" ")[0]}`;
  document.getElementById("f-location").value = session.location || "Mathura, Uttar Pradesh";
  document.getElementById("f-date").valueAsDate = new Date();

  renderDashboard(session);

  document.getElementById("listing-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const quantity = Number(document.getElementById("f-quantity").value);
    const price = Number(document.getElementById("f-price").value);

    const listing = {
      id: "l" + Date.now(),
      ownerPhone: session.phone,
      farmerName: session.name,
      cropType: document.getElementById("f-crop").value,
      residueType: document.getElementById("f-residue-type").value,
      quantity,
      price,
      location: document.getElementById("f-location").value,
      availableFrom: document.getElementById("f-date").value,
      // Small jitter around Mathura so each listing has a distinct point for distance math
      lat: HOME_LOCATION.lat + (Math.random() - 0.5) * 0.06,
      lng: HOME_LOCATION.lng + (Math.random() - 0.5) * 0.06,
      status: "Available",
      createdAt: Date.now(),
    };

    const listings = getAllListings();
    listings.unshift(listing);
    saveAllListings(listings);

    showToast("✓", AvsheshI18n.t("toastListedTitle"), AvsheshI18n.t("toastListedBody"));
    renderDashboard(session);
    e.target.reset();
    document.getElementById("f-quantity").value = 1000;
    document.getElementById("f-price").value = 3.5;
    document.getElementById("f-location").value = session.location || "Mathura, Uttar Pradesh";
    document.getElementById("f-date").valueAsDate = new Date();
  });
});

function renderDashboard(session) {
  const myListings = getMyListings(session.phone);
  const container = document.getElementById("listings-container");

  // ---- Quick stats ----
  const totalKg = myListings.reduce((sum, l) => sum + l.quantity, 0);
  const potentialEarnings = myListings.reduce((sum, l) => sum + l.quantity * l.price, 0);
  const interestedBuyers = myListings.reduce((sum, l) => {
    return sum + rankBuyersForListing(l).filter((b) => b.matchScore >= 70).length;
  }, 0);
  const seededPickups = Number(localStorage.getItem("avshesh_pickups_" + session.phone) || 0);

  document.getElementById("stat-listed").textContent = `${totalKg.toLocaleString()} kg`;
  document.getElementById("stat-earnings").textContent = `₹${Math.round(potentialEarnings).toLocaleString()}`;
  document.getElementById("stat-interested").textContent = interestedBuyers;
  document.getElementById("stat-pickups").textContent = seededPickups;

  // ---- Impact calculator ----
  document.getElementById("impact-kg").textContent = `${totalKg.toLocaleString()} kg`;
  document.getElementById("impact-co2").textContent = `${estimateCO2Avoided(totalKg).toLocaleString()} kg`;

  // ---- My Listings list ----
  if (!myListings.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🌾</div>
        <p>${AvsheshI18n.getLang() === "hi" ? "अभी तक कोई लिस्टिंग नहीं। ऊपर फ़ॉर्म भरकर शुरुआत करें।" : "No listings yet. Fill out the form above to get started."}</p>
      </div>`;
    return;
  }

  container.innerHTML = myListings
    .map((l) => {
      const best = rankBuyersForListing(l)[0];
      return `
      <div class="entity-card">
        <div class="entity-avatar">🌾</div>
        <div class="entity-main">
          <strong>${l.residueType} — ${l.quantity.toLocaleString()} kg</strong>
          <div class="entity-meta">
            <span>${AvsheshI18n.t("listingPrice")}: <b>₹${l.price}/kg</b></span>
            <span>${l.location}</span>
            <span class="status-pill available">${l.status}</span>
          </div>
        </div>
        <div class="entity-actions">
          <span class="match-badge ${matchClass(best.matchScore)}">🎯 ${best.name} · ${best.matchScore}%</span>
          <a href="listing.html?id=${l.id}" class="btn btn-outline btn-sm" data-i18n="viewNearbyBuyers">View Nearby Buyers</a>
        </div>
      </div>`;
    })
    .join("");

  AvsheshI18n.apply(AvsheshI18n.getLang());
}
