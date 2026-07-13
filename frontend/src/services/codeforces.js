const BASE_URL = 'https://codeforces.com/api';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fetchJson = async (url) => {
  const response = await fetch(url);

  // Codeforces sometimes answers rate-limited/blocked requests with a
  // non-JSON body (plain text or an HTML page). Checking status first
  // and guarding the parse avoids the "Unexpected token" crash and gives
  // a message that actually explains what happened.
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('429: Rate limited by Codeforces. Please wait a moment and try again.');
    }
    throw new Error(`HTTP ${response.status} from Codeforces API.`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Codeforces returned an unexpected (non-JSON) response.');
  }

  if (data.status !== 'OK') throw new Error(data.comment || 'API Error');
  return data.result;
};

export const fetchCFUser = (handle) =>
  fetchJson(`${BASE_URL}/user.info?handles=${handle}`);

export const fetchCFRating = (handle) =>
  fetchJson(`${BASE_URL}/user.rating?handle=${handle}`);

export const fetchCFStatus = (handle) =>
  fetchJson(`${BASE_URL}/user.status?handle=${handle}&from=1&count=1000`);

// Codeforces's own API policy allows at most ~1 request every 2 seconds
// per IP. The previous Promise.all fired all 3 calls in the same instant,
// which is exactly what was tripping the rate limiter. These now run
// sequentially with a stagger between them instead.
const SUB_CALL_STAGGER_MS = 700;

export const fetchAllCFData = async (handle) => {
  const profile = await fetchCFUser(handle);
  await delay(SUB_CALL_STAGGER_MS);

  const rating = await fetchCFRating(handle);
  await delay(SUB_CALL_STAGGER_MS);

  const status = await fetchCFStatus(handle);

  return {
    profile: profile[0],
    // Graph ke liye poora data chahiye, isliye rating waise hi rakha
    rating: rating,
    // Contest Table ke liye sirf last 20 recent contests (newest first)
    contest: rating.slice(-20).reverse(),
    status: status,
  };
};