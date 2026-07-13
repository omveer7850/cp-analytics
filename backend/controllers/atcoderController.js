const {
  fetchUserInfo,
  fetchUserContestList,
} = require("@qatadaazzeh/atcoder-api");

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await fetchUserInfo(username);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Calculate ratings from contest history
    if (
      Array.isArray(user.userContests) &&
      user.userContests.length > 0
    ) {
      const ratings = user.userContests
        .map((c) => c.userNewRating)
        .filter((r) => typeof r === "number");

      if (ratings.length > 0) {
        user.userRating = ratings[ratings.length - 1];
        user.userMaxRating = Math.max(...ratings);
      }
    }

    res.json(user);
  } catch (err) {
    console.error("Profile Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { username } = req.params;

    const contests = await fetchUserContestList(username);

    res.json(contests);
  } catch (err) {
    console.error("History Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    // We'll implement submissions later
    res.json([]);
  } catch (err) {
    console.error("Submission Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};