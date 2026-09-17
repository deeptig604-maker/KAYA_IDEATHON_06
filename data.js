/* ============================================================
   AVSHESH — data.js
   Simulated data: buyers, farmers, distance math, and the
   nearest-buyer / route-optimization matching logic.
   No backend, no real maps API — everything runs client-side.
   ============================================================ */

// A reference point roughly in Mathura, Uttar Pradesh, used as the
// farmer's "home" location for prototype distance calculations.
const HOME_LOCATION = { lat: 27.4924, lng: 77.6737 };

// ---------------- Buyers (5+) ----------------
const BUYERS = [
  {
    id: "b1",
    name: "GreenBio Energy",
    type: "Biomass Plant",
    lat: 27.5121,
    lng: 77.6902,
    residueTypes: ["Wheat Straw", "Rice Straw"],
    price: 3.8,
    maxQuantity: 5000,
  },
  {
    id: "b2",
    name: "EcoFuel Pvt Ltd",
    type: "Biofuel Company",
    lat: 27.4630,
    lng: 77.6390,
    residueTypes: ["Sugarcane Residue", "Corn Stalks", "Wheat Straw"],
    price: 3.6,
    maxQuantity: 8000,
  },
  {
    id: "b3",
    name: "Bhoomi Compost Works",
    type: "Compost Manufacturer",
    lat: 27.5310,
    lng: 77.7205,
    residueTypes: ["Rice Straw", "Cotton Residue", "Other"],
    price: 2.9,
    maxQuantity: 4000,
  },
  {
    id: "b4",
    name: "Pashudhan Feed Co.",
    type: "Animal Feed Company",
    lat: 27.4405,
    lng: 77.7010,
    residueTypes: ["Wheat Straw", "Corn Stalks"],
    price: 4.1,
    maxQuantity: 3000,
  },
  {
    id: "b5",
    name: "Yamuna Paper Mills",
    type: "Paper / Packaging Industry",
    lat: 27.4980,
    lng: 77.6120,
    residueTypes: ["Sugarcane Residue", "Cotton Residue"],
    price: 3.2,
    maxQuantity: 6000,
  },
  {
    id: "b6",
    name: "Brij Biofuels",
    type: "Biofuel Company",
    lat: 27.4760,
    lng: 77.7350,
    residueTypes: ["Rice Straw", "Wheat Straw", "Other"],
    price: 3.5,
    maxQuantity: 5000,
  },
];

// ---------------- Farmers (6+, used for the buyer dashboard demo) ----------------
const FARMERS = [
  {
    id: "f1",
    name: "Rajesh Kumar",
    lat: 27.4995,
    lng: 77.6810,
    residueType: "Wheat Straw",
    quantity: 750,
    price: 3.5,
    location: "Mathura, Uttar Pradesh",
  },
  {
    id: "f2",
    name: "Suman Devi",
    lat: 27.4700,
    lng: 77.6550,
    residueType: "Rice Straw",
    quantity: 600,
    price: 2.8,
    location: "Vrindavan Road, Mathura",
  },
  {
    id: "f3",
    name: "Mahesh Chaudhary",
    lat: 27.5205,
    lng: 77.7120,
    residueType: "Sugarcane Residue",
    quantity: 1200,
    price: 2.6,
    location: "Chhata, Mathura",
  },
  {
    id: "f4",
    name: "Geeta Sharma",
    lat: 27.4550,
    lng: 77.6900,
    residueType: "Corn Stalks",
    quantity: 500,
    price: 3.1,
    location: "Baldeo, Mathura",
  },
  {
    id: "f5",
    name: "Om Prakash Yadav",
    lat: 27.5080,
    lng: 77.6420,
    residueType: "Cotton Residue",
    quantity: 400,
    price: 4.0,
    location: "Farah, Mathura",
  },
  {
    id: "f6",
    name: "Kamla Bai",
    lat: 27.4880,
    lng: 77.7280,
    residueType: "Wheat Straw",
    quantity: 900,
    price: 3.4,
    location: "Goverdhan, Mathura",
  },
];

/* ---------------- Haversine distance (km) ----------------
   Standard great-circle distance formula between two lat/lng points. */
function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ---------------- Matching algorithm ----------------
   Match Score = 40% residue compatibility + 30% distance
                + 20% price + 10% quantity compatibility
   Returns a 0-100 score plus the raw distance in km. */
function computeMatchScore(listing, buyer) {
  // 1. Residue compatibility (40%)
  const residueMatch = buyer.residueTypes.includes(listing.residueType) ? 1 : 0.15;

  // 2. Distance (30%) — closer is better. Anything beyond 25km scores ~0.
  const distanceKm = haversineDistanceKm(
    listing.lat, listing.lng, buyer.lat, buyer.lng
  );
  const distanceScore = Math.max(0, 1 - distanceKm / 25);

  // 3. Price (20%) — buyer offering at or above the farmer's asking price scores highest.
  const priceRatio = buyer.price / listing.price;
  const priceScore = Math.min(1, Math.max(0, priceRatio > 1 ? 1 : priceRatio));

  // 4. Quantity compatibility (10%) — can the buyer absorb the whole listing?
  const quantityScore = Math.min(1, buyer.maxQuantity / listing.quantity);

  const weighted =
    residueMatch * 0.4 + distanceScore * 0.3 + priceScore * 0.2 + quantityScore * 0.1;

  return {
    score: Math.round(weighted * 100),
    distanceKm: Math.round(distanceKm * 10) / 10,
  };
}

/* Ranks every buyer for a given listing, best match first. */
function rankBuyersForListing(listing) {
  return BUYERS.map((buyer) => {
    const { score, distanceKm } = computeMatchScore(listing, buyer);
    return { ...buyer, matchScore: score, distanceKm };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

/* ---------------- Route optimization (nearest-neighbor) ----------------
   Starting from `start` {lat,lng}, repeatedly visit the closest
   unvisited stop until all stops are visited. Returns the ordered list. */
function nearestNeighborRoute(start, stops) {
  const remaining = [...stops];
  const ordered = [];
  let current = start;

  while (remaining.length) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((stop, idx) => {
      const d = haversineDistanceKm(current.lat, current.lng, stop.lat, stop.lng);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = idx;
      }
    });
    const next = remaining.splice(nearestIdx, 1)[0];
    ordered.push(next);
    current = next;
  }
  return ordered;
}

/* Total distance in km for a start point + an ordered list of stops. */
function totalRouteDistance(start, orderedStops) {
  let total = 0;
  let current = start;
  orderedStops.forEach((stop) => {
    total += haversineDistanceKm(current.lat, current.lng, stop.lat, stop.lng);
    current = stop;
  });
  return total;
}

/* ---------------- Trip estimates ----------------
   Prototype constants used purely for demonstration. */
const AVG_SPEED_KMH = 35;
const FUEL_KMPL = 10;
const FUEL_PRICE_PER_L = 95;
const CO2_KG_PER_KG_RESIDUE = 1.46; // dummy conversion factor for the impact calculator

function estimateTrip(distanceKm) {
  const timeMinutes = Math.round((distanceKm / AVG_SPEED_KMH) * 60);
  const fuelLiters = Math.round((distanceKm / FUEL_KMPL) * 100) / 100;
  const fuelCost = Math.round(fuelLiters * FUEL_PRICE_PER_L);
  return { timeMinutes, fuelLiters, fuelCost };
}

function estimateCO2Avoided(kg) {
  return Math.round(kg * CO2_KG_PER_KG_RESIDUE);
}

/* ---------------- Listings storage ----------------
   Farmer-created listings live in localStorage so they survive reloads.
   Shared across farmer.js, listing.js and buyer.js. */
const LISTINGS_KEY = "avshesh_listings";

function getAllListings() {
  return JSON.parse(localStorage.getItem(LISTINGS_KEY) || "[]");
}
function saveAllListings(listings) {
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
}
function getMyListings(ownerPhone) {
  return getAllListings().filter((l) => l.ownerPhone === ownerPhone);
}
function matchClass(score) {
  if (score >= 80) return "high";
  if (score >= 55) return "mid";
  return "low";
}

/* ---------------- Pickup requests storage ----------------
   Created when a buyer clicks "Request Pickup". Read by the
   Route Optimization page to build the day's pickup list. */
const REQUESTS_KEY = "avshesh_requests";

function getRequests() {
  return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]");
}
function saveRequests(requests) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

/* Combine the seed FARMERS with real listings created through the
   farmer dashboard into one "supply" array with a consistent shape. */
function getCombinedSupply() {
  const seed = FARMERS.map((f) => ({
    supplyId: f.id,
    name: f.name,
    residueType: f.residueType,
    quantity: f.quantity,
    price: f.price,
    location: f.location,
    lat: f.lat,
    lng: f.lng,
  }));

  const listed = getAllListings()
    .filter((l) => l.status === "Available")
    .map((l) => ({
      supplyId: l.id,
      name: l.farmerName,
      residueType: l.residueType,
      quantity: l.quantity,
      price: l.price,
      location: l.location,
      lat: l.lat,
      lng: l.lng,
    }));

  return [...listed, ...seed].map((item) => ({
    ...item,
    distanceKm: Math.round(haversineDistanceKm(HOME_LOCATION.lat, HOME_LOCATION.lng, item.lat, item.lng) * 10) / 10,
  }));
}
