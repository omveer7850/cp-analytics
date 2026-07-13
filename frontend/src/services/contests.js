import axios from 'axios';
const hoursFromNow = (h) => new Date(Date.now() + h * 60 * 60 * 1000);

const fallbackContests = [
  { id: 'lc-fallback-1', platform: 'LeetCode', title: 'Weekly Contest', startTime: hoursFromNow(18), duration: 90, url: 'https://leetcode.com/contest/' },
  { id: 'lc-fallback-2', platform: 'LeetCode', title: 'Biweekly Contest', startTime: hoursFromNow(66), duration: 90, url: 'https://leetcode.com/contest/' },
  { id: 'cf-fallback-1', platform: 'Codeforces', title: 'Codeforces Round (Div. 2)', startTime: hoursFromNow(30), duration: 135, url: 'https://codeforces.com/contests' },
  { id: 'cf-fallback-2', platform: 'Codeforces', title: 'Educational Codeforces Round', startTime: hoursFromNow(90), duration: 120, url: 'https://codeforces.com/contests' },
  { id: 'cc-fallback-1', platform: 'CodeChef', title: 'CodeChef Starters', startTime: hoursFromNow(48), duration: 180, url: 'https://www.codechef.com/contests' },
  { id: 'ac-fallback-1', platform: 'AtCoder', title: 'AtCoder Beginner Contest', startTime: hoursFromNow(24), duration: 100, url: 'https://atcoder.jp/contests' },
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const PROXY = `${API_BASE}/api/contests`;

function withEndTime(contests) {
  return contests
    .map((c) => ({
      ...c,
      startTime: new Date(c.startTime),
      endTime: new Date(new Date(c.startTime).getTime() + c.duration * 60000),
    }))
    .filter((c) => c.endTime.getTime() > Date.now())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
}

export async function fetchAllContests() {
  try {
    const response = await axios.get(`${PROXY}/all`, { timeout: 20000 });
    const { source, contests, error, partialFailures } = response.data;

    if (error || !Array.isArray(contests) || contests.length === 0) {
      throw new Error(error || 'Empty response from backend');
    }

    if (source === 'stale-cache') {
      console.warn('Contests: all live sources are down, serving last known-good cache from backend.');
    }
    if (partialFailures?.length) {
      console.warn('Some contest sources failed this round:', partialFailures);
    }

    return withEndTime(contests);
  } catch (error) {
   
    console.warn('Backend unavailable, using static fallback list:', error.message);
    return withEndTime(fallbackContests);
  }
}

export const PLATFORM_CONFIG = {
  LeetCode:   { color: '#f89a1c', bg: '#fff8ee', border: '#fde3a7' },
  Codeforces: { color: '#4a90d9', bg: '#eef5fc', border: '#b8d4f0' },
  CodeChef:   { color: '#5b4638', bg: '#f5f0ee', border: '#d4bfb8' },
  AtCoder:    { color: '#e53935', bg: '#fef0f0', border: '#f5b8b8' },
};