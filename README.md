# CP Analytics

A professional, unified developer dashboard designed to track, visualize, and analyze competitive programming performance across multiple platforms (LeetCode and AtCoder). Engineered to help developers monitor their growth and benchmark performance against peers.

---

## 🚀 Features

*   **Unified Dashboard:** Real-time rating graphs and comprehensive stats for both LeetCode and AtCoder in a single interface.
*   **Interactive Analytics:** History tracking with dynamic filtering capabilities (Last 10, 25, 50, and All-time contests).
*   **Competitor Compare Mode:** Side-by-side performance comparison with automated highlighting of superior stats in green.
*   **Secure Authentication:** User accounts and session persistence managed via Supabase Auth.
*   **Premium UI/UX:** Responsive dark-themed layout built with highly optimized custom Vanilla CSS.

---

## 🛠 Tech Stack

*   **Frontend:** React (Vite), React Router, Vanilla CSS
*   **Backend:** Node.js, Express, Axios
*   **Database & Auth:** Supabase
*   **APIs:** Clist API (v4), Kenkoooo API (v3), Alfa LeetCode API

---

## 📂 Project Structure

```text
cp-analytics/
├── backend/              # Node.js + Express API server
│   ├── controllers/      # API logic (Clist & Kenkoooo integration)
│   ├── routes/           # Express routes
│   ├── server.js         # Entry point
│   └── .env              # Backend environment variables
└── frontend/             # React application (Vite)
    ├── src/
    │   ├── components/   # Reusable UI widgets
    │   ├── compare/      # Compare page layouts & logics
    │   ├── services/     # Third-party API client utilities
    │   └── App.jsx       # Main layout & routes
    └── .env              # Env variables
