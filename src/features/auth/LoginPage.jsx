import { useState } from 'react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useSubmit } from '../../hooks/useSubmit';
import { configured } from '../../lib/supabase';

export default function LoginPage() {
  const { signIn } = useAuth();
  const { busy, run } = useSubmit();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!configured) return;
    run(async () => {
      try {
        await signIn(email, password);
      } catch {
        throw new Error('Email atau kata sandi salah');
      }
    });
  };

  return (
    <div className="login">
      <form className="card" onSubmit={onSubmit}>
        <h2>📦 Inventory</h2>
        <small>Masuk untuk melanjutkan</small>
        {!configured && (
          <div className="cfg">Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env (atau di Environment Variables Vercel).</div>
        )}
        <label>Email</label>
        <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Kata sandi</label>
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button className="mt" type="submit" loading={busy} disabled={!configured}>
          Masuk
        </Button>
      </form>
    </div>
  );
}
