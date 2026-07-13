const axios = require('axios');

const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

exports.getProfile = async (req, res) => {
  const { username } = req.params;
  const now = Date.now();

  if (cache.has(username)) {
    const cached = cache.get(username);
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return res.json(cached.data);
    }
  }

  const query = `
    query leetcodeData($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          ranking
          reputation
          school
          countryName
        }
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
        submissionCalendar
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        topPercentage
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
      recentAcSubmissionList(username: $username, limit: 15) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      {
        query,
        variables: { username },
      },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://leetcode.com/',
        },
      }
    );

    const leetcodeData = response.data?.data;
    if (!leetcodeData || !leetcodeData.matchedUser) {
      return res.status(404).json({ error: `Could not find LeetCode user "${username}".` });
    }

    const { matchedUser, userContestRanking, userContestRankingHistory, recentAcSubmissionList } = leetcodeData;

    const profile = {
      username: matchedUser.username,
      realName: matchedUser.profile.realName || 'N/A',
      avatar: matchedUser.profile.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
      ranking: matchedUser.profile.ranking || 'N/A',
      reputation: matchedUser.profile.reputation || 0,
      country: matchedUser.profile.countryName || null,
      globalRank: matchedUser.profile.ranking || 'N/A',
      school: matchedUser.profile.school || null,
      memberSince: null,
      github: null,
      linkedIn: null,
    };

    const acNum = matchedUser.submitStats.acSubmissionNum || [];
    const totalNum = matchedUser.submitStats.totalSubmissionNum || [];

    const getCount = (arr, diff, key = 'count') => {
      const found = arr.find((item) => item.difficulty === diff);
      return found ? found[key] : 0;
    };

    const easySolved = getCount(acNum, 'Easy');
    const mediumSolved = getCount(acNum, 'Medium');
    const hardSolved = getCount(acNum, 'Hard');
    const totalSolved = getCount(acNum, 'All');

    const easyTotal = getCount(totalNum, 'Easy') || 850;
    const mediumTotal = getCount(totalNum, 'Medium') || 1800;
    const hardTotal = getCount(totalNum, 'Hard') || 750;
    const totalQuestions = getCount(totalNum, 'All') || 3400;

    const submissionsTotal = getCount(totalNum, 'All', 'submissions');
    const acceptanceRate = submissionsTotal > 0 
      ? ((totalSolved / submissionsTotal) * 100).toFixed(2) + '%' 
      : 'N/A';

    const calendarRaw = JSON.parse(matchedUser.submissionCalendar || '{}');
    const submissions = {};
    Object.entries(calendarRaw).forEach(([ts, count]) => {
      const date = new Date(Number(ts) * 1000).toISOString().split('T')[0];
      submissions[date] = Number(count);
    });

    const sortedDates = Object.keys(submissions).sort();
    const activeDays = sortedDates.filter((d) => submissions[d] > 0).length;

    let longestStreak = 0;
    let tempStreak = 0;
    sortedDates.forEach((d) => {
      if (submissions[d] > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    const today = new Date().toISOString().split('T')[0];
    let currentStreak = 0;
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      if (sortedDates[i] <= today && submissions[sortedDates[i]] > 0) {
        currentStreak++;
      } else if (sortedDates[i] <= today) {
        break;
      }
    }

    const calendar = {
      submissions,
      currentStreak,
      longestStreak,
      totalSubmissions: submissionsTotal,
      activeDays,
    };

    const solved = {
      totalSolved,
      totalQuestions,
      easySolved,
      easyTotal,
      mediumSolved,
      mediumTotal,
      hardSolved,
      hardTotal,
      acceptanceRate,
      submissionsTotal,
      activeDays,
    };

    const contestRating = userContestRanking?.rating || 0;
    const globalRank = userContestRanking?.globalRanking || 'N/A';
    const topPercentage = userContestRanking?.topPercentage || 'N/A';
    const totalContests = userContestRanking?.attendedContestsCount || 0;

    const history = (userContestRankingHistory || [])
      .filter((h) => h.attended)
      .map((h, i, arr) => {
        const prev = i > 0 ? (arr[i - 1]?.rating ?? h.rating) : h.rating;
        const change = Math.round((h.rating ?? 0) - prev);
        return {
          contest: h.contest?.title || 'Contest',
          rank: h.ranking || 'N/A',
          rating: Math.round(h.rating || 0),
          change: i === 0 ? 0 : change,
          solved: h.problemsSolved || 0,
          date: h.contest?.startTime
            ? new Date(h.contest.startTime * 1000).toISOString().split('T')[0]
            : 'N/A',
        };
      })
      .slice(-15);

    const contest = {
      rating: Math.round(contestRating) || 'N/A',
      globalRank,
      topPercentage,
      totalContests,
      history,
    };

    const recent = (recentAcSubmissionList || [])
      .slice(0, 7)
      .map((s, i) => {
        const timestamp = Number(s.timestamp);
        const diff = Date.now() - (timestamp * 1000);
        const m = Math.floor(diff / 60000);
        const h = Math.floor(m / 60);
        const d = Math.floor(h / 24);
        let timeAgoStr = 'just now';
        if (d > 0) timeAgoStr = `${d}d ago`;
        else if (h > 0) timeAgoStr = `${h}h ago`;
        else if (m > 0) timeAgoStr = `${m}m ago`;

        return {
          id: i,
          title: s.title || 'N/A',
          difficulty: 'N/A',
          status: 'Accepted',
          lang: s.lang || 'N/A',
          runtime: 'N/A',
          memory: 'N/A',
          time: timeAgoStr,
        };
      });

    const finalResult = {
      profile,
      solved,
      contest,
      calendar,
      recent,
    };

    cache.set(username, {
      timestamp: now,
      data: finalResult,
    });

    res.json(finalResult);
  } catch (err) {
    console.error(err.message);
    res.status(503).json({ error: 'LeetCode API is temporarily unavailable. Please try again later.' });
  }
};
