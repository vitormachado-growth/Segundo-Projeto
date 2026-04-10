'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuth = async () => {
      // O Supabase lida automaticamente com a troca do código pelo token nos cookies
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.error('AuthController Error:', error);
        router.push('/login?error=auth_failed');
      } else {
        router.push('/dashboard');
      }
    };

    handleAuth();
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-6">
      <div className="text-center max-w-md w-full glass-panel p-8">
        <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-green-500 border-opacity-30 border-t-green-500 border-solid"></div>
        </div>
        <h2 className="text-2xl font-bold mb-2 heading-display">AUTENTICANDO...</h2>
        <p className="text-gray-400">Só um momento, estamos preparando o seu acesso!</p>
      </div>
    </div>
  );
}
