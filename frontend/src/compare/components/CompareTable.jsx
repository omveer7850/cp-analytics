import './CompareTable.css';

export default function CompareTable({ results, winners }) {
  const users = results.filter((r) => r.ok).map((r) => r.data);
  if (!users.length) return null;

  const metrics = Object.keys(users[0].metrics);

  return (
    <div className="ct-card">
      <div className="ct-title">Comparison Table</div>
      <div className="ct-table-wrap">
        <table className="ct-table">
         <thead>
  <tr className="ct-header-row">
    <th className="ct-metric-col">Metric</th>
   {users.map((u) => (
  <th key={u.username} className="ct-user-header">
    {u.username}
  </th>
))}
  </tr>
</thead>
          <tbody>
            {metrics.map((metric) => {
              const winnerVal = winners[metric];
              return (
                <tr key={metric}>
                  <td className="ct-metric-name">{metric}</td>
                  {users.map((u) => {
                    const cell     = u.metrics[metric];
                    const rawVal   = cell?.value;
                    const numVal   = typeof rawVal === 'string'
                      ? parseFloat(rawVal) || 0
                      : (rawVal ?? 0);
                    const isWinner = cell?.type !== 'text' && winnerVal !== undefined && numVal === winnerVal;

                    return (
                      <td
                        key={u.username}
                        className={`ct-cell ${isWinner ? 'ct-cell--winner' : ''}`}
                      >
                        {isWinner && <span className="ct-win-dot" />}
                        {rawVal ?? 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}