import { useState, useMemo } from 'react';
import { getLangColor, timeAgo } from '../../../services/github';
import './GithubRepoTable.css';

export default function GithubRepoTable({ repos }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('updated_at');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = useMemo(() => {
    return [...repos]
      .filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const aVal = a[sortKey] ?? 0;
        const bVal = b[sortKey] ?? 0;

        if (typeof aVal === 'string') {
          return sortDir === 'desc'
            ? String(bVal).localeCompare(String(aVal))
            : String(aVal).localeCompare(String(bVal));
        }

        return sortDir === 'desc'
          ? bVal - aVal
          : aVal - bVal;
      });
  }, [repos, search, sortKey, sortDir]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortIcon({ col }) {
    if (sortKey !== col) {
      return <span className="ghrt-sort-icon">↕</span>;
    }

    return (
      <span className="ghrt-sort-icon active">
        {sortDir === 'desc' ? '↓' : '↑'}
      </span>
    );
  }

  return (
    <div className="ghrt-card">
      <div className="ghrt-header">
        <span className="ghrt-title">Repositories</span>

        <div className="ghrt-controls">
          <input
            className="ghrt-search"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <span className="ghrt-count">
            {filtered.length} repos
          </span>
        </div>
      </div>

      <div className="ghrt-table-wrap">
        <table className="ghrt-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Repository <SortIcon col="name" />
              </th>

              <th>Language</th>

              <th onClick={() => handleSort('stargazers_count')}>
                Stars <SortIcon col="stargazers_count" />
              </th>

              <th onClick={() => handleSort('forks_count')}>
                Forks <SortIcon col="forks_count" />
              </th>

              <th onClick={() => handleSort('open_issues_count')}>
                Issues <SortIcon col="open_issues_count" />
              </th>

              <th onClick={() => handleSort('size')}>
                Size <SortIcon col="size" />
              </th>

              <th onClick={() => handleSort('updated_at')}>
                Updated <SortIcon col="updated_at" />
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((repo) => (
              <tr key={repo.id}>
                <td>
                  <div className="ghrt-repo-name-cell">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ghrt-repo-link"
                    >
                      {repo.name}
                    </a>

                    {repo.fork && (
                      <span className="ghrt-fork-badge">
                        Fork
                      </span>
                    )}

                    {repo.archived && (
                      <span className="ghrt-archived-badge">
                        Archived
                      </span>
                    )}
                  </div>

                  {repo.description && (
                    <p className="ghrt-desc">
                      {repo.description}
                    </p>
                  )}
                </td>

                <td>
                  {repo.language ? (
                    <span className="ghrt-lang">
                      <span
                        className="ghrt-lang-dot"
                        style={{
                          background: getLangColor(repo.language),
                        }}
                      />
                      {repo.language}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>

                <td>
                  ⭐ {repo.stargazers_count?.toLocaleString() ?? 0}
                </td>

                <td>
                  🍴 {repo.forks_count?.toLocaleString() ?? 0}
                </td>

                <td>{repo.open_issues_count ?? 0}</td>

                <td>
                  {repo.size >= 1024
                    ? `${(repo.size / 1024).toFixed(1)} MB`
                    : `${repo.size} KB`}
                </td>

                <td className="ghrt-date">
                  {timeAgo(repo.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="ghrt-empty">
          No repositories found.
        </p>
      )}
    </div>
  );
}