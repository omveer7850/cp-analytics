const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const PROXY = `${API_BASE}/api/leetcode/profile`;

async function apiGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchLeetCodeProfile(username) {
  const data = await apiGet(`${PROXY}/${username}`);
  return data.profile;
}

export async function fetchLeetCodeSolved(username) {
  const data = await apiGet(`${PROXY}/${username}`);
  return data.solved;
}

export async function fetchLeetCodeContestHistory(username) {
  const data = await apiGet(`${PROXY}/${username}`);
  return data.contest;
}

export async function fetchLeetCodeCalendar(username) {
  const data = await apiGet(`${PROXY}/${username}`);
  return data.calendar;
}

export async function fetchRecentSubmissions(username) {
  const data = await apiGet(`${PROXY}/${username}`);
  return data.recent;
}