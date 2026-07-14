# CP Analytics 🚀

[![GitHub Repo stars](https://img.shields.io/github/stars/omveer7850/cp-analytics?style=social)](https://github.com/omveer7850/cp-analytics)
[![GitHub forks](https://img.shields.io/github/forks/omveer7850/cp-analytics?style=social)](https://github.com/omveer7850/cp-analytics)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **Elevator Pitch:** CP Analytics is a professional, unified developer dashboard engineered to track, visualize, and benchmark competitive programming performance across LeetCode and AtCoder.

---

## 📖 Project Overview
Competitive programmers often struggle to maintain a holistic view of their progress across multiple platforms. **CP Analytics** solves this by providing a centralized hub for real-time rating tracking and performance analysis. Designed for developers who value data-driven growth, this tool streamlines the process of monitoring your technical progression and comparing it against competitive peers.

---

## 🖼 Screenshots
*(Add your project screenshots here to grab recruiter attention)*

| Dashboard Overview | Competitor Comparison |
| :---: | :---: |
| 🚧 [Insert Screenshot] | 🚧 [Insert Screenshot] |

---

## ⚡ Key Features

### 📊 Dashboard & Analytics
*   **Unified Tracking:** Real-time rating graphs and comprehensive stats for both LeetCode and AtCoder in a single, high-performance interface.
*   **Interactive Analytics:** History tracking with dynamic filtering (Last 10, 25, 50, and All-time contests).
*   **Competitor Compare Mode:** Side-by-side benchmarking with intelligent stat-highlighting to identify strengths and weaknesses.

### 🔐 Security & UX
*   **Secure Authentication:** Session persistence and user profile management powered by Supabase Auth.
*   **Premium UI:** Highly responsive, dark-themed dashboard built with optimized Vanilla CSS for a smooth developer experience.

---

## 🛠 Tech Stack
*   **Frontend:** React (Vite), React Router, Vanilla CSS
*   **Backend:** Node.js, Express, Axios
*   **Database & Auth:** Supabase (PostgreSQL)
*   **APIs:** Clist API (v4), Kenkoooo API (v3), Alfa LeetCode API

---

## 📂 Project Structure
```text
cp-analytics/
├── backend/            # Express.js API server
│   ├── controllers/    # API logic (Clist & Kenkoooo integration)
│   ├── routes/         # API routes
│   └── server.js       # App entry point
├── frontend/           # React SPA
│   ├── src/
│   │   ├── components/ # Reusable UI widgets
│   │   ├── services/   # API client utilities
│   │   └── App.jsx     # Routing & Main Layout
└── ...
