# CP Analytics 🚀

[![GitHub Repo stars](https://img.shields.io/github/stars/omveer7850/cp-analytics?style=social)](https://github.com/omveer7850/cp-analytics)
[![GitHub forks](https://img.shields.io/github/forks/omveer7850/cp-analytics?style=social)](https://github.com/omveer7850/cp-analytics)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **Elevator Pitch:** CP Analytics is a comprehensive developer dashboard designed to aggregate, visualize, and benchmark competitive programming performance across multiple global platforms.

---

## 📖 Project Overview
Competitive programmers often struggle to track their progress across fragmented platforms. **CP Analytics** serves as a unified command center, providing real-time data synchronization, historical analytics, and performance comparison tools. Whether you are prepping for coding interviews or tracking contest growth, this dashboard transforms raw platform data into clear, actionable insights.

---

## 🖼 Screenshots

---

## ⚡ Key Features

### 📊 Comprehensive Analytics
*   **Unified Multi-Platform Tracking:** Aggregates performance data from LeetCode, AtCoder, Codeforces, and other major platforms.
*   **Real-time Rating Graphs:** Visualize your rating trajectory across different contests with interactive charts.
*   **Contest History:** Deep-dive into past performances with filters for specific date ranges and platforms.
*   **Advanced Statistics:** Detailed breakdown of solved problems, contest ranks, and historical consistency.

### 👥 Peer Benchmarking
*   **Competitor Comparison:** Side-by-side performance analysis with peers.
*   **Dynamic Highlighting:** Automated detection and visual highlighting of superior metrics in comparison views.

### 🔐 Security & UI
*   **Secure Authentication:** User data and session management powered by Supabase Auth.
*   **Premium Dark-Mode UI:** A high-contrast, responsive interface built for a professional developer experience.

---

## 🛠 Tech Stack
*   **Frontend:** React (Vite), React Router, Custom Vanilla CSS
*   **Backend:** Node.js, Express, Axios
*   **Database & Auth:** Supabase (PostgreSQL)
*   **Integrations:** Clist API, Kenkoooo API, Alfa LeetCode API

---

## 📂 Project Structure
```text
cp-analytics/
├── backend/            # Express.js API server
│   ├── controllers/    # API integration & data processing
│   ├── routes/         # API endpoint definitions
│   └── server.js       # App entry point
├── frontend/           # React SPA
│   ├── src/
│   │   ├── components/ # Reusable UI widgets
│   │   ├── compare/    # Comparison logic & views
│   │   ├── services/   # Third-party API client utilities
│   │   └── App.jsx     # Main layout & routing
└── ...
