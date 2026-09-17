# 🌾 Avshesh — Turn Crop Waste Into Income

**Avshesh** (अवशेष, "residue") is a front-end prototype marketplace that connects **farmers** who have surplus crop residue with nearby **buyers** — biomass plants, biofuel companies, compost manufacturers, animal feed producers, and paper mills — so that residue gets sold instead of burned.

Built for a campus **Ideathon**, this is a static, no-backend web app that simulates the full experience end-to-end: listing residue, discovering nearby buyers, smart matching, route-optimized pickups, and a bilingual, assistant-guided UI.

> 🔥 **The problem:** India generates 500M+ tonnes of crop residue every year, and roughly 30% of it is openly burnt in fields — a major contributor to hazardous winter air quality. Avshesh gives farmers an easier, more profitable alternative to burning.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌱 **List Residue Fast** | Farmers list crop type, residue type, quantity, price and pickup location in under a minute. |
| 🎯 **Smart Buyer Matching** | Every listing is scored against all buyers using a weighted algorithm — residue-type fit (40%), distance (30%), price (20%), quantity capacity (10%) — and ranked best-match-first. |
| 🗺️ **AI-Inspired Route Optimization** | A nearest-neighbour routing heuristic sequences multi-farm pickups to minimize total travel distance, with live distance, time, fuel and fuel-cost estimates. |
| 🤖 **Built-in Chat Assistant** | A floating, keyword-matched FAQ assistant answers "how do I…" questions about the site instantly, in English or Hindi. |
| 🧭 **Guided Onboarding Tour** | A dynamic, page-aware first-visit walkthrough highlights key UI elements — built from whatever exists on the current page, so it never errors out. |
| 🌐 **Full Bilingual UI** | Every screen — labels, buttons, the chatbot, the tour — toggles instantly between **English** and **Hindi (हिंदी)**. |
| 🌍 **Environmental Impact Tracker** | Each farmer dashboard estimates kg of residue diverted and kg of CO₂ avoided, based on their listings. |
| 🔐 **Simulated Authentication** | Role-based signup/login (Farmer or Buyer/Business) persisted in `localStorage` — no backend required to try the full flow. |

---

## 📸 Screenshots

| Homepage | Farmer Dashboard |
|---|---|
| Landing page with role selection and a 5-step "how it works" flow | Listing form, live stats, and environmental impact tracker |

| Buyer Marketplace | Route Optimization |
|---|---|
| Filterable, distance-sorted nearby residue feed | Nearest-neighbour pickup route with map, order, and trip estimate |

*(See the `/screenshots` folder or the project presentation deck for full visuals.)*

---

## 🧭 How It Works

```
🌾 Farmer → 📋 List Residue → 🏭 Nearby Buyers → 🎯 Best Match → 🚚 Optimized Pickup → 💰 Income + Less Burning
```

1. A farmer signs up and lists their crop residue (type, quantity, price, location).
2. The matching engine ranks every buyer against that listing by residue-type fit, distance, price and quantity capacity.
3. Buyers browse a marketplace of nearby listings, filter by crop/distance/price, and request pickup.
4. When a buyer has multiple pickup requests, the route optimizer sequences them into an efficient multi-stop trip.
5. Every kg diverted from burning is tallied into a simple CO₂-avoided estimate.

---

## 🛠️ Tech Stack

- **HTML5 / CSS3** — no framework, hand-rolled responsive layout (`css/style.css`, `css/enhance.css`)
- **Vanilla JavaScript (ES6)** — no build step, no dependencies
- **`localStorage`** — simulates a backend for auth, listings, requests and onboarding state
- **Custom i18n engine** (`js/i18n.js`) — `data-i18n` attribute-driven English/Hindi translation
- **Nearest-neighbour heuristic** (`js/data.js`, `js/route.js`) — route optimization using the Haversine formula for distance
- **Inline SVG** — hero illustration and route map, no external image assets required

---

## 📁 Project Structure

```
avshesh/
├── index.html          # Landing page — hero, "how it works" flow, features, impact stats
├── login.html           # Role-based (Farmer / Buyer) signup & login
├── farmer.html           # Farmer dashboard — create listings, view stats & impact
├── buyer.html            # Buyer dashboard — browse & filter nearby residue
├── listing.html          # Single listing detail — ranked nearby buyers
├── route.html            # Pickup route planner & optimizer
├── css/
│   ├── style.css         # Core design system (olive-green palette, layout, components)
│   └── enhance.css       # Extra polish & responsive tweaks
├── js/
│   ├── app.js             # Shared auth (simulated), toasts, navbar behaviour
│   ├── data.js             # Buyers/farmers seed data, matching + route algorithms
│   ├── i18n.js              # English/Hindi translation engine
│   ├── login.js              # Signup / login form logic
│   ├── farmer.js              # Farmer dashboard logic
│   ├── buyer.js                # Buyer dashboard logic
│   ├── listing.js               # Listing detail page logic
│   ├── route.js                  # Route builder, map rendering, optimizer
│   ├── chatbot.js                 # Floating FAQ assistant
│   └── onboarding.js               # First-time guided tour
└── assets/
    └── README.txt          # Notes on adding real imagery (none required to run)
```

---

## 🚀 Getting Started

No build tools, no `npm install`, no backend — just open it.

```bash
# Clone the repo
git clone https://github.com/<your-username>/avshesh.git
cd avshesh

# Open directly in a browser…
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux

# …or serve it locally (recommended, avoids any file:// quirks)
python3 -m http.server 8000
# then visit http://localhost:8000
```

Try it out:
1. Click **"I am a Farmer"** → create an account → list some residue.
2. Log out, click **"I am a Buyer"** → create an account → browse the marketplace → request a pickup.
3. Visit **Route Optimization** to see the pickup route planner in action.
4. Toggle **EN / हिं** in the navbar, or open the chat bubble in the bottom-right corner any time.

---

## 🎯 Matching Algorithm

Each buyer is scored against a listing out of 100:

| Factor | Weight | Logic |
|---|---|---|
| Residue-type fit | 40% | Does the buyer accept this residue type? |
| Distance | 30% | Score decays linearly to 0 beyond 25 km |
| Price | 20% | Higher buyer offer relative to farmer's asking price scores better |
| Quantity capacity | 10% | Can the buyer absorb the full listed quantity? |

## 🗺️ Route Optimization Algorithm

A classic **nearest-neighbour heuristic**: starting from the buyer's location, repeatedly jump to the closest unvisited stop until every pickup is included. Distances use the **Haversine formula** on stop coordinates. Trip time, fuel use and fuel cost are then derived from the total route distance.

---

## 🌱 Roadmap

- [ ] Real-time buyer notifications & in-app payments
- [ ] Live GPS-based route optimization (replace prototype coordinates)
- [ ] Upgrade the chatbot from keyword-matched FAQ to a full LLM backend
- [ ] Persist data to a real backend/database instead of `localStorage`
- [ ] Pilot with agricultural cooperatives at the state level

---

## ⚠️ Prototype Disclaimer

This is a **static front-end prototype built for an Ideathon submission**. There is no real backend, payment processing, or live buyer/farmer network — all data (users, listings, buyers, impact stats) is simulated and stored in the browser's `localStorage`. Figures such as "500+ kg residue listed" or "850+ kg CO₂ avoided" shown in the UI are illustrative demo values, not live metrics.

---

## 📄 License

This project was built for an academic Ideathon submission. Add your preferred license here (e.g. MIT) before making the repository public.

---

## 🙏 Acknowledgements

Built with ❤️ to help reduce stubble burning, one pickup at a time.
