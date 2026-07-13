import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";
import SettingsPanel from "../../SettingsPanel/SettingsPanel";
import "./Sidebar.css";

// Custom AtCoder component to avoid 'SiAtcoder' import error
const AtCoderIcon = () => (
  <svg viewBox="0 0 100 100" className="platform-icon atcoder" fill="currentColor">
    <path d="M50 0L0 100h100L50 0z" />
    <path d="M50 20l35 65H15l35-65z" fill="white" />
  </svg>
);

const platforms = [
  { label: "LeetCode", sub: "Problems", href: "/platforms/leetcode", icon: <SiLeetcode className="platform-icon leetcode" /> },
  { label: "Codeforces", sub: "Rating", href: "/platforms/codeforces", icon: <SiCodeforces className="platform-icon codeforces" /> },
  { label: "GitHub", sub: "Repos", href: "/platforms/github", icon: <SiGithub className="platform-icon github" /> },
  { label: "CodeChef", sub: "Stars", href: "/platforms/codechef", icon: <SiCodechef className="platform-icon codechef" /> },
  { label: "AtCoder", sub: "Contests", href: "/platforms/atcoder", icon: <AtCoderIcon /> },
];

const dsaSheets = [
  { label: "Grind 169", href: "/dsa/grind169" },
  { label: "Striver A2Z", href: "/dsa/striverA2Z" },
  { label: "Blind 75", href: "/dsa/blind75" },
  { label: "NeetCode 150", href: "/dsa/neetcode150" },
];

const PANEL_WIDTH = 340;

export default function Sidebar({ isOpen }) {
  const { pathname } = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [coords, setCoords] = useState({ left: 0, bottom: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  const openSettings = () => {
    const rect = btnRef.current.getBoundingClientRect();
    let left = rect.left;
    // keep it on-screen if the sidebar sits near the right edge (rare, but safe)
    if (left + PANEL_WIDTH > window.innerWidth - 12) {
      left = window.innerWidth - PANEL_WIDTH - 12;
    }
    setCoords({ left, bottom: window.innerHeight - rect.top + 8 });
    setSettingsOpen(true);
  };

  // close on outside click — checks both the trigger button and the
  // portal-rendered panel, since the panel no longer lives inside <aside>
  useEffect(() => {
    function handleClick(e) {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        panelRef.current && !panelRef.current.contains(e.target)
      ) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // keep it anchored to the button if the window resizes while open
  useEffect(() => {
    if (!settingsOpen) return;
    function reposition() {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      let left = rect.left;
      if (left + PANEL_WIDTH > window.innerWidth - 12) {
        left = window.innerWidth - PANEL_WIDTH - 12;
      }
      setCoords({ left, bottom: window.innerHeight - rect.top + 8 });
    }
    window.addEventListener("resize", reposition);
    return () => window.removeEventListener("resize", reposition);
  }, [settingsOpen]);

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar__section">
        <span className="sidebar__section-label">Platforms</span>
        <ul className="sidebar__list">
          {platforms.map((p) => (
            <li key={p.href}>
              <Link to={p.href} className={`sidebar__item ${pathname.startsWith(p.href) ? "active" : ""}`}>
                <span className="sidebar__icon">{p.icon}</span>
                <div className="sidebar__item-text">
                  <span className="sidebar__item-name">{p.label}</span>
                  <span className="sidebar__item-sub">{p.sub}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar__divider" />

      <div className="sidebar__section">
        <span className="sidebar__section-label">📚 DSA Sheets</span>
        <ul className="sidebar__list">
          {dsaSheets.map((s) => (
            <li key={s.href}>
              <Link to={s.href} className={`sidebar__item ${pathname.startsWith(s.href) ? "active" : ""}`}>
                <span className="sidebar__icon">📁</span>
                <div className="sidebar__item-text">
                  <span className="sidebar__item-name">{s.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar__settings"
          ref={btnRef}
          onClick={() => (settingsOpen ? setSettingsOpen(false) : openSettings())}
        >
          <span className="sidebar__icon">⚙</span>
          Settings
        </button>
      </div>

      {settingsOpen &&
        createPortal(
          <div
            ref={panelRef}
            className="stg-portal"
            style={{ left: coords.left, bottom: coords.bottom, width: PANEL_WIDTH }}
          >
            <SettingsPanel onClose={() => setSettingsOpen(false)} />
          </div>,
          document.body
        )}
    </aside>
  );
}