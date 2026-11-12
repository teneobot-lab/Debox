import { createContext, useContext, useEffect, useState } from 'react';
import { configured } from '../lib/supabase';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;
    let alive = true;
    authService.getSession().then((s) => {
      if (alive) {
        setSession(s);
        setLoading(false);
      }
    });
    const stop = authService.onChange((s) => alive && setSession(s));
    return () => {
      alive = false;
      stop();
    };
  }, []);

  const value = { session, loading, signIn: authService.signIn, signOut: authService.signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
