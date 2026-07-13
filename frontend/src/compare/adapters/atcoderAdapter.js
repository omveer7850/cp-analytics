import {
  fetchAtCoderProfile,
  fetchAtCoderHistory,
  fetchAtCoderSubmissions,
  getRankInfo,
} from "../../services/atcoder";
import { delay } from "./_delay";

const SUB_CALL_STAGGER_MS = 300;

export async function fetchAtCoderComparable(username) {
  
  const profile = await fetchAtCoderProfile(username);
  await delay(SUB_CALL_STAGGER_MS);

  const history = await fetchAtCoderHistory(username);
  await delay(SUB_CALL_STAGGER_MS);

  const submissions = await fetchAtCoderSubmissions(username);

  const rankInfo = getRankInfo(profile.rating);

  return {
    username: profile.username,
    platform: "AtCoder",

    avatar: profile.avatar ?? null,
    country: null,

    profileUrl: profile.profileUrl,

    displayRating: profile.rating,
    displayRank: profile.rank,
    ratingColor: rankInfo.color,

    metrics: {
      Rating: {
        value: profile.rating,
        type: "number",
      },

      "Highest Rating": {
        value: profile.highestRating,
        type: "number",
      },

      Rank: {
        value: profile.rank,
        type: "text",
      },

      Contests: {
        value: profile.contestCount,
        type: "number",
      },

      "Accepted Submissions": {
        value: submissions.stats.AC ?? 0,
        type: "number",
      },
    },

    charts: {
      ratingHistory: history.map((h) => ({
        label: h.contestName,
        rating: h.newRating,
        date: h.date,
      })),
    },
  };
}