const axios = require('axios');

async function getClistAccount(username, clistUser, clistKey) {
  const candidates = [
    username,
    username.charAt(0).toUpperCase() + username.slice(1).toLowerCase(),
    username.toLowerCase(),
    username.toUpperCase()
  ];
  const uniqueCandidates = [...new Set(candidates)];

  for (const cand of uniqueCandidates) {
    try {
      const res = await axios.get(`https://clist.by/api/v4/account/`, {
        params: {
          username: clistUser,
          api_key: clistKey,
          resource: 'atcoder.jp',
          handle: cand
        },
        timeout: 8000
      });
      const objects = res.data?.objects || [];
      if (objects.length > 0) {
        return objects[0];
      }
    } catch (e) {
    }
  }
  return null;
}

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const clistUser = process.env.CLIST_USERNAME || 'omveer_01';
    const clistKey = process.env.CLIST_API_KEY || '9942249332432efd464da19d58a0ae52eede4d1d';

    const account = await getClistAccount(username, clistUser, clistKey);
    if (!account) {
      return res.status(404).json({ error: "User not found" });
    }

    const accountId = account.id;
    const statsRes = await axios.get(`https://clist.by/api/v4/statistics/`, {
      params: {
        username: clistUser,
        api_key: clistKey,
        account_id: accountId
      },
      timeout: 10000
    });

    const stats = statsRes.data?.objects || [];
    let maxRating = account.rating || 0;
    const userContests = [];

    stats.forEach((item) => {
      if (item.new_rating) {
        maxRating = Math.max(maxRating, item.new_rating);
      }
      userContests.push({
        userRank: item.place || 0,
        userOldRating: item.old_rating || 0,
        userNewRating: item.new_rating || 0,
        userRatingChange: (item.new_rating && item.old_rating) ? (item.new_rating - item.old_rating) : 0,
        contestName: item.event || 'N/A',
        userPerformance: 0,
        contestEndTime: item.date,
        isRated: !!item.new_rating,
        contestId: String(item.contest_id)
      });
    });

    res.json({
      userName: account.name || username,
      currentRank: account.resource_rank ? String(account.resource_rank) : "Unrated",
      userAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${account.name || username}`,
      userRank: account.resource_rank || 0,
      userRating: account.rating || 0,
      userMaxRating: maxRating,
      userLastCompeted: account.last_activity ? account.last_activity.split('T')[0] : 'N/A',
      userContestCount: account.n_contests || 0,
      userContests: userContests
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { username } = req.params;
    const clistUser = process.env.CLIST_USERNAME || 'omveer_01';
    const clistKey = process.env.CLIST_API_KEY || '9942249332432efd464da19d58a0ae52eede4d1d';

    const account = await getClistAccount(username, clistUser, clistKey);
    if (!account) {
      return res.json([]);
    }

    const statsRes = await axios.get(`https://clist.by/api/v4/statistics/`, {
      params: {
        username: clistUser,
        api_key: clistKey,
        account_id: account.id
      },
      timeout: 10000
    });

    const stats = statsRes.data?.objects || [];
    const contests = stats.map((item) => ({
      contestSlug: String(item.contest_id),
      contestName: item.event || 'N/A',
      contestType: item.new_rating ? 'Rated' : 'Unrated',
      rank: item.place || 'N/A',
      performance: 0,
      oldRating: item.old_rating || 0,
      newRating: item.new_rating || 0,
      change: (item.new_rating && item.old_rating) ? (item.new_rating - item.old_rating) : 0,
      date: item.date ? item.date.split('T')[0] : 'N/A',
      url: `https://atcoder.jp/contests/`
    }));

    res.json(contests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const { username } = req.params;
    const response = await axios.get(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${username}&from_second=0`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 15000
    });

    res.json(response.data || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};