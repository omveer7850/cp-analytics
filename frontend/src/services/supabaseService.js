import { supabase } from '../lib/supabase';
export async function upsertProfile(user) {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      display_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      email: user.email || '',
      photo_url: user.user_metadata?.avatar_url || '',
    },
    { onConflict: 'id', ignoreDuplicates: false }
  );
  if (error) console.error('upsertProfile error:', error.message);
}

export async function getUserDoc(uid) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
  if (error) return null;
  return data;
}

export async function updateProfile(uid, fields) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: uid, ...fields }, { onConflict: 'id' });
  if (error) throw error;
}



const PLATFORM_KEYS = ['leetcode', 'codeforces', 'github', 'codechef', 'atcoder'];

export async function getPlatforms(uid) {
  const { data, error } = await supabase.from('platforms').select('*').eq('user_id', uid);
  if (error || !data) return {};

  const result = {};
  data.forEach((row) => {
    result[row.platform] = {
      username: row.username,
      data: row.data,
      lastSyncedAt: row.last_synced_at,
    };
  });
  return result;
}

export async function savePlatformUsername(uid, platform, username) {
  if (!PLATFORM_KEYS.includes(platform)) {
    throw new Error(`Unknown platform: ${platform}`);
  }
  const { error } = await supabase.from('platforms').upsert(
    { user_id: uid, platform, username, connected_at: new Date().toISOString() },
    { onConflict: 'user_id,platform' }
  );
  if (error) throw error;
}

export async function savePlatformData(uid, platform, data) {
  const { error } = await supabase
    .from('platforms')
    .update({ data, last_synced_at: new Date().toISOString() })
    .eq('user_id', uid)
    .eq('platform', platform);
  if (error) throw error;
}



export async function getSheetProgress(uid, sheetId) {
  const { data, error } = await supabase
    .from('sheet_progress')
    .select('solved, revisit')
    .eq('user_id', uid)
    .eq('sheet_id', sheetId)
    .maybeSingle();

  if (error || !data) return { solved: [], revisit: [] };
  return { solved: data.solved || [], revisit: data.revisit || [] };
}

export async function saveSheetProgress(uid, sheetId, { solved, revisit }) {
  const { error } = await supabase.from('sheet_progress').upsert(
    {
      user_id: uid,
      sheet_id: sheetId,
      solved,
      revisit,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,sheet_id' }
  );
  if (error) throw error;
}



const SHEET_IDS = ['grind169', 'striverA2Z', 'blind75', 'neetcode150'];

export async function resetSheetProgress(uid, sheetId) {
  return saveSheetProgress(uid, sheetId, { solved: [], revisit: [] });
}

export async function resetAllSheetsProgress(uid) {
  await Promise.all(SHEET_IDS.map((id) => resetSheetProgress(uid, id)));
}

export async function disconnectPlatform(uid, platform) {
  const { error } = await supabase.from('platforms').delete().eq('user_id', uid).eq('platform', platform);
  if (error) throw error;
}

export async function disconnectAllPlatforms(uid) {
  const { error } = await supabase.from('platforms').delete().eq('user_id', uid);
  if (error) throw error;
}


export async function clearAllAppData(uid) {
  await disconnectAllPlatforms(uid);
  await resetAllSheetsProgress(uid);
  await updateProfile(uid, { university: '', bio: '', linkedin: '' });
}