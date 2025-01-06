'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { FaYoutube, FaArrowLeft, FaPlay, FaSearch } from 'react-icons/fa';
import Link from 'next/link';

export default function ChapterDetail() {
  const params = useParams();
  const [chapter, setChapter] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark to-dark-light">
      <Navbar />
      
      {/* Back button and Title Section */}
      <div className="bg-dark-light/10 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <Link
            href={`/subjects/${subject?.id}`}
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors mb-6"
          >
            <FaArrowLeft size={14} />
            <span>Back to {subject?.name}</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-center animate-pulse-glow">
            {chapter?.name}
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 rounded-lg bg-dark-light/30 text-white border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Playlists Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlaylists.map((playlist) => (
            <a
              key={playlist.id}
              href={playlist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-dark-light/20 backdrop-blur-sm rounded-lg overflow-hidden">
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={playlist.thumbnail_url || 'https://img.youtube.com/vi/default/maxresdefault.jpg'}
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <FaPlay className="text-white text-4xl" />
                  </div>
                </div>
                {/* Title */}
                <div className="p-4">
                  <h3 className="text-white font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {playlist.title || 'YouTube Playlist'}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <FaYoutube className="text-red-500" />
                    <span className="text-sm text-gray-400">Watch on YouTube</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {filteredPlaylists.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            No playlists available for this chapter yet.
          </div>
        )}
      </div>
    </main>
  );
}
