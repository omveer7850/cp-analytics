const axios = require('axios');

const BASE = 'https://api.github.com';
const HEADERS = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'CP-Analytics/1.0',
};

exports.getProfile = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${BASE}/users/${req.params.username}`,
      { headers: HEADERS, timeout: 10000 }
    );
    res.json(data);
  } catch (e) {
    res.status(e.response?.status ?? 500).json({ error: e.message });
  }
};

exports.getRepos = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${BASE}/users/${req.params.username}/repos?per_page=100&sort=updated`,
      { headers: HEADERS, timeout: 10000 }
    );
    res.json(data);
  } catch (e) {
    res.status(e.response?.status ?? 500).json({ error: e.message });
  }
};

exports.getOrgs = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${BASE}/users/${req.params.username}/orgs`,
      { headers: HEADERS, timeout: 10000 }
    );
    res.json(data);
  } catch (e) {
    res.status(e.response?.status ?? 500).json({ error: e.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${BASE}/users/${req.params.username}/events/public?per_page=30`,
      { headers: HEADERS, timeout: 10000 }
    );
    res.json(data);
  } catch (e) {
    res.status(e.response?.status ?? 500).json({ error: e.message });
  }
};