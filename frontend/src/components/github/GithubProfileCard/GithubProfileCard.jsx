import './GithubProfileCard.css';

export default function GithubProfileCard({ profile }) {
  const joined = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="ghpc-card">
      <div className="ghpc-left">
        <div className="ghpc-avatar-wrap">
          <img
            src={profile.avatar_url}
            alt={profile.login}
            className="ghpc-avatar"
          />
        </div>

        <a
          href={`https://github.com/${profile.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ghpc-profile-btn"
        >
          ↗ View Profile
        </a>
      </div>

      <div className="ghpc-right">
        <div className="ghpc-name-row">
          <h2 className="ghpc-name">
            {profile.name ?? profile.login}
          </h2>

          <span className="ghpc-login">
            @{profile.login}
          </span>
        </div>

        {profile.bio && (
          <p className="ghpc-bio">
            {profile.bio}
          </p>
        )}

        <div className="ghpc-tags">
          {profile.company && (
            <span className="ghpc-tag">
              🏢 {profile.company}
            </span>
          )}

          {profile.location && (
            <span className="ghpc-tag">
              📍 {profile.location}
            </span>
          )}

          {joined && (
            <span className="ghpc-tag">
              📅 Joined {joined}
            </span>
          )}

          {profile.blog && (
            <a
              href={
                profile.blog.startsWith('http')
                  ? profile.blog
                  : `https://${profile.blog}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="ghpc-tag ghpc-tag--link"
            >
              🔗 Website
            </a>
          )}

          {profile.twitter_username && (
            <a
              href={`https://twitter.com/${profile.twitter_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ghpc-tag ghpc-tag--link"
            >
              🐦 @{profile.twitter_username}
            </a>
          )}
        </div>

        <div className="ghpc-stats-row">
          <div className="ghpc-stat">
            <span className="ghpc-stat-val">
              {profile.followers?.toLocaleString() ?? 0}
            </span>
            <span className="ghpc-stat-lbl">
              Followers
            </span>
          </div>

          <div className="ghpc-stat-div" />

          <div className="ghpc-stat">
            <span className="ghpc-stat-val">
              {profile.following?.toLocaleString() ?? 0}
            </span>
            <span className="ghpc-stat-lbl">
              Following
            </span>
          </div>

          <div className="ghpc-stat-div" />

          <div className="ghpc-stat">
            <span className="ghpc-stat-val">
              {profile.public_repos?.toLocaleString() ?? 0}
            </span>
            <span className="ghpc-stat-lbl">
              Repositories
            </span>
          </div>

          <div className="ghpc-stat-div" />

          <div className="ghpc-stat">
            <span className="ghpc-stat-val">
              {profile.public_gists?.toLocaleString() ?? 0}
            </span>
            <span className="ghpc-stat-lbl">
              Gists
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}