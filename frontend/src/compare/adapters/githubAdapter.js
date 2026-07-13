import { fetchGithubProfile } from '../../services/github';

export async function fetchGithubComparable(username) {
  const data = await fetchGithubProfile(username);

  return {
    username:      data.login        ?? username,
    platform:      'GitHub',
    avatar:        data.avatar_url   ?? null,
    country:       data.location     ?? null,
    profileUrl:    `https://github.com/${username}`,
    displayRating: data.followers    ?? 0,
    displayRank:   data.public_repos ? `${data.public_repos} repos` : 'N/A',
    ratingColor:   '#24292e',
    metrics: {
      'Followers':    { value: data.followers    ?? 0, type: 'number' },
      'Following':    { value: data.following    ?? 0, type: 'number' },
      'Public Repos': { value: data.public_repos ?? 0, type: 'number' },
      'Gists':        { value: data.public_gists ?? 0, type: 'number' },
    },
    charts: { ratingHistory: [] },
  };
}