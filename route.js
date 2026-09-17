/* ============================================================
   AVSHESH — route.js
   Builds a pickup route from either the buyer's actual pickup
   requests, or (if none exist yet) a demo set of nearby farmers,
   draws a simple SVG map, and reorders stops with a
   nearest-neighbor heuristic when "Optimize Route" is clicked.
   ============================================================ */

let routeStart = null;
let routeStops = []; // current order

document.addEventListener("DOMContentLoaded", () => {
  const session = AvsheshAuth.getSession();

  // The vehicle/buyer starting point — offset slightly from the
  // shared home reference so it reads as a distinct location on the map.
  routeStart = {
    label: session && session.role === "buyer" ? (session.business || session.name) : "Pickup Vehicle",
    lat: HOME_LOCATION.lat + 0.022,
    lng: HOME_LOCATION.lng + 0.018,
    isBuyer: true,
  };

  routeStops = buildInitialStops();
  render();

  document.getElementById("optimize-btn").addEventListener("click", optimizeRoute);
});

function buildInitialStops() {
  const requests = getRequests();
  let source;
  if (requests.length > 0) {
    source = requests.map((r) => r.snapshot);
  } else {
    // Demo fallback: first 5 seed farmers, in a deliberately non-optimal order
    source = [FARMERS[3], FARMERS[0], FARMERS[4], FARMERS[1], FARMERS[2]];
  }
  return source.map((f) => ({
    id: f.supplyId || f.id,
    name: f.name,
    lat: f.lat,
    lng: f.lng,
    quantity: f.quantity,
    isBuyer: false,
  }));
}

function optimizeRoute() {
  const before = totalRouteDistance(routeStart, routeStops);
  routeStops = nearestNeighborRoute(routeStart, routeStops);
  const after = totalRouteDistance(routeStart, routeStops);

  const reduction = before > 0 ? Math.round(((before - after) / before) * 100) : 0;
  render();

  showToast(
    "✓",
    AvsheshI18n.t("toastRouteTitle"),
    reduction > 0
      ? (AvsheshI18n.getLang() === "hi" ? `दूरी ${reduction}% कम हुई।` : `Distance reduced by ${reduction}%.`)
      : AvsheshI18n.t("toastRouteBody")
  );
}

function render() {
  const distanceKm = totalRouteDistance(routeStart, routeStops);
  const totalResidue = routeStops.reduce((sum, s) => sum + s.quantity, 0);
  const trip = estimateTrip(distanceKm);

  document.getElementById("stat-distance").textContent = `${distanceKm.toFixed(1)} km`;
  document.getElementById("stat-time").textContent = `${trip.timeMinutes} min`;
  document.getElementById("stat-farmer-count").textContent = routeStops.length;
  document.getElementById("stat-residue").textContent = `${totalResidue.toLocaleString()} kg`;
  document.getElementById("stat-fuel").textContent = `${trip.fuelLiters} L`;
  document.getElementById("stat-fuel-cost").textContent = `₹${trip.fuelCost}`;

  renderMap();
  renderList();
}

function renderList() {
  const list = document.getElementById("route-list");
  const items = [
    `<li><span class="order-num">🚚</span> <div><strong>${escapeHtml(routeStart.label)}</strong><div class="hint">Start</div></div></li>`,
  ].concat(
    routeStops.map(
      (s, i) => `
      <li>
        <span class="order-num">${i + 1}</span>
        <div><strong>${escapeHtml(s.name)}</strong><div class="hint">${s.quantity.toLocaleString()} kg</div></div>
      </li>`
    )
  );
  list.innerHTML = items.join("");
}

function renderMap() {
  const svg = document.getElementById("route-svg");
  const points = [routeStart, ...routeStops];

  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const pad = 60;
  const w = 700, h = 420;

  function project(p) {
    const x = maxLng === minLng ? w / 2 : pad + ((p.lng - minLng) / (maxLng - minLng)) * (w - pad * 2);
    // invert y so higher latitude draws higher on screen
    const y = maxLat === minLat ? h / 2 : pad + ((maxLat - p.lat) / (maxLat - minLat)) * (h - pad * 2);
    return { x, y };
  }

  const projected = points.map(project);

  let pathD = `M ${projected[0].x} ${projected[0].y}`;
  for (let i = 1; i < projected.length; i++) {
    pathD += ` L ${projected[i].x} ${projected[i].y}`;
  }

  let markers = "";
  projected.forEach((pt, i) => {
    const point = points[i];
    const isBuyer = point.isBuyer;
    const fill = isBuyer ? "var(--gold)" : "var(--olive-700)";
    const radius = isBuyer ? 12 : 10;
    const label = isBuyer ? "🚚" : String(i);
    markers += `
      <g class="route-marker">
        <circle cx="${pt.x}" cy="${pt.y}" r="${radius}" fill="${fill}" stroke="#fff" stroke-width="2"/>
        <text x="${pt.x}" y="${pt.y + 4}" text-anchor="middle" font-size="${isBuyer ? 11 : 10}" fill="#fff" font-weight="700">${isBuyer ? "🚚" : i}</text>
        <text x="${pt.x}" y="${pt.y + radius + 16}" text-anchor="middle">${escapeHtml(truncate(point.name || point.label, 14))}</text>
      </g>`;
  });

  svg.innerHTML = `<path class="route-path" d="${pathD}"></path>${markers}`;
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
