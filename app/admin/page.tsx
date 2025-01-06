'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      // Check if admin is already logged in
      const adminId = localStorage.getItem('adminId');
      const adminUsername = localStorage.getItem('adminUsername');
      const adminToken = localStorage.getItem('adminToken');

      if (adminId && adminUsername && adminToken) {
        // Verify token with database
        const { data: admin, error } = await supabase
          .from('admins')
          .select()
          .eq('id', adminId)
          .eq('username', adminUsername)
          .single();

        if (admin && !error) {
          // Valid session, redirect to dashboard
          router.push('/admin/dashboard');
          return;
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Error checking admin session:', err);
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data: admin, error } = await supabase
        .from('admins')
        .select()
        .eq('username', username)
        .eq('password_hash', password)
        .single();

      if (error || !admin) {
        setLoading(false)
        setError('Only Team GTC Officials Allowed')
        return
      }

      // Store admin session
      const token = generateToken();
      localStorage.setItem('adminId', admin.id);
      localStorage.setItem('adminUsername', admin.username);
      localStorage.setItem('adminToken', token);

      // Redirect to dashboard
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    }
  };

  const generateToken = () => {
    // Generate a random token
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark to-dark-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-dark-light flex items-center justify-center p-4">
      <div className="bg-dark-light/50 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="Enter password"
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
