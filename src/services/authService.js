import { supabase } from '../lib/supabase';

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

/** Mengembalikan fungsi untuk berhenti mendengarkan. */
export function onChange(cb) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
}
