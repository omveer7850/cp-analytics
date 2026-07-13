const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const PROXY = `${API_BASE}/api`;

async function apiGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function parseRatingHistory(ratingData) {
  if (!Array.isArray(ratingData)) return [];
  return ratingData.map((c, i, arr) => {
    const prev   = i > 0 ? (arr[i - 1]?.rating ?? c.rating) : c.rating;
    const change = Math.round((c.rating ?? 0) - prev);
    return {
      contestName: c.name     ?? c.code ?? 'Contest',
      contestCode: c.code     ?? '',
      rank:        c.rank     ?? 'N/A',
      rating:      c.rating   ?? 0,
      change:      i === 0 ? 0 : change,
      date:        c.end_date ?? c.date ?? 'N/A',
      url:         c.code
        ? `https://www.codechef.com/${c.code}`
        : 'https://www.codechef.com/contests',
    };
  }).reverse();
}

export async function fetchAllCodechefData(username) {
  const data = await apiGet(`${PROXY}/codechef/profile/${username}`);

  const history = parseRatingHistory(data.ratingData ?? data.rating_data ?? []);

  return {
    profile: {
      username:      data.username      ?? data.handle       ?? username,
      fullName:      data.name          ?? null,
      avatar:        data.profile       ?? data.avatar        ?? null,
      country:       data.countryName   ?? data.country       ?? null,
      countryFlag:   data.countryFlag   ?? null,
      institution:   data.organization  ?? data.institution   ?? null,
      currentRating: data.currentRating ?? data.rating        ?? 0,
      highestRating: data.highestRating ?? data.max_rating    ?? 0,
      stars:         data.stars         ?? null,
      globalRank:    data.globalRank    ?? data.global_rank   ?? 'N/A',
      countryRank:   data.countryRank   ?? data.country_rank  ?? 'N/A',
      profileUrl:    `https://www.codechef.com/users/${username}`,
    },
    history,
    stats: {
      contestCount: history.length,
      bestRank: history.length
        ? Math.min(...history.map((h) => typeof h.rank === 'number' ? h.rank : Infinity))
        : 'N/A',
    },
  };
}