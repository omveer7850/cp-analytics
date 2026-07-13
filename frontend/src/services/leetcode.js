const BASE = 'https://alfa-leetcode-api.onrender.com';

async function apiGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  console.log('API:', url, json);
  return json;
}

export async function fetchLeetCodeProfile(username) {
  try {
    const data = await apiGet(`${BASE}/${username}`);
    return {
      username:   data.username   ?? username,
      realName:   data.name       ?? 'N/A',
      avatar:     data.avatar     ?? `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
      ranking:    data.ranking    ?? 'N/A',
      reputation: data.reputation ?? 0,
      country:    data.country    ?? null,
      globalRank: data.ranking    ?? 'N/A',
      school:     data.school     ?? null,
      memberSince: data.birthday  ?? null,
      github:     data.gitHub     ?? null,
      linkedIn:   data.linkedIN   ?? null,
    };
  } catch (e) {
    console.error('PROFILE ERROR:', e);
    throw e;
  }
}

// alfa-leetcode-api's /solved endpoint doesn't return a flat
// "totalSubmissions" field — the real submission count lives inside the
// totalSubmissionNum array, under the "All" difficulty entry's
// `.submissions` value (count = problems solved, submissions = total
// attempts). Reading `.totalSubmissions` directly (the old code) was
// always undefined, which is why it silently showed 0.
function extractTotalSubmissions(solved) {
  const arr = solved?.totalSubmissionNum;
  if (Array.isArray(arr)) {
    const allEntry = arr.find((e) => e.difficulty === 'All');
    if (typeof allEntry?.submissions === 'number') return allEntry.submissions;
  }
  return solved?.totalSubmissions ?? 0;
}

export async function fetchLeetCodeSolved(username) {
  try {
    const [profile, solved] = await Promise.all([
      apiGet(`${BASE}/${username}`),
      apiGet(`${BASE}/${username}/solved`),
    ]);

    const easy   = solved.easySolved   ?? profile.easySolved   ?? 0;
    const medium = solved.mediumSolved ?? profile.mediumSolved ?? 0;
    const hard   = solved.hardSolved   ?? profile.hardSolved   ?? 0;
    const total  = solved.solvedProblem ?? profile.totalSolved ?? (easy + medium + hard);

    return {
      totalSolved:      total,
      totalQuestions:   solved.totalQuestions ?? 3600,
      easySolved:       easy,
      easyTotal:        solved.totalEasy      ?? 850,
      mediumSolved:     medium,
      mediumTotal:      solved.totalMedium    ?? 1800,
      hardSolved:       hard,
      hardTotal:        solved.totalHard      ?? 750,
      acceptanceRate:   solved.acceptanceRate ?? 'N/A',
      submissionsTotal: extractTotalSubmissions(solved),
      // The profile (/username) endpoint never actually has an
      // "activeDays" field — that number only exists in the submission
      // calendar. Left as 'N/A' here on purpose; fetchLeetCodeCalendar
      // below now returns the real value under `activeDays`.
      activeDays:       'N/A',
    };
  } catch (e) {
    console.error('SOLVED ERROR:', e);
    throw e;
  }
}

export async function fetchLeetCodeTopics(username) {
  try {
    const data = await apiGet(`${BASE}/${username}/solved`);

    // Try skillStats first (topic-wise)
    const skillStats = data.skillStats ?? null;
    if (skillStats) {
      const all = [
        ...(skillStats.advanced     ?? []),
        ...(skillStats.intermediate ?? []),
        ...(skillStats.fundamental  ?? []),
      ];
      if (all.length > 0) {
        return all.map((t) => ({
          topic:  t.tagName          ?? 'Unknown',
          solved: t.problemsSolved   ?? 0,
          total:  t.totalProblemsCount ?? 0,
        }));
      }
    }

   
    const acList = data.acSubmissionNum ?? [];
    if (acList.length > 0) {
      return acList
        .filter((t) => t.difficulty !== 'All')
        .map((t) => ({
          topic:  t.difficulty ?? 'Unknown',
          solved: t.count      ?? 0,
          total:  t.submissions ?? t.count ?? 0,
        }));
    }

    return [];
  } catch (e) {
    console.error('TOPICS ERROR:', e);
    return [];
  }
}

export async function fetchLeetCodeContestHistory(username) {
  try {
    const data = await apiGet(`${BASE}/${username}/contest`);

    const rating        = data?.contestRating          ?? 0;
    const globalRank    = data?.contestGlobalRanking   ?? 'N/A';
    const topPercent    = data?.contestTopPercentage   ?? 'N/A';
    const totalContests = data?.contestAttend          ?? 0;
    const history        = data?.contestParticipation   ?? [];

    return {
      rating:        Math.round(rating) || 'N/A',
      globalRank,
      topPercentage: topPercent,
      totalContests,
      history: history
        .filter((h) => h.attended)
        .map((h, i, arr) => {
          const prev   = i > 0 ? (arr[i - 1]?.rating ?? h.rating) : h.rating;
          const change = Math.round((h.rating ?? 0) - prev);
          return {
            contest: h.contest?.title   ?? 'Contest',
            rank:    h.ranking          ?? 'N/A',
            rating:  Math.round(h.rating ?? 0),
            change:  i === 0 ? 0 : change,
            solved:  h.problemsSolved   ?? 0,
            date:    h.contest?.startTime
              ? new Date(h.contest.startTime * 1000).toISOString().split('T')[0]
              : 'N/A',
          };
        })
        .slice(-15),
    };
  } catch (e) {
    console.error('CONTEST ERROR:', e);
    return {
      rating: 'N/A', globalRank: 'N/A',
      topPercentage: 'N/A', totalContests: 0, history: [],
    };
  }
}

export async function fetchLeetCodeCalendar(username) {
  try {
    const data = await apiGet(`${BASE}/${username}/calendar`);

    const raw = data?.submissionCalendar
      ?? data?.calendar
      ?? '{}';

    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const submissions = {};

    Object.entries(parsed).forEach(([ts, count]) => {
      const date = new Date(Number(ts) * 1000).toISOString().split('T')[0];
      submissions[date] = Number(count);
    });

    const sortedDates = Object.keys(submissions).sort();
    const total = Object.values(submissions).reduce((a, b) => a + b, 0);

    // Active Days = number of distinct days with at least one submission —
    // this is the real source of truth for that stat, computed here once
    // so every consumer (StatsCards etc.) can just read `.activeDays`
    // instead of trying to derive it themselves.
    const activeDays = sortedDates.filter((d) => submissions[d] > 0).length;

    let longest = 0, temp = 0, current = 0;
    sortedDates.forEach((d) => {
      if (submissions[d] > 0) { temp++; if (temp > longest) longest = temp; }
      else temp = 0;
    });

    const today = new Date().toISOString().split('T')[0];
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      if (sortedDates[i] <= today && submissions[sortedDates[i]] > 0) current++;
      else if (sortedDates[i] <= today) break;
    }

    return {
      submissions,
      currentStreak:    current,
      longestStreak:    longest,
      totalSubmissions: total,
      activeDays,
    };
  } catch (e) {
    console.error('CALENDAR ERROR:', e);
    return { submissions: {}, currentStreak: 0, longestStreak: 0, totalSubmissions: 0, activeDays: 0 };
  }
}

export async function fetchRecentSubmissions(username) {
  try {
    const data = await apiGet(`${BASE}/${username}/submission?limit=20`);
    const list = data?.submission ?? data?.recentSubmissionList ?? [];

    return list
      .filter((s) => s.statusDisplay === 'Accepted')
      .slice(0, 7)
      .map((s, i) => ({
        id:         i,
        title:      s.title         ?? s.titleSlug  ?? 'N/A',
        difficulty: s.difficulty    ?? 'N/A',
        status:     s.statusDisplay ?? 'Accepted',
        lang:       s.lang          ?? s.langName   ?? 'N/A',
        runtime:    s.runtime       ?? 'N/A',
        memory:     s.memory        ?? 'N/A',
        time:       s.timestamp
          ? timeAgo(Number(s.timestamp) * 1000)
          : 'N/A',
      }));
  } catch (e) {
    console.error('SUBMISSIONS ERROR:', e);
    return [];
  }
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return 'just now';
}