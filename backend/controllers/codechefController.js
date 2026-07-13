const axios = require('axios');

exports.getProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const { data: html } = await axios.get(
      `https://www.codechef.com/users/${username}`,
      {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      }
    );

    const match = (regex) => {
      const m = html.match(regex);
      return m ? m[1].trim() : null;
    };

    const rating      = match(/<div class="rating-number">\s*([\d?]+)/);
    const stars       = match(/<span class="rating"[^>]*>([★?]+)/);
    const fullName    = match(/<h1 class="h2-style"[^>]*>([^<]+)<\/h1>/) ?? match(/<header[^>]*>[\s\S]*?<h2>([^<]+)<\/h2>/);
    const country     = match(/<span class="user-country-name">([^<]+)/);
    const institution = match(/<span class="user-institution-name">([^<]+)/);
    const avatar       = match(/<img[^>]*class="user-details-container"[^>]*src="([^"]+)"/) ?? match(/<img[^>]*class="profileImage"[^>]*src="([^"]+)"/);

    const globalRankMatch  = html.match(/Global Rank<\/header>\s*<div[^>]*>\s*([\d,]+)/);
    const countryRankMatch = html.match(/Country Rank<\/header>\s*<div[^>]*>\s*([\d,]+)/);
    const highestRatingMatch = html.match(/Highest Rating\s*([\d]+)/);

    const ratingDataMatch = html.match(/var\s+all_rating\s*=\s*(\[[\s\S]*?\]);/);
    let ratingData = [];
    if (ratingDataMatch) {
      try {
        ratingData = JSON.parse(ratingDataMatch[1]);
      } catch (e) {
        ratingData = [];
      }
    }

    if (!rating || rating === '?') {
      return res.status(404).json({ error: 'User not found or unrated' });
    }

    res.json({
      username,
      name: fullName,
      profile: avatar,
      country,
      organization: institution,
      currentRating: parseInt(rating) || 0,
      highestRating: highestRatingMatch ? parseInt(highestRatingMatch[1]) : (parseInt(rating) || 0),
      stars,
      globalRank: globalRankMatch ? globalRankMatch[1].replace(/,/g, '') : 'N/A',
      countryRank: countryRankMatch ? countryRankMatch[1].replace(/,/g, '') : 'N/A',
      ratingData,
    });

  } catch (e) {
    console.error('CodeChef scrape failed:', e.message);
    if (e.response?.status === 404) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(503).json({ error: 'CodeChef data is temporarily unavailable. Please try again later.' });
  }
};