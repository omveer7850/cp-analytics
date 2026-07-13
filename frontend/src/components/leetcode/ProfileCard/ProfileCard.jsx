import './ProfileCard.css';

// contestData.history's exact field name for the per-contest rating isn't
// guaranteed (varies by API/proxy) — this checks the common variants so
// Max Rating still computes correctly whichever one the service returns.
function getMaxRating(contestData) {
  const history = contestData?.history;
  if (Array.isArray(history) && history.length > 0) {
    const ratings = history
      .map((h) => h.rating ?? h.newRating ?? h.contestRating)
      .filter((r) => typeof r === 'number' && !Number.isNaN(r));
    if (ratings.length > 0) return Math.max(...ratings);
  }
  // Fall back to the current rating if no history is available yet.
  return contestData?.rating ?? null;
}

export default function ProfileCard({ profile, contestData }) {
  const maxRating = getMaxRating(contestData);

  return (
    <div className="pc-card">
      <div className="pc-avatar-wrap">
        <img src={profile.avatar} alt={profile.username} className="pc-avatar" />
        <span className="pc-rank-badge">#{profile.globalRank}</span>
      </div>
      <div className="pc-info">
        <h2 className="pc-username">{profile.username}</h2>
        <p className="pc-realname">{profile.realName}</p>
        <div className="pc-tags">
          {profile.country && (
            <span className="pc-tag">🌍 {profile.country}</span>
          )}
          {profile.school && (
            <span className="pc-tag">🎓 {profile.school}</span>
          )}
          <span className="pc-tag">📅 Since {profile.memberSince}</span>
        </div>
      </div>
      <div className="pc-stats">
        <div className="pc-stat">
          <span className="pc-stat-val">{contestData?.rating ?? '—'}</span>
          <span className="pc-stat-lbl">Contest Rating</span>
        </div>
        <div className="pc-stat-div" />
        <div className="pc-stat">
          <span className="pc-stat-val">{maxRating ?? '—'}</span>
          <span className="pc-stat-lbl">Max Rating</span>
        </div>
        <div className="pc-stat-div" />
        <div className="pc-stat">
          <span className="pc-stat-val">Top {profile.globalRank === 1 ? '0.01' : '5'}%</span>
          <span className="pc-stat-lbl">Global</span>
        </div>
      </div>
    </div>
  );
}