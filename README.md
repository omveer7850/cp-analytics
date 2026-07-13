# CP Analytics

A premium, real-time developer dashboard designed to track, visualize, and compare competitive programming profiles across multiple platforms (LeetCode & AtCoder) in one unified interface.

## Demo Video & Preview

A walkthrough of CP Analytics in action:

<video src="https://raw.githubusercontent.com/omveer7850/cp-analytics/main/demo-walkthrough.mp4" autoplay loop muted playsinline width="100%"></video>

> [!TIP]
> **How to add your video/GIF:**
> You can record a screen walkthrough of your application, upload the `.mp4` or `.gif` file to your GitHub repository (or host it on a platform like Imgur/Loom), and replace the image URL above with your hosted link.

---

## Features

- **Multi-Platform Integration**: Consolidates statistics, ratings, and submission records from LeetCode and AtCoder.
- **Interactive Performance Graphs**: Displays chronological rating histories with filterable slices (Last 10, 25, 50, All contests).
- **Competitor Compare Mode**: Side-by-side comparison of multiple handles, highlighting the winning statistics for key metrics.
- **Secure Authentication**: Built-in user accounts and session persistence powered by Supabase Auth.
- **Responsive Premium UI**: Clean dashboard layout optimized for mobile, tablet, and desktop views with a dedicated dark theme.

---

## Tech Stack

- **Frontend**: React (Vite), React Router, custom Vanilla CSS.
- **Backend**: Node.js, Express, Axios.
- **Database & Security**: Supabase (Database, GoTrue Auth).
- **APIs**: Clist API, Kenkoooo API, Alfa LeetCode API.
- **Hosting**: Vercel (Frontend) & Render (Backend).

---

## Installation & Setup

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/omveer7850/cp-analytics.git
cd cp-analytics
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `backend` folder and add:
   ```env
   PORT=5001
   CLIST_USERNAME=YOUR_CLIST_USERNAME
   CLIST_API_KEY=YOUR_CLIST_API_KEY
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `frontend` folder and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=YOUR_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   VITE_API_URL=http://localhost:5001
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Project Structure

```
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
    └── .env              # Frontend environment variables
```
