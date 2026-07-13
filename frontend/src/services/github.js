// Points at your Express backend's GitHub proxy. Locally this reads
// VITE_API_URL=http://localhost:5001 from frontend/.env; in
// production (Vercel) it's set to your deployed Render URL instead —
// no code change needed between environments.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const BASE = `${API_BASE}/api/github`;

async function apiGet(url) {
  const res = await fetch(url);
  if (res.status === 404) throw new Error('User not found');
  if (res.status === 403) throw new Error('API rate limit exceeded. Try again later.');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchGithubProfile(username) {
  return apiGet(`${BASE}/profile/${username}`);
}

export async function fetchGithubRepositories(username) {
  const data = await apiGet(`${BASE}/repos/${username}`);
  return Array.isArray(data) ? data : [];
}

export async function fetchGithubOrganizations(username) {
  try {
    const data = await apiGet(`${BASE}/orgs/${username}`);
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function fetchGithubEvents(username) {
  try {
    const data = await apiGet(`${BASE}/events/${username}`);
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function fetchGithubLanguages(repos) {
  const langMap = {};
  repos.forEach((repo) => {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] ?? 0) + 1;
    }
  });
  const total = Object.values(langMap).reduce((a, b) => a + b, 0);
  return Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({
      language:   lang,
      count,
      percentage: ((count / total) * 100).toFixed(1),
    }));
}

export async function fetchAllGithubData(username) {
  const [profile, repos, orgs, events] = await Promise.all([
    fetchGithubProfile(username),
    fetchGithubRepositories(username),
    fetchGithubOrganizations(username),
    fetchGithubEvents(username),
  ]);

  const languages   = await fetchGithubLanguages(repos);
  const totalStars  = repos.reduce((a, r) => a + (r.stargazers_count ?? 0), 0);
  const totalForks  = repos.reduce((a, r) => a + (r.forks_count      ?? 0), 0);
  const totalWatch  = repos.reduce((a, r) => a + (r.watchers_count   ?? 0), 0);
  const accountAge  = profile.created_at
    ? Math.floor((Date.now() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24 * 365))
    : 'N/A';
  const mostUsedLang = languages[0]?.language ?? 'N/A';

  return {
    profile, repos, orgs, events, languages,
    stats: { totalStars, totalForks, totalWatch, accountAge, mostUsedLang },
  };
}

export const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python:  '#3572A5',
  Java:       '#b07219', 'C++':      '#f34b7d', C:       '#555555',
  'C#':       '#178600', Go:         '#00ADD8', Rust:    '#dea584',
  Ruby:       '#701516', PHP:        '#4F5D95', Swift:   '#F05138',
  Kotlin:     '#A97BFF', Dart:       '#00B4AB', Shell:   '#89e051',
  HTML:       '#e34c26', CSS:        '#563d7c', Vue:     '#41b883',
  Default:    '#8b949e',
};

export function getLangColor(lang) {
  return LANG_COLORS[lang] ?? LANG_COLORS.Default;
}

export function timeAgo(dateStr) {
  if (!dateStr) return 'N/A';
  const diff = Date.now() - new Date(dateStr);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (d > 30) return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return 'just now';
}