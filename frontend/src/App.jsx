import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar/Navbar';
import Sidebar from './components/common/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import ComparePage from './compare/ComparePage';
import GithubPage from './pages/Platform/GithubPage';
import CodechefPage from './pages/CodechefPage/CodechefPage';
import AtCoderPage from './pages/Platform/AtCoderPage';
import DSASheetPage from './pages/dsa/DSASheetPage';
import LeetCodePage from './pages/Platform/LeetCodePage';
import CodeforcesPage from './pages/Platform/CodeforcesPage';
import ContestCalendarPage from './pages/ContestCalendar/ContestCalendarPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SettingsPage from './pages/Settings/Settingspage';
import LoginPage from './pages/Login/LoginPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/globals.css';

const Placeholder = ({ title }) => (
  <div style={{ padding: '32px', color: 'var(--text-secondary)' }}>
    <strong style={{ color: 'var(--text-primary)' }}>{title}</strong> — Coming soon
  </div>
);

function AppLayout() {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthPage = pathname === '/login';

 
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar isOpen={sidebarOpen} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
            <Route path="/contests" element={<ProtectedRoute><ContestCalendarPage /></ProtectedRoute>} />

            <Route path="/platforms" element={<ProtectedRoute><Placeholder title="Platforms" /></ProtectedRoute>} />
            <Route path="/platforms/leetcode" element={<ProtectedRoute><LeetCodePage /></ProtectedRoute>} />
            <Route path="/platforms/codeforces" element={<ProtectedRoute><CodeforcesPage /></ProtectedRoute>} />
            <Route path="/platforms/github" element={<ProtectedRoute><GithubPage /></ProtectedRoute>} />
            <Route path="/platforms/codechef" element={<ProtectedRoute><CodechefPage /></ProtectedRoute>} />
            <Route path="/platforms/atcoder" element={<ProtectedRoute><AtCoderPage /></ProtectedRoute>} />

            <Route path="/dsa/:sheetId" element={<ProtectedRoute><DSASheetPage /></ProtectedRoute>} />

            <Route path="/history" element={<ProtectedRoute><Placeholder title="History" /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}