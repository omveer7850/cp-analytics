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
    const res = await fetch(`https://corsproxy.io/?https://atcoder.jp/users/${username}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const container = doc.querySelector("#main-container .row");
    if (!container) {
      throw new Error("User not found");
    }

    const userNameElement = container.querySelector(".col-md-3.col-sm-12 h3 .username span");
    const userName = userNameElement ? userNameElement.textContent.trim() : username;

    const currentRank = container.querySelector(".col-md-3.col-sm-12 h3 b")?.textContent.trim() || 'N/A';
    const userAvatar = container.querySelector(".col-md-3.col-sm-12 .avatar")?.getAttribute("src")?.trim() || "";

    let userRank = 0;
    let userRating = 0;
    let userMaxRating = 0;
    let userContestCount = 0;
    let userLastCompeted = 'N/A';

    container.querySelectorAll(".col-md-9.col-sm-12 .dl-table tbody tr").forEach((tr) => {
      const th = tr.querySelector("th")?.textContent.trim() || "";
      const td = tr.querySelector("td")?.textContent.trim() || "";

      if (th.includes("Rank")) {
        userRank = Number(td.replace(/[^\d]/g, "")) || 0;
      } else if (th.includes("Rating")) {
        userRating = Number(tr.querySelector("td span")?.textContent.trim()) || 0;
      } else if (th.includes("Highest Rating")) {
        userMaxRating = Number(tr.querySelector("td span")?.textContent.trim()) || 0;
      } else if (th.includes("Rated Matches")) {
        userContestCount = Number(td) || 0;
      } else if (th.includes("Last Competed")) {
        userLastCompeted = td;
      }
    });

    let userContests = [];
    try {
      const historyRes = await fetch(`https://corsproxy.io/?https://atcoder.jp/users/${username}/history/json`);
      if (historyRes.ok) {
        userContests = await historyRes.json();
      }
    } catch (e) {
      userContests = [];
    }

    return {
      username:        userName,
      country:         null,
      affiliation:     null,
      avatar:          userAvatar,
      rating:          userRating,
      highestRating:   userMaxRating,
      rank:            currentRank,
      activeRank:      currentRank,
      wins:            0,
      ratedMatches:    userContestCount,
      joinedDate:      null,
      lastCompeted:    userLastCompeted,
      profileUrl:      `https://atcoder.jp/users/${username}`,
      rankInfo:        getRankInfo(userRating),
      highestRankInfo: getRankInfo(userMaxRating),
      userContests:    userContests.map((item) => ({
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
    const historyRes = await fetch(`https://corsproxy.io/?https://atcoder.jp/users/${username}/history/json`);
    if (!historyRes.ok) throw new Error(`HTTP ${historyRes.status}`);
    const contests = await historyRes.json();

    return contests
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