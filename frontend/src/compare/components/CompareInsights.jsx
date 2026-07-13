import './CompareInsights.css';

export default function CompareInsights({ insights }) {
  if (!insights.length) return null;

  return (
    <div className="ci-card">
      <div className="ci-title">AI Insights</div>
      <div className="ci-list">
        {insights.map((insight, i) => (
          <div key={i} className="ci-item">
            <span className="ci-icon">{insight.icon}</span>
            <span className="ci-text">{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}