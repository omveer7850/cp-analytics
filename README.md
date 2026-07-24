# CP Analytics 🚀

[![GitHub Repo stars](https://img.shields.io/github/stars/omveer7850/cp-analytics?style=social)](https://github.com/omveer7850/cp-analytics)
[![GitHub forks](https://img.shields.io/github/forks/omveer7850/cp-analytics?style=social)](https://github.com/omveer7850/cp-analytics)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Server-Express-000000?logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Database%20%26%20Auth-Supabase-3ECF8E?logo=supabase&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)

> **Tagline:** A unified, data-driven dashboard for competitive programming analytics and DSA training.
>
> 🌐 **Live App:** [cp-profile-hub.vercel.app](https://cp-profile-hub.vercel.app)

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Project Screenshots](#-project-screenshots)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Environment Variables](#-environment-variables)
- [System Architecture](#-system-architecture)
- [Folder Structure](#-folder-structure)
- [Installation & Running Locally](#️-installation--running-locally)
- [Deployment](#️-deployment)
- [Contributors](#-contributors)
- [License](#-license)

---

## 📖 Project Overview
CP Tracker is a professional, unified developer dashboard engineered to track, visualize, and benchmark competitive programming performance across multiple global platforms including LeetCode, Codeforces, AtCoder, and CodeChef. Designed for developers who value data-driven growth, this tool streamlines the process of monitoring technical progression and comparing performance against peers.

---

## 🖼 Project Screenshots

<div align="center">

| User Login Screen | Dashboard Overview | Dark Mode Dashboard |
| :---: | :---: | :---: |
| ![Login](./images/Screenshot%20(28).png) | ![Dashboard](./images/Screenshot%20(6).png) | ![Dark Mode](./images/Screenshot%20(27).png) |

| Platform Stats | Rating History | Contest History |
| :---: | :---: | :---: |
| ![Platform Stats](./images/Screenshot%20(13).png) | ![Rating History](./images/Screenshot%20(15).png) | ![Contest History](./images/Screenshot%20(10).png) |

| DSA Sheet Tracker | Upcoming Contests | Competitor Comparison |
| :---: | :---: | :---: |
| ![DSA Sheet](./images/Screenshot%20(20).png) | ![Contests](./images/Screenshot%20(24).png) | ![Comparison](./images/Screenshot%20(22).png) |

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
*   **Deployment:** Vercel

---

## 🔑 Environment Variables

> ⚠️ **Security note:** Never commit real credentials to your repository or README. Replace every placeholder below with your own values in a local `.env` file, and make sure `.env` is listed in `.gitignore` before pushing.

### Frontend Setup
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5001
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=5001
CLIST_USERNAME=your_clist_username
CLIST_API_KEY=your_clist_api_key
```

---

## 🧱 System Architecture

```text
Frontend (React)
      │
      ▼
Backend (Express)
      │
      ▼
External APIs
 ├── LeetCode
 ├── Codeforces
 ├── AtCoder
 └── CodeChef
      │
      ▼
Supabase
```

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
```

---

## ⚙️ Installation & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/omveer7850/cp-analytics.git
cd cp-analytics

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install
```

Add your `.env` files as described in [Environment Variables](#-environment-variables), then run each part in its own terminal:

```bash
# Start the backend (from /backend)
node server.js
# → runs on http://localhost:5001

# Start the frontend (from /frontend)
npm run dev
# → runs on http://localhost:5174
```

---

## ☁️ Deployment

CP Tracker is deployed on **Vercel**:

🔗 **[https://cp-profile-hub.vercel.app](https://cp-profile-hub.vercel.app)**

---

## 👤 Contributors

<a href="https://github.com/omveer7850">
  <img src="https://github.com/omveer7850.png" width="60" style="border-radius:50%" alt="omveer7850" />
</a>

**[Omveer Singh](https://github.com/omveer7850)** — Creator & Maintainer

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
