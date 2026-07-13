import './ContestFilters.css';

const PLATFORMS = ['All', 'LeetCode', 'Codeforces', 'CodeChef', 'AtCoder'];

const PLATFORM_DOTS = {
  LeetCode:   '#f89a1c',
  Codeforces: '#4a90d9',
  CodeChef:   '#5b4638',
  AtCoder:    '#e53935',
};

export default function ContestFilters({
  search,
  onSearchChange,
  activePlatform,
  onPlatformChange,
  totalCount,
  filteredCount,
}) {
  return (
    <div className="cf-wrapper">
      <div className="cf-top">
        <div className="cf-search-wrap">
          <svg className="cf-search-icon" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="cf-search"
            placeholder="Search contests..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button className="cf-clear-btn" onClick={() => onSearchChange('')}>
              ✕
            </button>
          )}
        </div>

        <div className="cf-count">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> contests
        </div>
      </div>

      <div className="cf-platforms">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            className={`cf-pill ${activePlatform === p ? 'active' : ''}`}
            onClick={() => onPlatformChange(p)}
            style={
              activePlatform === p && p !== 'All'
                ? {
                    background: PLATFORM_DOTS[p] + '18',
                    borderColor: PLATFORM_DOTS[p],
                    color: PLATFORM_DOTS[p],
                  }
                : {}
            }
          >
            {p !== 'All' && (
              <span
                className="cf-pill-dot"
                style={{ background: PLATFORM_DOTS[p] }}
              />
            )}
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}