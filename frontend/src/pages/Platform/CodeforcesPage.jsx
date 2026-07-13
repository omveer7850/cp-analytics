import React, { useCallback, useEffect, useState } from "react";
import CFProfileCard from "../../components/codeforces/CFProfileCards/CFProfileCard";
import CFStatsCards from "../../components/codeforces/CFStatsCard/CFStatsCards";
import CFGraph from "../../components/codeforces/CFGraph/CFGraph";
import CFContestTable from "../../components/codeforces/CFContestTable/CFContestTable";
import CFProblemStats from "../../components/codeforces/CFProblemStats/CFProblemStats";
import CFRecentSubmissions from "../../components/codeforces/CFRecentSubmissions/CFRecentSubmissions";
import "./CodeforcesPage.css";

const DEFAULT_HANDLE = "tourist";

function LoadingSkeleton() {
  return (
    <div className="cfpg-skeleton">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="cfpg-skel-card">
          <div className="cfpg-shimmer cfpg-shimmer--line" />
          <div className="cfpg-shimmer cfpg-shimmer--line cfpg-shimmer--short" />
          <div className="cfpg-shimmer cfpg-shimmer--line cfpg-shimmer--shorter" />
        </div>
      ))}
    </div>
  );
}

export default function CodeforcesPage() {
  const [handleInput, setHandleInput] = useState(DEFAULT_HANDLE);
  const [handle, setHandle] = useState(DEFAULT_HANDLE);
  const [searchErr, setSearchErr] = useState("");

  const [userInfo, setUserInfo] = useState(null);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCFData = useCallback(async (cfHandle) => {
    setLoading(true);
    setError(null);
    try {
      const [infoRes, ratingRes, statusRes] = await Promise.all([
        fetch(`https://codeforces.com/api/user.info?handles=${cfHandle}`),
        fetch(`https://codeforces.com/api/user.rating?handle=${cfHandle}`),
        fetch(`https://codeforces.com/api/user.status?handle=${cfHandle}&from=1&count=100000`),
      ]);

      const infoJson = await infoRes.json();
      const ratingJson = await ratingRes.json();
      const statusJson = await statusRes.json();

      if (infoJson.status !== "OK") {
        throw new Error(infoJson.comment || "Handle not found");
      }

      setUserInfo(infoJson.result[0]);
      setRatingHistory(ratingJson.status === "OK" ? ratingJson.result : []);
      setSubmissions(statusJson.status === "OK" ? statusJson.result : []);
    } catch (err) {
      setError(err.message || "Failed to fetch Codeforces data");
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCFData(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const trimmed = handleInput.trim();
    if (!trimmed) {
      setSearchErr("Please enter a Codeforces handle.");
      return;
    }
    setSearchErr("");
    setHandle(trimmed);
    fetchCFData(trimmed);
  }

  return (
    <div className="cfpg-page">
      <div className="cfpg-search-wrap">
        <form className="cfpg-search-inner" onSubmit={handleSearch}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            className="cfpg-search-icon">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="cfpg-search-input"
            type="text"
            placeholder="Enter Codeforces handle..."
            value={handleInput}
            onChange={(e) => { setHandleInput(e.target.value); setSearchErr(""); }}
            disabled={loading}
          />
          <button className="cfpg-search-btn" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {searchErr && <p className="cfpg-search-err">{searchErr}</p>}
      </div>

      {loading && <LoadingSkeleton />}

      {!loading && error && (
        <div className="cfpg-error-wrap">
          <span className="cfpg-error-icon">⚠️</span>
          <p className="cfpg-error-title">Failed to load</p>
          <p className="cfpg-error-msg">
            Couldn't load data for "{handle}": {error}
          </p>
          <button className="cfpg-retry-btn" onClick={() => fetchCFData(handle)}>
            ↻ Try Again
          </button>
        </div>
      )}

      {!loading && !error && userInfo && (
        <>
          <div className="cfpg-page-header">
            <div>
              <h1 className="cfpg-page-title">
                <span className="cfpg-title-dot" />
                Codeforces Analytics
              </h1>
              <p className="cfpg-page-sub">
                Showing data for <b>{handle}</b>
              </p>
            </div>
            <button className="cfpg-refresh-btn" onClick={() => fetchCFData(handle)}>
              ↻ Refresh
            </button>
          </div>

          <CFProfileCard user={userInfo} ratingHistoryCount={ratingHistory.length} />
          <CFStatsCards user={userInfo} ratingHistoryCount={ratingHistory.length} submissions={submissions} />

          <div className="cfpg-two-col">
            <CFProblemStats submissions={submissions} />
            <CFRecentSubmissions submissions={submissions} />
          </div>

          {ratingHistory.length >= 2 && <CFGraph ratingHistory={ratingHistory} />}
          {ratingHistory.length > 0 && <CFContestTable ratingHistory={ratingHistory} />}
        </>
      )}
    </div>
  );
}