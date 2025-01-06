'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { FaBook, FaArrowLeft } from 'react-icons/fa';

export default function SubjectDetail() {
  const params = useParams();
  const [subject, setSubject] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchSubjectAndChapters();
    }
  }, [params.id]);

  const fetchSubjectAndChapters = async () => {
    const [subjectRes, chaptersRes] = await Promise.all([
      supabase
        .from('subjects')
        .select('*')
        .eq('id', params.id)
        .single(),
      supabase
        .from('chapters')
        .select('*')
        .eq('subject_id', params.id)
    ]);

    if (subjectRes.data) setSubject(subjectRes.data);
    if (chaptersRes.data) setChapters(chaptersRes.data);
    setLoading(false);
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
        <div className="py-12">
          {/* Back button */}
          <div className="flex items-center space-x-4 mb-8">
            <Link
              href="/subjects"
              className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Subjects</span>
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-center mb-12 neon-glow bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            {subject?.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/chapters/${chapter.id}`}
                className="group"
              >
                <div className="bg-dark-light/50 backdrop-blur-md rounded-lg p-6 card-glow hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FaBook className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white group-hover:text-primary transition-colors duration-300">
                      {chapter.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {chapters.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              No chapters available for this subject yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
