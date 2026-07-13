import { sheetData } from '../data/sheetData';
import { getSheetProgress as getRemoteSheetProgress } from '../services/supabaseService';

export const SHEET_LIST = [
  { id: 'grind169', label: 'Grind 169' },
  { id: 'striverA2Z', label: "Striver's A2Z" },
  { id: 'blind75', label: 'Blind 75' },
  { id: 'neetcode150', label: 'NeetCode 150' },
];

function sheetTotal(sheetId) {
  const sheet = sheetData[sheetId];
  if (!sheet) return 0;
  return sheet.chunks.reduce((sum, c) => sum + c.problems.length, 0);
}

function sheetProblems(sheetId) {
  const sheet = sheetData[sheetId];
  if (!sheet) return [];
  return sheet.chunks.flatMap((c) => c.problems);
}

export async function getSheetProgress(uid, sheetId) {
  const total = sheetTotal(sheetId);
  const { solved: solvedIds } = await getRemoteSheetProgress(uid, sheetId);
  const solved = solvedIds.length;
  const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
  return { total, solved, percent };
}

export async function getAllSheetsProgress(uid) {
  return Promise.all(
    SHEET_LIST.map(async (s) => ({ ...s, ...(await getSheetProgress(uid, s.id)) }))
  );
}

export async function getOverallProgress(uid) {
  const all = await getAllSheetsProgress(uid);
  const total = all.reduce((sum, s) => sum + s.total, 0);
  const solved = all.reduce((sum, s) => sum + s.solved, 0);
  const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
  return { total, solved, percent };
}

/**
 * Easy/Medium/Hard solved+total, either for one sheet (sheetId = its id)
 * or aggregated across every tracked sheet (sheetId = 'all').
 */
export async function getDifficultyStats(uid, sheetId) {
  const stats = {
    Easy: { solved: 0, total: 0 },
    Medium: { solved: 0, total: 0 },
    Hard: { solved: 0, total: 0 },
  };

  const ids = sheetId === 'all' ? SHEET_LIST.map((s) => s.id) : [sheetId];

  await Promise.all(
    ids.map(async (id) => {
      const problems = sheetProblems(id);
      const { solved: solvedIds } = await getRemoteSheetProgress(uid, id);
      problems.forEach((p) => {
        const d = p.difficulty;
        if (!stats[d]) stats[d] = { solved: 0, total: 0 };
        stats[d].total += 1;
        if (solvedIds.includes(p.id)) stats[d].solved += 1;
      });
    })
  );

  return stats;
}

export function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// NOTE: getRecentSheetActivity was removed — it depended on per-problem
// solved timestamps that were stored in localStorage (`solved-time-*`).
// Now that progress lives in Supabase's `sheet_progress` table (which only
// stores the solved/revisit id arrays, not per-problem timestamps), that
// data no longer exists. The Dashboard's "Recent Activity" section was
// already removed earlier, so nothing currently calls this — if you want
// it back, `sheet_progress` would need a per-problem timestamp column
// (or a separate `activity` table) to rebuild it honestly.