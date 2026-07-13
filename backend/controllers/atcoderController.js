const axios = require('axios');
const cheerio = require('cheerio');

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const profileResponse = await axios.get(`https://atcoder.jp/users/${username}`, {
      headers,
      timeout: 10000,
    });
    const html = profileResponse.data;
    const $ = cheerio.load(html);

    const container = $("#main-container .row").first();
    const userNameElement = container.find(".col-md-3.col-sm-12 h3 .username span").first().text().trim();
    const userName = userNameElement || container.find(".col-md-3.col-sm-12 h3 .username").text().trim() || username;

    if (!userName) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentRank = container.find(".col-md-3.col-sm-12 h3 b").text().trim();
    const userAvatar = container.find(".col-md-3.col-sm-12 .avatar").attr("src")?.trim() || "";

    let userRank = 0;
    let userRating = 0;
    let userMaxRating = 0;
    let userContestCount = 0;
    let userLastCompeted = 'N/A';

    container.find(".col-md-9.col-sm-12 .dl-table tbody tr").each((_, tr) => {
      const th = $(tr).find("th").text().trim();
      const td = $(tr).find("td").text().trim();

      if (th.includes("Rank")) {
        userRank = Number(td.replace(/[^\d]/g, "")) || 0;
      } else if (th.includes("Rating")) {
        userRating = Number($(tr).find("td span").first().text().trim()) || 0;
      } else if (th.includes("Highest Rating")) {
        userMaxRating = Number($(tr).find("td span").first().text().trim()) || 0;
      } else if (th.includes("Rated Matches")) {
        userContestCount = Number(td) || 0;
      } else if (th.includes("Last Competed")) {
        userLastCompeted = td;
      }
    });

    let userContests = [];
    try {
      const historyResponse = await axios.get(`https://atcoder.jp/users/${username}/history/json`, {
        headers,
        timeout: 10000,
      });
      const historyData = historyResponse.data || [];
      userContests = historyData.map((item) => ({
        userRank: item.Place,
        userOldRating: item.OldRating,
        userNewRating: item.NewRating,
        userRatingChange: item.NewRating - item.OldRating,
        contestName: item.ContestName,
        userPerformance: item.Performance,
        contestEndTime: item.EndTime,
        isRated: item.IsRated,
        contestId: item.ContestScreenName,
      }));
    } catch (e) {
      userContests = [];
    }

    res.json({
      userName,
      currentRank,
      userAvatar,
      userRank,
      userRating,
      userMaxRating,
      userLastCompeted,
      userContestCount,
      userContests,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { username } = req.params;

    const historyResponse = await axios.get(`https://atcoder.jp/users/${username}/history/json`, {
      headers,
      timeout: 10000,
    });
    const historyData = historyResponse.data || [];
    const contests = historyData.map((item) => ({
      userRank: item.Place,
      userOldRating: item.OldRating,
      userNewRating: item.NewRating,
      userRatingChange: item.NewRating - item.OldRating,
      contestName: item.ContestName,
      userPerformance: item.Performance,
      contestEndTime: item.EndTime,
      isRated: item.IsRated,
      contestId: item.ContestScreenName,
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
    const response = await axios.get(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const list = response.data || [];
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};