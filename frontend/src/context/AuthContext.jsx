import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { upsertProfile, logActivity } from '../services/supabaseService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        if (!sessionStorage.getItem('logged_app_load')) {
          logActivity(session.user.id, 'app_load', { context: 'get_session' });
          sessionStorage.setItem('logged_app_load', 'true');
        }
      }
      setLoading(false);
    });

   
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        upsertProfile(session.user);
        if (_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION') {
          if (!sessionStorage.getItem('logged_app_load')) {
            logActivity(session.user.id, 'app_load', { event: _event });
            sessionStorage.setItem('logged_app_load', 'true');
          }
        }
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  
  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });

  const signInWithGithub = () =>
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });

  const logout = () => supabase.auth.signOut();

  const value = { user, loading, signInWithGoogle, signInWithGithub, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}