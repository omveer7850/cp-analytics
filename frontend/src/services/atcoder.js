const PROXY = 'http://localhost:5001/api';

async function apiGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

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

export async function fetchAtCoderProfile(username) {
  try {
    const data = await apiGet(`${PROXY}/atcoder/profile/${username}`);
    return {
      username:        data.userName         ?? username,
      country:         null,
      affiliation:     null,
      avatar:          data.userAvatar       ?? null,
      rating:          data.userRating       ?? 0,
      highestRating:   data.userMaxRating    ?? 0,
      rank:            data.currentRank      ?? 'N/A',
      activeRank:      data.currentRank      ?? 'N/A',
      wins:            0,
      ratedMatches:    data.userContestCount ?? 0,
      joinedDate:      null,
      lastCompeted:    data.userLastCompeted ?? null,
      profileUrl:      `https://atcoder.jp/users/${username}`,
      rankInfo:        getRankInfo(data.userRating    ?? 0),
      highestRankInfo: getRankInfo(data.userMaxRating ?? 0),
    };
  } catch (e) {
    console.error('ATCODER PROFILE ERROR:', e);
    throw e;
  }
}

export async function fetchAtCoderHistory(username) {
  try {
    const data     = await apiGet(`${PROXY}/atcoder/profile/${username}`);
    const contests = data.userContests ?? [];

    return contests
      .map((c) => ({
        contestSlug:  c.contestId        ?? '',
        contestName:  c.contestName      ?? 'N/A',
        contestType:  c.isRated ? 'Rated' : 'Unrated',
        rank:         c.userRank         ?? 'N/A',
        performance:  c.userPerformance  ?? 0,
        oldRating:    c.userOldRating    ?? 0,
        newRating:    c.userNewRating    ?? 0,
        change:       c.userRatingChange ?? 0,
        date:         c.contestEndTime
          ? c.contestEndTime.split('T')[0]
          : 'N/A',
        url: `https://atcoder.jp/contests/${
          (c.contestId ?? '').replace('.contest.atcoder.jp', '')
        }`,
      }))
     // .reverse();
  } catch (e) {
    console.error('ATCODER HISTORY ERROR:', e);
    return [];
  }
}

export async function fetchAtCoderSubmissions(username) {
  try {
    const data = await apiGet(`${PROXY}/atcoder/submissions/${username}`);
    const list = Array.isArray(data) ? data : [];

    const stats = {};
    list.forEach((s) => {
      const r = s.result ?? s.Result ?? 'Other';
      stats[r] = (stats[r] ?? 0) + 1;
    });

    const recent = list
      .filter((s) => (s.result ?? s.Result) === 'AC')
      .slice(0, 10)
      .map((s) => ({
        id:        s.id             ?? Math.random(),
        problemId: s.problem_id     ?? s.ProblemID     ?? 'N/A',
        contest:   s.contest_id     ?? s.ContestID     ?? 'N/A',
        result:    s.result         ?? s.Result        ?? 'N/A',
        language:  s.language       ?? s.Language      ?? 'N/A',
        score:     s.score          ?? s.Score         ?? 0,
        time:      s.execution_time ?? s.ExecutionTime ?? 'N/A',
        memory:    s.memory         ?? s.Memory        ?? 'N/A',
      }));

    return { stats, recent };
  } catch (e) {
    console.error('ATCODER SUBMISSIONS ERROR:', e);
    return { stats: {}, recent: [] };
  }
}