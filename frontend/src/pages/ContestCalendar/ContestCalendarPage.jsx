import { useState, useEffect, useMemo } from 'react';
import { fetchAllContests } from '../../services/contests';
import ContestCard from '../../components/charts/ContestChart/ContestCard';
import ContestFilters from '../../components/charts/ContestChart/ContestFilters';
import './ContestCalendarPage.css';

export default function ContestCalendarPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activePlatform, setActivePlatform] = useState('All');

  useEffect(() => {
    fetchAllContests().then((data) => {
      setContests(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    return contests
      .filter((c) => new Date(c.endTime) > now)
      .filter((c) => activePlatform === 'All' || c.platform === activePlatform)
      .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [contests, search, activePlatform]);

  return (
    <div className="ccp-page">
      <header className="ccp-header">
        <div style={{ flex: 1 }}></div> {}
        <button className="ccp-refresh-btn" onClick={() => window.location.reload()}>Refresh</button>
      </header>

      <ContestFilters 
        search={search} onSearchChange={setSearch} 
        activePlatform={activePlatform} onPlatformChange={setActivePlatform} 
        totalCount={contests.length} filteredCount={filtered.length} 
      />

      <div className="ccp-grid">
        {loading ? (
          <p className="ccp-status">Loading schedule...</p>
        ) : filtered.length === 0 ? (
          <p className="ccp-status">No contests found.</p>
        ) : (
          filtered.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))
        )}
      </div>
    </div>
  );
}