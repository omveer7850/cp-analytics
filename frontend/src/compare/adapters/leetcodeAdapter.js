import {
  fetchLeetCodeProfile,
  fetchLeetCodeSolved,
  fetchLeetCodeContestHistory,
} from "../../services/leetcode";
import { delay } from "./_delay";

const SUB_CALL_STAGGER_MS = 300;

export async function fetchLeetCodeComparable(username) {
  
  const profile = await fetchLeetCodeProfile(username);
  await delay(SUB_CALL_STAGGER_MS);

  const solved = await fetchLeetCodeSolved(username);
  await delay(SUB_CALL_STAGGER_MS);

  const contest = await fetchLeetCodeContestHistory(username).catch(() => ({
    rating: 0,
    globalRank: "N/A",
    totalContests: 0,
    history: [],
  }));

  return {
    username: profile.username,
    platform: "LeetCode",

    avatar: profile.avatar,
    country: profile.country,

    profileUrl: `https://leetcode.com/u/${profile.username}`,

    displayRating: contest.rating ?? 0,
    displayRank: profile.ranking ?? "N/A",

    ratingColor: "#FFA116",

    metrics: {
      "Contest Rating": {
        value: contest.rating ?? 0,
        type: "number",
      },

      "Global Rank": {
        value: profile.globalRank ?? profile.ranking ?? "N/A",
        type: "number",
        lowerIsBetter: true,
      },

      "Solved": {
        value: solved.totalSolved ?? 0,
        type: "number",
      },

      "Easy": {
        value: solved.easySolved ?? 0,
        type: "number",
      },

      "Medium": {
        value: solved.mediumSolved ?? 0,
        type: "number",
      },

      "Hard": {
        value: solved.hardSolved ?? 0,
        type: "number",
      },

      "Acceptance": {
        value: solved.acceptanceRate ?? "N/A",
        type: "percent",
      },

      "Active Days": {
        value: solved.activeDays ?? "N/A",
        type: "number",
      },

      "Contests": {
        value: contest.totalContests ?? 0,
        type: "number",
      },
    },

    charts: {
      ratingHistory: contest.history.map((h) => ({
        label: h.contest,
        rating: h.rating,
        date: h.date,
      })),
    },
  };
}