import React, { useMemo, useState } from "react";
import { formatDate } from "../cfColors";
import "./CFContestTable.css";

export default function CFContestTable({ ratingHistory = [] }) {
  const [query, setQuery] = useState("");
  const [newestFirst, setNewestFirst] = useState(true);

  const rows = useMemo(() => {
    let list = [...ratingHistory];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) => c.contestName.toLowerCase().includes(q));
    }
    list.sort((a, b) =>
      newestFirst
        ? b.ratingUpdateTimeSeconds - a.ratingUpdateTimeSeconds
        : a.ratingUpdateTimeSeconds - b.ratingUpdateTimeSeconds
    );
    return list;
  }, [ratingHistory, query, newestFirst]);

  return (
    <div className="cft-card">
      <div className="cft-header">
        <h3 className="cft-title">Contest History</h3>
        <div className="cft-controls">
          <input
            className="cft-search"
            type="text"
            placeholder="Search contests..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="cft-sort-btn"
            onClick={() => setNewestFirst((v) => !v)}
          >
            {newestFirst ? "↓ Newest" : "↑ Oldest"}
          </button>
        </div>
      </div>

      <div className="cft-table-wrap">
        <table className="cft-table">
          <thead>
            <tr>
              <th>Contest</th>
              <th>Rank</th>
              <th>Rating</th>
              <th>Change</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="cft-no-rows">
                  No contests found.
                </td>
              </tr>
            )}
            {rows.map((c) => {
              const change = c.newRating - c.oldRating;
              const positive = change >= 0;
              return (
                <tr key={c.contestId}>
                  <td className="cft-contest-name">{c.contestName}</td>
                  <td>#{c.rank}</td>
                  <td className="cft-rating">{c.newRating}</td>
                  <td className={positive ? "cft-change-pos" : "cft-change-neg"}>
                    {positive ? "+" : ""}
                    {change}
                  </td>
                  <td className="cft-date">{formatDate(c.ratingUpdateTimeSeconds)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}