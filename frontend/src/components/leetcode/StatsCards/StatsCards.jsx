import './StatsCards.css';

// fetchLeetCodeCalendar() now computes and returns the real activeDays
// count directly (number of distinct days with a submission). Previously
// this counted Object.keys(calendar).length, which counted the wrapper
// object's own 4 fields (submissions/currentStreak/longestStreak/
// totalSubmissions) instead of actual active days — that's why it always
// showed "4" regardless of the user.
function getActiveDays(solved, calendar) {
  if (typeof calendar?.activeDays === 'number') return calendar.activeDays;
  return solved?.activeDays ?? 'N/A';
}

// Different LeetCode proxies name the "total submissions" field differently
// (submissionsTotal vs totalSubmissions vs submitStats.total). This checks
// the common variants and never crashes on a missing value — previously
// `.toLocaleString()` on undefined would throw and silently break the card.
function getTotalSubmissions(solved) {
  const raw =
    solved?.submissionsTotal ??
    solved?.totalSubmissions ??
    solved?.submitStats?.total ??
    null;
  return typeof raw === 'number' ? raw.toLocaleString() : 'N/A';
}

const cards = (solved, contest, calendar) => [
  { label: 'Total Solved',    value: solved.totalSolved ?? 0,           color: '#4f46e5' },
  { label: 'Easy Solved',     value: solved.easySolved ?? 0,            color: '#22c55e' },
  { label: 'Medium Solved',   value: solved.mediumSolved ?? 0,          color: '#f59e0b' },
  { label: 'Hard Solved',     value: solved.hardSolved ?? 0,            color: '#ef4444' },
  { label: 'Contest Rating',  value: contest.rating ?? '—',             color: '#f89a1c' },
  { label: 'Global Rank',     value: contest.globalRank ? `#${contest.globalRank}` : '—', color: '#8b5cf6' },
  { label: 'Contests',        value: contest.totalContests ?? 0,        color: '#06b6d4' },
  { label: 'Active Days',     value: getActiveDays(solved, calendar),   color: '#10b981' },
  { label: 'Submissions',     value: getTotalSubmissions(solved),       color: '#6366f1' },
];

export default function StatsCards({ solved, contest, calendar }) {
  const data = cards(solved, contest, calendar);
  return (
    <div className="sc-grid">
      {data.map((c) => (
        <div key={c.label} className="sc-card">
          <span className="sc-dot" style={{ background: c.color }} />
          <span className="sc-val" style={{ color: c.color }}>{c.value}</span>
          <span className="sc-lbl">{c.label}</span>
        </div>
      ))}
    </div>
  );
}