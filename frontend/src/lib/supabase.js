import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = 'https://pmjlwuanrcoekvlimjrr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QVqSh4QKj1IlObshJkEQ-g_qWBDlROZ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);