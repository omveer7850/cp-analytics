import './GithubOrgs.css';

export default function GithubOrgs({ orgs }) {
  if (!orgs || orgs.length === 0) return null;

  return (
    <div className="gho-card">
      <div className="gho-title">Organizations</div>

      <div className="gho-grid">
        {orgs.map((org) => (
          <a
            key={org.id}
            href={`https://github.com/${org.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gho-item"
          >
            <img
              src={org.avatar_url}
              alt={org.login}
              className="gho-avatar"
            />

            <span className="gho-name">
              {org.login}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}