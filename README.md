# CP Tracker 🚀

[![GitHub Repo stars](https://img.shields.io/github/stars/omveer7850/cp-analytics?style=social)](https://github.com/omveer7850/cp-analytics)
[![GitHub forks](https://img.shields.io/github/forks/omveer7850/cp-analytics?style=social)](https://github.com/omveer7850/cp-analytics)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **Tagline:** A unified, data-driven dashboard for competitive programming analytics and DSA training.

---

## 📖 Project Overview
CP Tracker is a professional, unified developer dashboard engineered to track, visualize, and benchmark competitive programming performance across multiple global platforms including LeetCode, Codeforces, AtCoder, and CodeChef. Designed for developers who value data-driven growth, this tool streamlines the process of monitoring technical progression and comparing performance against peers.

---

## 🖼 Project Screenshots

<div align="center">

| Dashboard Overview | Dark Mode Dashboard | Platform Stats |
| :---: | :---: | :---: |
| ![Dashboard](1000143633.jpg) | ![Dark Mode](1000143634.jpg) | ![Platform Stats](1000143635.jpg) |

| Rating History | Contest History | DSA Sheet Tracker |
| :---: | :---: | :---: |
| ![Rating History](1000143636.jpg) | ![Contest History](1000143637.jpg) | ![DSA Sheet](1000143638.jpg) |

| Upcoming Contests | Competitor Comparison |
| :---: | :---: |
| ![Contests](1000143639.jpg) | ![Comparison](1000143640.jpg) |

</div>

---

## ⚡ Key Features

### 📊 Comprehensive Analytics
*   **Unified Platform Overview:** Real-time synchronization and status tracking for LeetCode, Codeforces, AtCoder, and CodeChef.
*   **Contest Performance:** Detailed rating history graphs with peak and current rating tracking.
*   **Contest Scheduler:** Integrated upcoming contest feed to keep you updated with registration deadlines.

### 👥 Peer Benchmarking
*   **Competitor Comparison:** Side-by-side performance analysis. Simply enter platform handles to compare global ranks, ratings, and achievements.

### 📚 Learning & Progress
*   **DSA Sheet Tracker:** Dedicated workspace for Grind 169, Striver A2Z, Blind 75, and NeetCode 150 sheets with progress visualization.
*   **GitHub Insights:** Language distribution and repository stats integrated directly into your dev profile.

### 🎨 UI/UX Design
*   **Dual Mode:** Seamless toggling between high-contrast light and professional dark themes.
*   **Interactive Tables:** Clean, searchable tables for contest history and repository management.

---

## 🛠 Tech Stack
*   **Frontend:** React, Vite, React Router, Custom CSS
*   **Backend:** Node.js, Express
*   **Database & Auth:** Supabase (PostgreSQL)
*   **APIs:** Clist API, Kenkoooo API, Alfa LeetCode API

---

## 📂 Folder Structure
```text
cp-analytics/
├── backend/            # Express.js API server
│   ├── controllers/    # API integration logic
│   ├── routes/         # API endpoint definitions
│   └── server.js       # App entry point
├── frontend/           # React SPA
│   ├── src/
│   │   ├── components/ # Reusable UI widgets
│   │   ├── services/   # API client utilities
│   │   └── App.jsx     # Main layout & routing
└── ...
