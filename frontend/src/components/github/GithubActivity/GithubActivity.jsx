import { timeAgo } from '../../../services/github';
import './GithubActivity.css';

const EVENT_CONFIG = {
  PushEvent:              { icon: '⬆', label: 'Pushed to',       color: '#4f46e5' },
  PullRequestEvent:       { icon: '🔀', label: 'Pull request in', color: '#8b5cf6' },
  IssuesEvent:            { icon: '🐛', label: 'Issue in',        color: '#ef4444' },
  CreateEvent:            { icon: '✨', label: 'Created',         color: '#22c55e' },
  ForkEvent:              { icon: '🍴', label: 'Forked',          color: '#f59e0b' },
  WatchEvent:             { icon: '⭐', label: 'Starred',         color: '#f89a1c' },
  ReleaseEvent:           { icon: '🚀', label: 'Released in',     color: '#06b6d4' },
  DeleteEvent:            { icon: '🗑', label: 'Deleted from',    color: '#6b7280' },
  PullRequestReviewEvent: { icon: '👁', label: 'Reviewed PR in',  color: '#ec4899' },
  IssueCommentEvent:      { icon: '💬', label: 'Commented in',    color: '#10b981' },
  Default:                { icon: '⚡', label: 'Activity in',     color: '#6b7280' },
};

export default function GithubActivity({ events }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="gha-card">
      <div className="gha-title">Recent Activity</div>

      <div className="gha-list">
        {events.slice(0, 15).map((e, i) => {
          const cfg = EVENT_CONFIG[e.type] ?? EVENT_CONFIG.Default;
          const repo = e.repo?.name ?? 'Unknown';

          return (
            <div key={i} className="gha-item">
              <span
                className="gha-icon"
                style={{
                  background: `${cfg.color}18`,
                  border: `1px solid ${cfg.color}30`,
                }}
              >
                {cfg.icon}
              </span>

              <div className="gha-body">
                <span className="gha-action">
                  {cfg.label}{' '}
                </span>

                <a
                  href={`https://github.com/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gha-repo"
                >
                  {repo}
                </a>

                {e.type === 'PushEvent' &&
                  e.payload?.commits?.length > 0 && (
                    <span className="gha-detail">
                      {' '}· {e.payload.commits.length} commit
                      {e.payload.commits.length > 1 ? 's' : ''}
                    </span>
                  )}
              </div>

              <span className="gha-time">
                {timeAgo(e.created_at)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}