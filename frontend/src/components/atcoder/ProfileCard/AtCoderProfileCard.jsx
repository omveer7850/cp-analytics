import './AtCoderProfileCard.css';

export default function AtCoderProfileCard({ profile }) {
  const { rankInfo, highestRankInfo } = profile;

  return (
    <div className="apc-card">
      <div className="apc-avatar-wrap">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.username}
            className="apc-avatar-img"
            style={{ borderColor: rankInfo.color }}
          />
        ) : (
          <div
            className="apc-avatar"
            style={{ borderColor: rankInfo.color }}
          >
            <span
              className="apc-avatar-letter"
              style={{ color: rankInfo.color }}
            >
              {profile.username?.[0]?.toUpperCase()}
            </span>
          </div>
        )}

        <span
          className="apc-rank-chip"
          style={{
            background: `${rankInfo.color}22`,
            color: rankInfo.color,
            border: `1px solid ${rankInfo.color}55`,
          }}
        >
          {rankInfo.rank}
        </span>
      </div>

      <div className="apc-info">
        <div className="apc-name-row">
          <h2
            className="apc-username"
            style={{ color: rankInfo.color }}
          >
            {profile.username}
          </h2>

          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="apc-link-btn"
          >
            ↗ Profile
          </a>
        </div>

        <div className="apc-tags">
          {profile.rank && profile.rank !== 'N/A' && (
            <span className="apc-tag">
              🏅 {profile.rank}
            </span>
          )}

          {profile.lastCompeted && (
            <span className="apc-tag">
              📅 Last: {profile.lastCompeted}
            </span>
          )}

          {profile.ratedMatches > 0 && (
            <span className="apc-tag">
              🏆 {profile.ratedMatches} contests
            </span>
          )}
        </div>

        <div className="apc-rating-row">
          <div className="apc-rating-item">
            <span
              className="apc-rating-val"
              style={{ color: rankInfo.color }}
            >
              {profile.rating}
            </span>
            <span className="apc-rating-lbl">
              Current Rating
            </span>
          </div>

          <div className="apc-rating-div" />

          <div className="apc-rating-item">
            <span
              className="apc-rating-val"
              style={{ color: highestRankInfo.color }}
            >
              {profile.highestRating}
            </span>
            <span className="apc-rating-lbl">
              Highest Rating
            </span>
          </div>

          <div className="apc-rating-div" />

          <div className="apc-rating-item">
            <span className="apc-rating-val">
              {profile.ratedMatches}
            </span>
            <span className="apc-rating-lbl">
              Rated Contests
            </span>
          </div>

          <div className="apc-rating-div" />

          <div className="apc-rating-item">
            <span
              className="apc-rating-val"
              style={{ color: highestRankInfo.color }}
            >
              {highestRankInfo.rank}
            </span>
            <span className="apc-rating-lbl">
              Highest Rank
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}