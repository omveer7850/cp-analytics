import './AtCoderStatsCards.css';
import { getRankInfo } from '../../../services/atcoder';

export default function AtCoderStatsCards({ profile, submissions }) {
  const currentRank  = getRankInfo(profile.rating);
  const highestRank  = getRankInfo(profile.highestRating);
  const totalAC      = submissions?.stats?.AC ?? submissions?.stats?.Accepted ?? 0;

  const cards = [
    { label: 'Current Rating',  value: profile.rating,                            color: currentRank.color  },
    { label: 'Highest Rating',  value: profile.highestRating,                     color: highestRank.color  },
    { label: 'Current Rank',    value: currentRank.rank,                          color: currentRank.color  },
    { label: 'Highest Rank',    value: highestRank.rank,                          color: highestRank.color  },
    { label: 'Rated Contests',  value: profile.ratedMatches,                      color: '#4f46e5'          },
    { label: 'Last Competed',   value: profile.lastCompeted ?? 'N/A',             color: '#06b6d4'          },
    { label: 'AC Submissions',  value: totalAC > 0 ? totalAC : 'N/A',            color: '#22c55e'          },
    { label: 'Global Rank',     value: profile.rank !== 'N/A' ? profile.rank : 'N/A', color: '#8b5cf6'    },
  ];

  return (
    <div className="acs-grid">
      {cards.map((c) => (
        <div key={c.label} className="acs-card" style={{ '--card-color': c.color }}>
          <span className="acs-dot"  style={{ background: c.color }} />
          <span className="acs-val"  style={{ color: c.color }}>{c.value}</span>
          <span className="acs-lbl">{c.label}</span>
        </div>
      ))}
    </div>
  );
}