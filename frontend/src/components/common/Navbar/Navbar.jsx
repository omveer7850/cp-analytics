import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NotificationDropdown from "../../NotificationDropdown/NotificationDropdown";
import "./Navbar.css";

const tabs = [
  { label: "Home", icon: "🏠", href: "/dashboard" },
  { label: "Compare", icon: "⚖️", href: "/compare" },
  { label: "Profile", icon: "👤", href: "/profile" },
 { label: "Contests", icon: "📅", href: "/contests" },
];

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();

  // theme: 'light' | 'dark', persisted so it survives refresh
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <div className="navbar__brand-icon">{"</>"}</div>
        <span className="navbar__brand-name">CP Tracker</span>
      </div>

      <nav className="navbar__tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            to={tab.href}
            className={`navbar__tab ${pathname === tab.href ? "active" : ""}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        ))}
      </nav>

      <div className="navbar__right">
        <button
          className="navbar__icon-btn"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        <NotificationDropdown />

        <div className="navbar__avatar" title="My Profile">
          CP
        </div>
      </div>
    </header>
  );
}