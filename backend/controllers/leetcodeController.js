const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });

const BASE_URL = 'https://leetcode.com/graphql';
const FALLBACK_BASE = 'https://alfa-leetcode-api.onrender.com';
const HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Referer': 'https://leetcode.com'
};

async function queryLeetCode(query, variables) {
  const res = await axios.post(BASE_URL, { query, variables }, { headers: HEADERS, timeout: 8000 });
  if (res.data.errors) {
    throw new Error(res.data.errors[0].message);
  }
  return res.data.data;
}

exports.getProfile = async (req, res) => {
  const { username } = req.params;
  const cacheKey = `${username}_profile`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          githubUrl
          twitterUrl
          linkedinUrl
          profile {
            realName
            userAvatar
            ranking
            reputation
            websites
            countryName
            company
            school
          }
        }
      }
    `;

    const data = await queryLeetCode(query, { username });
    const user = data.matchedUser;

    if (!user) {
      throw new Error('User not found');
    }

    const formatted = {
      username: user.username,
      name: user.profile.realName,
      avatar: user.profile.userAvatar,
      ranking: user.profile.ranking,
      reputation: user.profile.reputation,
      country: user.profile.countryName,
      school: user.profile.school,
      gitHub: user.githubUrl,
      linkedIN: user.linkedinUrl
    };

    cache.set(cacheKey, formatted);
    return res.json(formatted);
  } catch (err) {
    try {
      const fallbackRes = await axios.get(`${FALLBACK_BASE}/${username}`, { timeout: 6000 });
      cache.set(cacheKey, fallbackRes.data);
      return res.json(fallbackRes.data);
    } catch (fallbackErr) {
      return res.status(500).json({ error: fallbackErr.message });
    }
  }
};

exports.getSolved = async (req, res) => {
  const { username } = req.params;
  const cacheKey = `${username}_solved`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const query = `
      query userProblemsSolved($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    const data = await queryLeetCode(query, { username });
    const user = data.matchedUser;
    const qCount = data.allQuestionsCount;

    if (!user || !qCount) {
      throw new Error('User statistics not found');
    }

    const totalQuestions = qCount.find(q => q.difficulty === 'All')?.count || 3200;
    const totalEasy = qCount.find(q => q.difficulty === 'Easy')?.count || 800;
    const totalMedium = qCount.find(q => q.difficulty === 'Medium')?.count || 1600;
    const totalHard = qCount.find(q => q.difficulty === 'Hard')?.count || 800;

    const acSub = user.submitStats.acSubmissionNum;
    const totalSub = user.submitStats.totalSubmissionNum;

    const solvedProblem = acSub.find(a => a.difficulty === 'All')?.count || 0;
    const easySolved = acSub.find(a => a.difficulty === 'Easy')?.count || 0;
    const mediumSolved = acSub.find(a => a.difficulty === 'Medium')?.count || 0;
    const hardSolved = acSub.find(a => a.difficulty === 'Hard')?.count || 0;

    const totalAllSub = totalSub.find(t => t.difficulty === 'All')?.submissions || 1;
    const totalAllAc = acSub.find(t => t.difficulty === 'All')?.submissions || 0;
    const acceptanceRate = totalAllSub > 0 ? parseFloat(((totalAllAc / totalAllSub) * 100).toFixed(2)) : 0;

    const formatted = {
      solvedProblem,
      totalQuestions,
      easySolved,
      totalEasy,
      mediumSolved,
      totalMedium,
      hardSolved,
      totalHard,
      acceptanceRate,
      totalSubmissionNum: totalSub,
      acSubmissionNum: acSub
    };

    cache.set(cacheKey, formatted);
    return res.json(formatted);
  } catch (err) {
    try {
      const fallbackRes = await axios.get(`${FALLBACK_BASE}/${username}/solved`, { timeout: 6000 });
      cache.set(cacheKey, fallbackRes.data);
      return res.json(fallbackRes.data);
    } catch (fallbackErr) {
      return res.status(500).json({ error: fallbackErr.message });
    }
  }
};

exports.getContest = async (req, res) => {
  const { username } = req.params;
  const cacheKey = `${username}_contest`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const query = `
      query userContestRankingInfo($username: String!) {
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge {
            name
          }
        }
        userContestRankingHistory(username: $username) {
          attended
          trendDirection
          problemsSolved
          totalProblems
          finishTimeInSeconds
          rating
          ranking
          contest {
            title
            startTime
          }
        }
      }
    `;

    const data = await queryLeetCode(query, { username });

    const formatted = {
      contestRating: data.userContestRanking?.rating || 0,
      contestGlobalRanking: data.userContestRanking?.globalRanking || 0,
      contestTopPercentage: data.userContestRanking?.topPercentage || 0,
      contestAttend: data.userContestRanking?.attendedContestsCount || 0,
      contestParticipation: data.userContestRankingHistory || []
    };

    cache.set(cacheKey, formatted);
    return res.json(formatted);
  } catch (err) {
    try {
      const fallbackRes = await axios.get(`${FALLBACK_BASE}/${username}/contest`, { timeout: 6000 });
      cache.set(cacheKey, fallbackRes.data);
      return res.json(fallbackRes.data);
    } catch (fallbackErr) {
      return res.status(500).json({ error: fallbackErr.message });
    }
  }
};

exports.getCalendar = async (req, res) => {
  const { username } = req.params;
  const cacheKey = `${username}_calendar`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const query = `
      query userActiveCalendar($username: String!) {
        matchedUser(username: $username) {
          userCalendar {
            activeYears
            streak
            longestStreak
            submissionCalendar
          }
        }
      }
    `;

    const data = await queryLeetCode(query, { username });
    const calendar = data.matchedUser?.userCalendar;

    if (!calendar) {
      throw new Error('Calendar data not found');
    }

    const formatted = {
      submissionCalendar: calendar.submissionCalendar,
      calendar: calendar
    };

    cache.set(cacheKey, formatted);
    return res.json(formatted);
  } catch (err) {
    try {
      const fallbackRes = await axios.get(`${FALLBACK_BASE}/${username}/calendar`, { timeout: 6000 });
      cache.set(cacheKey, fallbackRes.data);
      return res.json(fallbackRes.data);
    } catch (fallbackErr) {
      return res.status(500).json({ error: fallbackErr.message });
    }
  }
};

exports.getSubmissions = async (req, res) => {
  const { username } = req.params;
  const limit = req.query.limit || 20;
  const cacheKey = `${username}_submissions_${limit}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const query = `
      query userRecentSubmissions($username: String!, $limit: Int!) {
        recentSubmissionList(username: $username, limit: $limit) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
          runtime
          memory
        }
      }
    `;

    const data = await queryLeetCode(query, { username, limit: parseInt(limit) });
    const list = data.recentSubmissionList || [];

    const formatted = {
      count: list.length,
      submission: list
    };

    cache.set(cacheKey, formatted);
    return res.json(formatted);
  } catch (err) {
    try {
      const fallbackRes = await axios.get(`${FALLBACK_BASE}/${username}/submission?limit=${limit}`, { timeout: 6000 });
      cache.set(cacheKey, fallbackRes.data);
      return res.json(fallbackRes.data);
    } catch (fallbackErr) {
      return res.status(500).json({ error: fallbackErr.message });
    }
  }
};
