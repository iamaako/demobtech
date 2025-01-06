'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { FaYoutube, FaArrowLeft, FaPlay } from 'react-icons/fa';
import Link from 'next/link';

export default function ChapterDetail() {
  const params = useParams();
  const [chapter, setChapter] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchChapterAndPlaylists();
    }
  }, [params.id]);

  const fetchChapterAndPlaylists = async () => {
    try {
      // Fetch chapter details
      const { data: chapterData, error: chapterError } = await supabase
        .from('chapters')
        .select('*, subjects(*)')
        .eq('id', params.id)
        .single();

      if (chapterError) throw chapterError;

      setChapter(chapterData);
      setSubject(chapterData.subjects);

      // Fetch approved playlists for this chapter
      const { data: playlistsData, error: playlistsError } = await supabase
        .from('playlists')
        .select('*')
        .eq('chapter_id', params.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (playlistsError) throw playlistsError;

      setPlaylists(playlistsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
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
        <div className="py-12">
          {/* Back button and breadcrumbs */}
          <div className="flex items-center space-x-4 mb-8">
            <Link
              href={`/subjects/${subject?.id}`}
              className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors"
            >
              <FaArrowLeft />
              <span>Back to {subject?.name}</span>
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-center mb-12 neon-glow bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            {chapter?.name}
          </h1>

          {/* Playlists Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <a
                key={playlist.id}
                href={playlist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-dark-light/50 backdrop-blur-md rounded-lg overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative aspect-video">
                    <img
                      src={playlist.thumbnail_url}
                      alt={playlist.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <div className="bg-red-600 rounded-full p-4">
                          <FaPlay className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Title */}
                  <div className="p-4">
                    <div className="flex items-center space-x-2">
                      <FaYoutube className="text-red-500 flex-shrink-0" />
                      <h2 className="text-lg font-semibold text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {playlist.title}
                      </h2>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {playlists.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              No playlists available for this chapter yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
