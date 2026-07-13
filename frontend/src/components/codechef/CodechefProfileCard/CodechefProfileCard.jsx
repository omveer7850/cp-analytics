import './CodechefProfileCard.css';

function getStarColor(stars) {
  if (!stars) return '#808080';

  const n = parseInt(stars);

  if (n >= 7) return '#FF0000';
  if (n >= 6) return '#FF8000';
  if (n >= 5) return '#FFD700';
  if (n >= 4) return '#0000FF';
  if (n >= 3) return '#00C0C0';
  if (n >= 2) return '#008000';

  return '#808080';
}

export default function CodechefProfileCard({ profile }) {
  const starColor = getStarColor(profile.stars);

  return (
    <div className="ccpc-card">
      <div className="ccpc-left">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.username}
            className="ccpc-avatar"
          />
        ) : (
          <div
            className="ccpc-avatar-placeholder"
            style={{
              background: `${starColor}22`,
              color: starColor,
            }}
          >
            {profile.username?.[0]?.toUpperCase()}
          </div>
        )}

        {profile.stars && (
          <span
            className="ccpc-stars"
            style={{ color: starColor }}
          >
            {'★'.repeat(parseInt(profile.stars) || 0)} {profile.stars}
          </span>
        )}
      </div>

      <div className="ccpc-info">
        <div className="ccpc-name-row">
          <div>
            <h2
              className="ccpc-username"
              style={{ color: starColor }}
            >
              {profile.username}
            </h2>

            {profile.fullName && (
              <span className="ccpc-fullname">
                {profile.fullName}
              </span>
            )}
          </div>

          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ccpc-link-btn"
          >
            ↗ Profile
          </a>
        </div>

        <div className="ccpc-tags">
          {profile.country && (
            <span className="ccpc-tag">
              {profile.countryFlag && (
                <img
                  src={profile.countryFlag}
                  alt={profile.country}
                  className="ccpc-flag"
                />
              )}
              {profile.country}
            </span>
          )}

          {profile.institution && (
            <span className="ccpc-tag">
              🏫 {profile.institution}
            </span>
          )}
        </div>

        <div className="ccpc-rating-row">
          <div className="ccpc-rating-item">
            <span
              className="ccpc-rating-val"
              style={{ color: starColor }}
            >
              {profile.currentRating}
            </span>

            <span className="ccpc-rating-lbl">
              Current Rating
            </span>
          </div>

          <div className="ccpc-rating-div" />

          <div className="ccpc-rating-item">
            <span className="ccpc-rating-val">
              {profile.highestRating}
            </span>

            <span className="ccpc-rating-lbl">
              Highest Rating
            </span>
          </div>

          {profile.globalRank !== 'N/A' && (
            <>
              <div className="ccpc-rating-div" />

              <div className="ccpc-rating-item">
                <span className="ccpc-rating-val">
                  #{profile.globalRank}
                </span>

                <span className="ccpc-rating-lbl">
                  Global Rank
                </span>
              </div>
            </>
          )}

          {profile.countryRank !== 'N/A' && (
            <>
              <div className="ccpc-rating-div" />

              <div className="ccpc-rating-item">
                <span className="ccpc-rating-val">
                  #{profile.countryRank}
                </span>

                <span className="ccpc-rating-lbl">
                  Country Rank
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}