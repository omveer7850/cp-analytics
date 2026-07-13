import './RecentContests.css';

export default function RecentContests({ data }) {
  // Sorting logic added here (Newest date first)
  const sortedHistory = [...data.history].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="rc-card">
      <div className="rc-header">
        <span className="rc-title">Contest History</span>
        <div className="rc-badges">
          <span className="rc-badge rc-badge--rating">⚡ {data.rating}</span>
          <span className="rc-badge rc-badge--rank">#{data.globalRank} Global</span>
          <span className="rc-badge rc-badge--count">{data.totalContests} Contests</span>
        </div>
      </div>

      <div className="rc-graph">
        <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="rc-svg">
          <defs>
            <linearGradient id="rcGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#4f46e5" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const ratings = data.history.map((h) => h.rating);
            const min = Math.min(...ratings) - 20;
            const max = Math.max(...ratings) + 20;
            const pts = ratings.map((r, i) => {
              const x = (i / (ratings.length - 1)) * 580 + 10;
              const y = 110 - ((r - min) / (max - min)) * 100;
              return `${x},${y}`;
            });
            const area = `M${pts[0]} ` + pts.slice(1).map((p) => `L${p}`).join(' ') + ` L590,110 L10,110 Z`;
            const line = `M${pts[0]} ` + pts.slice(1).map((p) => `L${p}`).join(' ');
            return (
              <>
                <path d={area} fill="url(#rcGrad)" />
                <path d={line}  fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinejoin="round" />
                {ratings.map((r, i) => {
                  const x = (i / (ratings.length - 1)) * 580 + 10;
                  const y = 110 - ((r - min) / (max - min)) * 100;
                  return (
                    <circle key={i} cx={x} cy={y} r="4"
                      fill={data.history[i].change >= 0 ? '#22c55e' : '#ef4444'}
                      stroke="#fff" strokeWidth="1.5"
                    />
                  );
                })}
              </>
            );
          })()}
        </svg>
      </div>

      <div className="rc-table-wrap">
        <table className="rc-table">
          <thead>
            <tr>
              <th>Contest</th>
              <th>Rank</th>
              <th>Rating</th>
              <th>Change</th>
              <th>Solved</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Sorted data used here */}
            {sortedHistory.map((row, i) => (
              <tr key={i}>
                <td className="rc-contest-name">{row.contest}</td>
                <td>#{row.rank}</td>
                <td className="rc-rating">{row.rating}</td>
                <td className={`rc-change ${row.change >= 0 ? 'pos' : 'neg'}`}>
                  {row.change >= 0 ? `+${row.change}` : row.change}
                </td>
                <td>{row.solved}/4</td>
                <td className="rc-date">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}