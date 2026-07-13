import { useState, useMemo } from 'react';
import './AtCoderContestHistory.css';
import { getRankInfo } from '../../../services/atcoder';

export default function AtCoderContestHistory({ history }) {
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = useMemo(() => {
    return (history ?? [])
      .filter((h) =>
        (h.contestName ?? '').toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortDir === 'desc'
          ? new Date(b.date ?? 0) - new Date(a.date ?? 0)
          : new Date(a.date ?? 0) - new Date(b.date ?? 0)
      );
  }, [history, search, sortDir]);

  return (
    <div className="ach-card">
      <div className="ach-header">
        <span className="ach-title">Contest History</span>

        <div className="ach-controls">
          <input
            className="ach-search"
            placeholder="Search contests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="ach-sort-btn"
            onClick={() =>
              setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
            }
          >
            {sortDir === 'desc' ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>
      </div>

      <div className="ach-table-wrap">
        <table className="ach-table">
          <thead>
            <tr>
              <th>Contest</th>
              <th>Type</th>
              <th>Rank</th>
              <th>Perf</th>
              <th>Old</th>
              <th>New</th>
              <th>Change</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, i) => {
              const info = getRankInfo(row.newRating ?? 0);
              const perfInfo = getRankInfo(row.performance ?? 0);
              const change = row.change ?? 0;

              return (
                <tr key={i}>
                  <td>
                    <a
                      href={row.url ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ach-contest-link"
                    >
                      {row.contestName ?? 'N/A'}
                    </a>
                  </td>

                  <td>
                    <span className="ach-type-badge">
                      {row.contestType ?? 'N/A'}
                    </span>
                  </td>

                  <td>#{row.rank ?? 'N/A'}</td>

                  <td
                    style={{
                      color: perfInfo.color,
                      fontWeight: 600,
                    }}
                  >
                    {row.performance ?? 'N/A'}
                  </td>

                  <td>{row.oldRating ?? 'N/A'}</td>

                  <td
                    style={{
                      color: info.color,
                      fontWeight: 600,
                    }}
                  >
                    {row.newRating ?? 'N/A'}
                  </td>

                  <td
                    className={`ach-change ${
                      change >= 0 ? 'pos' : 'neg'
                    }`}
                  >
                    {change >= 0 ? `+${change}` : change}
                  </td>

                  <td className="ach-date">
                    {row.date ?? 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="ach-empty">No contests found.</p>
      )}
    </div>
  );
}