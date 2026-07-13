import React from "react";
import { getRatingColor, formatDate } from "../cfColors";
import "./CFProfileCard.css";

export default function CFProfileCard({ user, ratingHistoryCount = 0 }) {
  if (!user) return null;

  const ratingColor = getRatingColor(user.rating);
  const maxRatingColor = getRatingColor(user.maxRating);

  return (
    <div className="cfp-card">
      <div className="cfp-avatar-wrap">
        <img
          className="cfp-avatar"
          src={user.titlePhoto || user.avatar}
          alt={user.handle}
          style={{ borderColor: ratingColor }}
        />
      </div>

      <div className="cfp-info">
        <h2 className="cfp-handle" style={{ color: ratingColor }}>
          {user.handle}
        </h2>
        <p className="cfp-username">@{user.handle}</p>

        <div className="cfp-chips">
          {user.rank && (
            <span className="cfp-chip" style={{ color: ratingColor }}>
              <span className="cfp-chip-dot" style={{ background: ratingColor }} />
              {user.rank}
            </span>
          )}
          {user.organization && (
            <span className="cfp-chip">🏢 {user.organization}</span>
          )}
          {(user.city || user.country) && (
            <span className="cfp-chip">
              📍 {[user.city, user.country].filter(Boolean).join(", ")}
            </span>
          )}
          {user.registrationTimeSeconds && (
            <span className="cfp-chip">
              🗓 Joined {formatDate(user.registrationTimeSeconds)}
            </span>
          )}
        </div>
      </div>

      <div className="cfp-stats">
        <div className="cfp-stat">
          <span className="cfp-stat-value" style={{ color: ratingColor }}>
            {user.rating ?? "—"}
          </span>
          <span className="cfp-stat-label">RATING</span>
        </div>
        <div className="cfp-stat">
          <span className="cfp-stat-value" style={{ color: maxRatingColor }}>
            {user.maxRating ?? "—"}
          </span>
          <span className="cfp-stat-label">MAX RATING</span>
        </div>
        <div className="cfp-stat">
          <span className="cfp-stat-value">{ratingHistoryCount}</span>
          <span className="cfp-stat-label">CONTESTS</span>
        </div>
        <div className="cfp-stat">
          <span className="cfp-stat-value">{user.contribution ?? 0}</span>
          <span className="cfp-stat-label">CONTRIBUTION</span>
        </div>
        <div className="cfp-stat">
          <span className="cfp-stat-value">{user.friendOfCount ?? 0}</span>
          <span className="cfp-stat-label">FOLLOWERS</span>
        </div>
      </div>
    </div>
  );
}