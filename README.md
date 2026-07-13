# CP Tracker 🚀

[![GitHub Repo stars](https://img.shields.io/github/stars/yourusername/cp-tracker?style=social)](https://github.com/yourusername/cp-tracker)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/cp-tracker?style=social)](https://github.com/yourusername/cp-tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **One-line Tagline:** A unified dashboard for competitive programming analytics and DSA training.

---

## 📖 Project Overview
Competitive programmers often struggle to maintain a holistic view of their progress across different platforms like LeetCode, Codeforces, and AtCoder. **CP Tracker** solves this by aggregating data, visualizing growth trends, and providing advanced comparison tools to optimize your training regimen. Whether you are prepping for FAANG interviews or climbing the leaderboard, this dashboard turns raw data into a roadmap for mastery.

---

## ⚡ Features

### 📊 Dashboard & Analytics
*   **Platform Integration:** Real-time synchronization with major competitive programming platforms.
*   **Performance Visualization:** Advanced charts displaying rating history, contest participation, and problem-solving velocity.
*   **Dynamic Filtering:** Analyze your performance over various time windows (Last 10, 25, 50, and All-time).
*   **Competitor Comparison:** Side-by-side benchmarking against peers with automated performance highlighting.

### 📚 DSA & Progress Tracking
*   **DSA Sheet Integration:** Track your completion progress on industry-standard coding sheets.
*   **Progress Indicators:** Visual progress bars for topic-wise mastery.
*   **Submission History:** Persistent storage and retrieval of past coding attempts.

### 🎨 UI/UX & Core Experience
*   **Responsive Dark Theme:** A premium, eye-friendly layout optimized for long study sessions.
*   **Secure Auth:** Robust account management with session persistence powered by Supabase.
*   **Optimized Performance:** Seamless UX with skeleton loaders and micro-animations.

---

## 🖼 Screenshots
*(Add your project GIFs or screenshots here to grab recruiter attention)*
| Dashboard Overview | Comparison View |
| :---: | :---: |
| 🚧 [Insert GIF/Image] | 🚧 [Insert GIF/Image] |

---

## 🛠 Tech Stack
*   **Frontend:** React, Vite, React Router, Custom Vanilla CSS
*   **Backend:** Node.js, Express
*   **Database:** Supabase (PostgreSQL)
*   **Authentication:** Supabase Auth
*   **APIs:** Clist API, Kenkoooo API, Alfa LeetCode API

---

## 📂 Folder Structure
```text
cp-tracker/
├── backend/            # Express.js API server
│   ├── controllers/    # API handlers & integration logic
│   ├── routes/         # API endpoint definitions
│   └── server.js       # App entry point
├── frontend/           # React SPA
│   ├── src/
│   │   ├── components/ # Reusable UI widgets
│   │   ├── services/   # API client utilities
│   │   └── App.jsx     # Routing & Main Layout
└── ...
