const express = require('express');
const router = express.Router();

const FETCH_TIMEOUT_MS = 10000;
const CACHE_TTL_MS = 5 * 60 * 1000;

let cache = { data: null, fetchedAt: 0 };

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}


async function fetchCodeforces() {
  const data = await fetchJson('https://codeforces.com/api/contest.list?gym=false');
  if (data.status !== 'OK') throw new Error('Codeforces API returned non-OK status');

  return data.result
    .filter((c) => c.phase === 'BEFORE' || c.phase === 'CODING')
    .map((c) => ({
      id: `cf-${c.id}`,
      platform: 'Codeforces',
      title: c.name,
      startTime: new Date(c.startTimeSeconds * 1000).toISOString(),
      duration: c.durationSeconds / 60,
      url: `https://codeforces.com/contest/${c.id}`,
    }));
}


async function fetchAtCoder() {
  const data = await fetchJson('https://kenkoooo.com/atcoder/resources/contests.json');
  const now = Date.now();

  return data
    .filter((c) => (c.start_epoch_second + c.duration_second) * 1000 > now)
    .map((c) => ({
      id: `ac-${c.id}`,
      platform: 'AtCoder',
      title: c.title,
      startTime: new Date(c.start_epoch_second * 1000).toISOString(),
      duration: c.duration_second / 60,
      url: `https://atcoder.jp/contests/${c.id}`,
    }));
}


async function fetchCodeChef() {
  const data = await fetchJson('https://www.codechef.com/api/list/contests/all');
  const lists = [...(data.future_contests || []), ...(data.present_contests || [])];

  return lists.map((c) => ({
    id: `cc-${c.contest_code}`,
    platform: 'CodeChef',
    title: c.contest_name,
    startTime: new Date(c.contest_start_date_iso || c.contest_start_date).toISOString(),
    duration: Number(c.contest_duration) || 120,
    url: `https://www.codechef.com/${c.contest_code}`,
  }));
}


async function fetchLeetCode() {
  const query = `
    query {
      allContests {
        title
        titleSlug
        startTime
        duration
      }
    }
  `;
  const data = await fetchJson('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const contests = data?.data?.allContests || [];
  const now = Date.now() / 1000;

  return contests
    .filter((c) => c.startTime + c.duration > now)
    .map((c) => ({
      id: `lc-${c.titleSlug}`,
      platform: 'LeetCode',
      title: c.title,
      startTime: new Date(c.startTime * 1000).toISOString(),
      duration: c.duration / 60,
      url: `https://leetcode.com/contest/${c.titleSlug}`,
    }));
}

async function fetchAllSources() {
  const results = await Promise.allSettled([
    fetchCodeforces(),
    fetchAtCoder(),
    fetchCodeChef(),
    fetchLeetCode(),
  ]);

  const labels = ['Codeforces', 'AtCoder', 'CodeChef', 'LeetCode'];
  let combined = [];
  const failures = [];

  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      combined = combined.concat(r.value);
    } else {
      failures.push({ source: labels[i], error: r.reason?.message });
      console.warn(`Contest source failed (${labels[i]}):`, r.reason?.message);
    }
  });

  if (combined.length === 0) throw new Error('All contest sources failed');

  combined.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  return { contests: combined, failures };
}

router.get('/all', async (req, res) => {
  const isFresh = cache.data && Date.now() - cache.fetchedAt < CACHE_TTL_MS;

  if (isFresh) {
    return res.json({ source: 'cache', contests: cache.data });
  }

  try {
    const { contests, failures } = await fetchAllSources();
    cache = { data: contests, fetchedAt: Date.now() };
    return res.json({ source: 'live', contests, partialFailures: failures });
  } catch (err) {
    console.error('All contest sources failed:', err.message);

    if (cache.data) {
      return res.json({ source: 'stale-cache', contests: cache.data, staleSince: cache.fetchedAt });
    }

    return res.status(503).json({ error: 'Contest sources temporarily unavailable', contests: [] });
  }
});

module.exports = router;