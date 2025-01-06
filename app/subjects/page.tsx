'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { FaBook } from 'react-icons/fa';

// Random colors for subject cards
const bgColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-orange-500'
];

export default function Subjects() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;

      setSubjects(data || []);
    } catch (err: any) {
      console.error('Error fetching subjects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark to-dark-light">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark to-dark-light">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <h1 className="text-4xl font-bold text-center mb-12 neon-glow bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Subjects
        </h1>

        {error && (
          <div className="text-red-500 text-center mb-8">
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subjects.map((subject, index) => (
            <Link
              key={subject.id}
              href={`/subjects/${subject.id}`}
              className="transform hover:scale-105 transition-all duration-300"
            >
              <div className={`${bgColors[index % bgColors.length]} rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group`}>
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                  <FaBook className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white text-center">
                  {subject.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
