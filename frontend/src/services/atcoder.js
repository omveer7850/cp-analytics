export function getRankInfo(rating) {
  if (rating >= 2800) return { rank: 'Red',     color: '#FF0000' };
  if (rating >= 2400) return { rank: 'Orange',  color: '#FF8000' };
  if (rating >= 2000) return { rank: 'Yellow',  color: '#C0C000' };
  if (rating >= 1600) return { rank: 'Blue',    color: '#0000FF' };
  if (rating >= 1200) return { rank: 'Cyan',    color: '#00C0C0' };
  if (rating >= 800)  return { rank: 'Green',   color: '#008000' };
  if (rating >= 400)  return { rank: 'Brown',   color: '#804000' };
  if (rating > 0)     return { rank: 'Gray',    color: '#808080' };
  return               { rank: 'Unrated', color: '#808080' };
}

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function fetchWithProxy(targetUrl) {
  let lastError;

  try {
    const res = await fetchWithTimeout(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`, {}, 10000);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    lastError = err;
  }

  try {
    const res = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`, {}, 10000);
    if (res.ok) {
      const wrapper = await res.json();
      if (wrapper.contents) {
        return JSON.parse(wrapper.contents);
      }
    }
  } catch (err) {
    lastError = err;
  }

  throw lastError || new Error("All proxies failed");
}

export async function fetchAtCoderProfile(username) {
  try {
    const contests = await fetchWithProxy(`https://atcoder.jp/users/${username}/history/json`);
    const history = contests || [];

    let rating = 0;
    let maxRating = 0;
    let lastCompeted = 'N/A';
    let ratedMatches = 0;

    if (history.length > 0) {
      const ratedContests = history.filter((c) => c.IsRated);
      ratedMatches = ratedContests.length;

      const lastContest = history[history.length - 1];
      rating = lastContest.NewRating || 0;
      lastCompeted = lastContest.EndTime ? lastContest.EndTime.split('T')[0] : 'N/A';

      const ratings = history.map((c) => c.NewRating).filter((r) => typeof r === 'number');
      if (ratings.length > 0) {
        maxRating = Math.max(...ratings);
      }
    }

    const rankInfo = getRankInfo(rating);

    return {
      username,
      country:         null,
      affiliation:     null,
      avatar:          `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
      rating,
      highestRating:   maxRating,
      rank:            rankInfo.rank,
      activeRank:      rankInfo.rank,
      wins:            0,
      ratedMatches,
      joinedDate:      null,
      lastCompeted,
      profileUrl:      `https://atcoder.jp/users/${username}`,
      rankInfo:        rankInfo,
      highestRankInfo: getRankInfo(maxRating),
      userContests:    history.map((item) => ({
        userRank: item.Place,
        userOldRating: item.OldRating,
        userNewRating: item.NewRating,
        userRatingChange: item.NewRating - item.OldRating,
        contestName: item.ContestName,
        userPerformance: item.Performance,
        contestEndTime: item.EndTime,
        isRated: item.IsRated,
        contestId: item.ContestScreenName
      }))
    };
  } catch (e) {
    console.error('ATCODER PROFILE ERROR:', e);
    throw e;
  }
}

export async function fetchAtCoderHistory(username) {
  try {
    const contests = await fetchWithProxy(`https://atcoder.jp/users/${username}/history/json`);
    const history = contests || [];

    return history
      .map((c) => ({
        contestSlug:  c.ContestScreenName        ?? '',
        contestName:  c.ContestName      ?? 'N/A',
        contestType:  c.IsRated ? 'Rated' : 'Unrated',
        rank:         c.Place         ?? 'N/A',
        performance:  c.Performance  ?? 0,
        oldRating:    c.OldRating    ?? 0,
        newRating:    c.NewRating    ?? 0,
        change:       c.NewRating - c.OldRating,
        date:         c.EndTime
          ? c.EndTime.split('T')[0]
          : 'N/A',
        url: `https://atcoder.jp/contests/${
          (c.ContestScreenName ?? '').replace('.contest.atcoder.jp', '')
        }`,
      }));
  } catch (e) {
    console.error('ATCODER HISTORY ERROR:', e);
    return [];
  }
}

export async function fetchAtCoderSubmissions(username) {
  try {
    const res = await fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${username}&from_second=0`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();

    const stats = {};
    list.forEach((s) => {
      const r = s.result ?? 'Other';
      stats[r] = (stats[r] ?? 0) + 1;
    });

    const recent = list
      .filter((s) => s.result === 'AC')
      .slice(0, 10)
      .map((s) => ({
        id:        s.id             ?? Math.random(),
        problemId: s.problem_id     ?? 'N/A',
        contest:   s.contest_id     ?? 'N/A',
        result:    s.result         ?? 'N/A',
        language:  s.language       ?? 'N/A',
        score:     s.score          ?? 0,
        time:      s.execution_time ?? 'N/A',
        memory:    s.memory         ?? 'N/A',
      }));

    return { stats, recent };
  } catch (e) {
    console.error('ATCODER SUBMISSIONS ERROR:', e);
    return { stats: {}, recent: [] };
  }
}