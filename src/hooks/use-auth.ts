import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const handleLogin = async (provider: string) => {
    const redirectTo = redirect('/map');

    if (provider === 'google') {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });
      return;
    }


    throw new Error('Unsupported provider');
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
    router.push('/');
  };

  return {
    user,
    handleLogin,
    handleLogout,
    loading,
  };
}