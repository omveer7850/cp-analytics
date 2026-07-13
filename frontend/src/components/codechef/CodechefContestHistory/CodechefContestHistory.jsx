import { useState, useMemo } from 'react';
import './CodechefContestHistory.css';

function getColor(rating) {
  if (rating >= 2500) return '#FF0000';
  if (rating >= 2200) return '#FF8000';
  if (rating >= 2000) return '#FFD700';
  if (rating >= 1800) return '#0000FF';
  if (rating >= 1600) return '#00C0C0';
  if (rating >= 1400) return '#008000';
  return '#808080';
}

export default function CodechefContestHistory({ history }) {
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

  if (!history?.length) return null;

  return (
    <div className="ccch-card">
      <div className="ccch-header">
        <span className="ccch-title">Contest History</span>

        <div className="ccch-controls">
          <input
            className="ccch-search"
            placeholder="Search contests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="ccch-sort-btn"
            onClick={() =>
              setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
            }
          >
            {sortDir === 'desc' ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>
      </div>

      <div className="ccch-table-wrap">
        <table className="ccch-table">
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
            {filtered.map((row, i) => {
              const change = row.change ?? 0;

              return (
                <tr key={i}>
                  <td>
                    <a
                      href={row.url ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ccch-contest-link"
                    >
                      {row.contestName ?? 'N/A'}
                    </a>
                  </td>

                  <td>#{row.rank ?? 'N/A'}</td>

                  <td
                    style={{
                      color: getColor(row.rating ?? 0),
                      fontWeight: 600,
                    }}
                  >
                    {row.rating ?? 'N/A'}
                  </td>

                  <td
                    className={`ccch-change ${
                      change >= 0 ? 'pos' : 'neg'
                    }`}
                  >
                    {change >= 0 ? `+${change}` : change}
                  </td>

                  <td className="ccch-date">
                    {row.date ?? 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="ccch-empty">
          No contests found.
        </p>
      )}
    </div>
  );
}