'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { FaYoutube, FaChevronRight, FaSearch } from 'react-icons/fa';
import { MdPlayLesson } from 'react-icons/md';

export default function SubjectDetail() {
  const params = useParams();
  const [subject, setSubject] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchSubjectAndChapters();
    }
  }, [params.id]);

  const fetchSubjectAndChapters = async () => {
    try {
      // Fetch subject details
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', params.id)
        .single();

      if (subjectError) throw subjectError;
      setSubject(subjectData);

      // Fetch chapters with playlist count
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select(`
          *,
          playlists:playlists(count)
        `)
        .eq('subject_id', params.id)
        .eq('playlists.status', 'approved');

      if (chaptersError) throw chaptersError;
      setChapters(chaptersData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChapters = chapters.filter(chapter =>
    chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark to-dark-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-dark-light">
      <Navbar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center animate-pulse-glow">
            {subject?.name}
          </h1>
          
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pl-12 rounded-lg bg-dark-light/30 text-white border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-4">
            {filteredChapters.map((chapter) => (
              <Link 
                key={chapter.id}
                href={`/chapters/${chapter.id}`}
                className="block group"
              >
                <div className="bg-dark-light/20 backdrop-blur-sm rounded-lg p-4 hover:bg-dark-light/30 transition-all duration-300 transform hover:translate-x-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-primary">
                        <MdPlayLesson size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors">
                          {chapter.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <FaYoutube className="text-red-500" />
                          <span className="text-sm text-gray-400">
                            {chapter.playlists[0]?.count || 0} Playlists
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-primary transition-colors">
                      <FaChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {filteredChapters.length === 0 && (
              <div className="text-center text-gray-400">
                No chapters available for this subject yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
