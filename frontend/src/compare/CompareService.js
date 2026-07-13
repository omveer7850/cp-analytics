import { fetchLeetCodeComparable } from "./adapters/leetcodeAdapter";
import { fetchCodeforcesComparable } from "./adapters/codeforcesAdapter";
import { fetchAtCoderComparable } from "./adapters/atcoderAdapter";
import { fetchGithubComparable } from "./adapters/githubAdapter";

const ADAPTERS = {
  LeetCode: fetchLeetCodeComparable,
  Codeforces: fetchCodeforcesComparable,
  AtCoder: fetchAtCoderComparable,
  GitHub: fetchGithubComparable,
};

export const PLATFORMS = [
  "LeetCode",
  "Codeforces",
  "AtCoder",
  "GitHub",
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


async function withRetry(fn, { retries = 3, baseDelay = 700 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt === retries) break;
      const wait = baseDelay * 2 ** attempt + Math.random() * 300;
      await delay(wait);
    }
  }
  throw lastErr;
}

function friendlyError(message) {
  const msg = message || "Failed";
  if (/429|too many requests/i.test(msg)) {
    return "Rate limited by the platform — please wait a moment and try again.";
  }
  if (/unexpected token|is not valid json|json/i.test(msg)) {
    return "The platform returned an unexpected response — please try again in a moment.";
  }
  return msg;
}


const STAGGER_MS = 400;

export async function compareUsers(platform, usernames) {
  const adapter = ADAPTERS[platform];

  if (!adapter) {
    throw new Error(`No adapter for ${platform}`);
  }

  const results = await Promise.allSettled(
    usernames.map((u, i) =>
      delay(i * STAGGER_MS).then(() => withRetry(() => adapter(u.trim())))
    )
  );

  return results.map((r, i) => {
    if (r.status === "fulfilled") {
      return {
        ok: true,
        data: r.value,
      };
    }

    return {
      ok: false,
      username: usernames[i],
      error: friendlyError(r.reason?.message),
    };
  });
}

export function getWinners(results) {
  const winners = {};

  const users = results
    .filter((r) => r.ok)
    .map((r) => r.data);

  if (users.length < 2) return winners;

  const allMetrics = [
    ...new Set(
      users.flatMap((u) => Object.keys(u.metrics ?? {}))
    ),
  ];

  allMetrics.forEach((metric) => {
    const defs = users
      .map((u) => u.metrics?.[metric])
      .filter(Boolean);

    if (!defs.length) return;

    if (defs[0].type === "text") return;

    const values = users
      .map((u) => {
        const raw = u.metrics?.[metric]?.value;

        if (raw === undefined || raw === null) return null;

        if (typeof raw === "string") {
          const n = parseFloat(raw);
          return isNaN(n) ? null : n;
        }

        return raw;
      })
      .filter((v) => v !== null);

    if (!values.length) return;

    const best = defs[0].lowerIsBetter
      ? Math.min(...values)
      : Math.max(...values);

    winners[metric] = best;
  });

  return winners;
}

export function generateInsights(results) {
  const users = results
    .filter((r) => r.ok)
    .map((r) => r.data);

  if (users.length < 2) return [];

  const insights = [];

  // Highest Rating
  const byRating = [...users].sort(
    (a, b) => (b.displayRating ?? 0) - (a.displayRating ?? 0)
  );

  if ((byRating[0].displayRating ?? 0) > (byRating[1].displayRating ?? 0)) {
    insights.push({
      icon: "⚡",
      text: `${byRating[0].username} has the highest rating (${byRating[0].displayRating})`,
    });
  }

  // Most Contests
  if (users[0].metrics["Contests"]) {
    const byContest = [...users].sort(
      (a, b) =>
        (b.metrics["Contests"]?.value ?? 0) -
        (a.metrics["Contests"]?.value ?? 0)
    );

    insights.push({
      icon: "🏆",
      text: `${byContest[0].username} has participated in the most contests (${byContest[0].metrics["Contests"].value})`,
    });
  }

  // Most Solved
  if (users[0].metrics["Solved"]) {
    const bySolved = [...users].sort(
      (a, b) =>
        (b.metrics["Solved"]?.value ?? 0) -
        (a.metrics["Solved"]?.value ?? 0)
    );

    insights.push({
      icon: "💡",
      text: `${bySolved[0].username} has solved the most problems (${bySolved[0].metrics["Solved"].value})`,
    });
  }

  // Most Hard
  if (users[0].metrics["Hard"]) {
    const byHard = [...users].sort(
      (a, b) =>
        (b.metrics["Hard"]?.value ?? 0) -
        (a.metrics["Hard"]?.value ?? 0)
    );

    insights.push({
      icon: "🔥",
      text: `${byHard[0].username} has solved the most Hard problems (${byHard[0].metrics["Hard"].value})`,
    });
  }

  // Acceptance
  if (users[0].metrics["Acceptance"]) {
    const byAcc = [...users].sort(
      (a, b) =>
        (parseFloat(b.metrics["Acceptance"]?.value) || 0) -
        (parseFloat(a.metrics["Acceptance"]?.value) || 0)
    );

    insights.push({
      icon: "✅",
      text: `${byAcc[0].username} has the highest acceptance (${byAcc[0].metrics["Acceptance"].value})`,
    });
  }

  // Contribution
  if (users[0].metrics["Contribution"]) {
    const byContribution = [...users].sort(
      (a, b) =>
        (b.metrics["Contribution"]?.value ?? 0) -
        (a.metrics["Contribution"]?.value ?? 0)
    );

    if ((byContribution[0].metrics["Contribution"]?.value ?? 0) > 0) {
      insights.push({
        icon: "🌟",
        text: `${byContribution[0].username} has the highest contribution (${byContribution[0].metrics["Contribution"].value})`,
      });
    }
  }

  // Followers
  if (users[0].metrics["Followers"]) {
    const byFollowers = [...users].sort(
      (a, b) =>
        (b.metrics["Followers"]?.value ?? 0) -
        (a.metrics["Followers"]?.value ?? 0)
    );

    insights.push({
      icon: "👥",
      text: `${byFollowers[0].username} has the most followers (${byFollowers[0].metrics["Followers"].value})`,
    });
  }

  return insights.slice(0, 8);
}