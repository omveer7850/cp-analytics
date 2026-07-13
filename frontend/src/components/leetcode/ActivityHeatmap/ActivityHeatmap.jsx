import './ActivityHeatmap.css';

// Helper function to calculate streaks accurately
function calculateStreaks(submissions) {
  const dates = Object.keys(submissions).sort();
  if (dates.length === 0) return { current: 0, longest: 0 };

  let current = 0;
  let longest = 0;
  let tempLongest = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    const d = new Date(dates[i]);
    const prevD = i > 0 ? new Date(dates[i - 1]) : null;

    if (i === 0 || (d - prevD) / 86400000 === 1) {
      tempLongest++;
    } else if ((d - prevD) / 86400000 > 1) {
      longest = Math.max(longest, tempLongest);
      tempLongest = 1;
    }

    if ((today - d) / 86400000 <= 1) current = tempLongest;
    else if ((today - d) / 86400000 > 1) current = 0;
  }
  return { current, longest: Math.max(longest, tempLongest) };
}

function getColor(count) {
  if (count === 0) return '#ebedf0';
  if (count <= 2) return '#9be9a8';
  if (count <= 5) return '#40c463';
  if (count <= 9) return '#30a14e';
  return '#216e39';
}

export default function ActivityHeatmap({ calendar }) {
  const { submissions, totalSubmissions } = calendar;
  const { current, longest } = calculateStreaks(submissions);

  // Normalize 365 days
  const fullYear = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    fullYear.push([dateKey, submissions[dateKey] || 0]);
  }

  const weeks = [];
  for (let i = 0; i < fullYear.length; i += 7) {
    weeks.push(fullYear.slice(i, i + 7));
  }

  return (
    <div className="ah-card">
      <div className="ah-header">
        <span className="ah-title">Submission Activity</span>
        <div className="ah-stats">
          <span className="ah-stat"><b>{totalSubmissions.toLocaleString()}</b> submissions</span>
          <span className="ah-sep">·</span>
          <span className="ah-stat">🔥 <b>{current}</b> day streak</span>
          <span className="ah-sep">·</span>
          <span className="ah-stat">Best: <b>{longest}</b> days</span>
        </div>
      </div>
      <div className="ah-grid-wrap">
        <div className="ah-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="ah-week">
              {week.map(([date, count]) => (
                <div
                  key={date}
                  className="ah-cell"
                  style={{ background: getColor(count) }}
                  title={`${date}: ${count} submission${count !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="ah-legend">
          <span className="ah-leg-lbl">Less</span>
          {['#ebedf0','#9be9a8','#40c463','#30a14e','#216e39'].map((c) => (
            <div key={c} className="ah-leg-cell" style={{ background: c }} />
          ))}
          <span className="ah-leg-lbl">More</span>
        </div>
      </div>
    </div>
  );
}