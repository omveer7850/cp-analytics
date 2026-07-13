import './LoadingState.css';

function Shimmer({ width, height, radius = 8 }) {
  return (
    <div
      className="shimmer"
      style={{ width, height, borderRadius: radius }}
    />
  );
}

export default function LoadingState() {
  return (
    <div className="ls-wrap">
      <div className="ls-top">
        <div className="ls-profile-card">
          <Shimmer width={72} height={72} radius={50} />
          <div className="ls-profile-text">
            <Shimmer width={140} height={16} />
            <Shimmer width={100} height={12} />
            <Shimmer width={80}  height={12} />
          </div>
        </div>
        <div className="ls-circle">
          <Shimmer width={180} height={180} radius={90} />
        </div>
      </div>
      <div className="ls-cards">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="ls-card">
            <Shimmer width="60%" height={12} />
            <Shimmer width="40%" height={24} />
          </div>
        ))}
      </div>
      <div className="ls-topics">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="ls-topic">
            <Shimmer width="50%" height={12} />
            <Shimmer width="100%" height={8} radius={4} />
          </div>
        ))}
      </div>
    </div>
  );
}