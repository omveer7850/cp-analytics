import { fetchAllCFData } from "../../services/codeforces";

export async function fetchCodeforcesComparable(username) {
  const data = await fetchAllCFData(username);

  const profile = data.profile;
  const ratingHistory = data.rating;

  return {
    username: profile.handle ?? username,
    platform: "Codeforces",

    avatar: profile.avatar ?? profile.titlePhoto ?? null,
    country: profile.country ?? null,

    profileUrl: `https://codeforces.com/profile/${username}`,

    displayRating: profile.rating ?? 0,
    displayRank: profile.rank ?? "N/A",

    ratingColor: "#4A90E2",

    metrics: {
      Rating: {
        value: profile.rating ?? 0,
        type: "number",
      },

      "Max Rating": {
        value: profile.maxRating ?? 0,
        type: "number",
      },

      Rank: {
        value: profile.rank ?? "N/A",
        type: "text",
      },

      "Max Rank": {
        value: profile.maxRank ?? "N/A",
        type: "text",
      },

      Contribution: {
        value: profile.contribution ?? 0,
        type: "number",
      },

      "Friend Of": {
        value: profile.friendOfCount ?? 0,
        type: "number",
      },

      Contests: {
        value: ratingHistory.length,
        type: "number",
      },
    },

    charts: {
      ratingHistory: ratingHistory.map((contest) => ({
        label: contest.contestName,
        rating: contest.newRating,
        date: new Date(
          contest.ratingUpdateTimeSeconds * 1000
        )
          .toISOString()
          .split("T")[0],
      })),
    },
  };
}