'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useDropzone } from 'react-dropzone';
import { FaYoutube, FaUpload, FaTimes } from 'react-icons/fa';

interface PlaylistInput {
  url: string;
  title: string;
}

export default function Upload() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [playlists, setPlaylists] = useState<PlaylistInput[]>([{ url: '', title: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchChapters(selectedSubject);
    } else {
      setChapters([]);
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select('id, name');
    if (data) setSubjects(data);
  };

  const fetchChapters = async (subjectId: string) => {
    const { data, error } = await supabase
      .from('chapters')
      .select('id, name')
      .eq('subject_id', subjectId);
    if (data) setChapters(data);
  };

  const getYouTubeData = async (url: string) => {
    try {
      const playlistId = url.match(/[?&]list=([^&]+)/)?.[1];
      if (!playlistId) {
        throw new Error('Invalid YouTube playlist URL');
      }

      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (!apiKey) {
        throw new Error('YouTube API key is missing');
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${apiKey}`
      );
      
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Failed to fetch playlist data');
      }

      if (!data.items || data.items.length === 0) {
        throw new Error('Playlist is empty or private');
      }

      const firstVideo = data.items[0].snippet;
      const videoId = firstVideo.resourceId.videoId;
      const thumbnail = 
        firstVideo.thumbnails.maxres?.url ||
        firstVideo.thumbnails.standard?.url ||
        firstVideo.thumbnails.high?.url ||
        firstVideo.thumbnails.medium?.url ||
        firstVideo.thumbnails.default?.url;

      return {
        thumbnailUrl: thumbnail,
        videoId,
        playlistId,
        title: firstVideo.title
      };
    } catch (err: any) {
      console.error('Error getting YouTube data:', err);
      throw new Error(err.message || 'Failed to get playlist data');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const textFiles = acceptedFiles.filter(file => file.type === 'text/plain');
    
    textFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        const urls = text.split('\n')
          .map(line => line.trim())
          .filter(line => line && (line.includes('youtube.com') || line.includes('youtu.be')));
        
        setPlaylists(prev => [
          ...prev,
          ...urls.map(url => ({ url, title: '' }))
        ]);
      };
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt']
    }
  });

  const addPlaylist = () => {
    setPlaylists([...playlists, { url: '', title: '' }]);
  };

  const removePlaylist = (index: number) => {
    setPlaylists(playlists.filter((_, i) => i !== index));
  };

  const updatePlaylist = (index: number, field: keyof PlaylistInput, value: string) => {
    const newPlaylists = [...playlists];
    newPlaylists[index] = { ...newPlaylists[index], [field]: value };
    setPlaylists(newPlaylists);
  };

  const checkDuplicates = async (urls: string[]) => {
    // Check for duplicates within the form
    const uniqueUrls = new Set(urls);
    if (uniqueUrls.size !== urls.length) {
      throw new Error('Duplicate URLs found in the form. Please remove duplicate entries.');
    }

    // Check for duplicates in database
    const { data: existingPlaylists, error } = await supabase
      .from('playlists')
      .select('url')
      .in('url', urls);

    if (error) throw error;

    if (existingPlaylists && existingPlaylists.length > 0) {
      const duplicateUrls = existingPlaylists.map(p => p.url);
      throw new Error(`These playlists already exist: ${duplicateUrls.join(', ')}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setProgress(0);

    try {
      const validPlaylists = playlists.filter(p => p.url.trim());
      if (validPlaylists.length === 0) {
        throw new Error('Please add at least one playlist URL');
      }

      // Check for duplicates before proceeding
      await checkDuplicates(validPlaylists.map(p => p.url.trim()));

      const total = validPlaylists.length;
      let completed = 0;

      for (const playlist of validPlaylists) {
        try {
          const youtubeData = await getYouTubeData(playlist.url);
          
          await supabase
            .from('playlists')
            .insert({
              subject_id: selectedSubject,
              chapter_id: selectedChapter,
              url: playlist.url,
              title: playlist.title || youtubeData.title,
              thumbnail_url: youtubeData.thumbnailUrl,
              status: 'pending'
            });

          completed++;
          setProgress((completed / total) * 100);
        } catch (err: any) {
          console.error(`Error with playlist ${playlist.url}:`, err);
          // Continue with other playlists even if one fails
        }
      }

      // Reset form
      setSelectedSubject('');
      setSelectedChapter('');
      setPlaylists([{ url: '', title: '' }]);
      setProgress(100);
      alert('Playlists submitted for review!');
    } catch (err: any) {
      console.error('Error submitting playlists:', err);
      setError(err.message || 'Failed to submit playlists');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-dark-light">
      <Navbar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-8">
          {/* Form Container */}
          <div className="bg-dark-light/20 backdrop-blur-sm rounded-lg p-6 shadow-xl">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">Upload Playlist</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject Dropdown */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 rounded-lg bg-dark-light/30 text-white border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="" className="bg-dark text-gray-400">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id} className="bg-dark text-white">
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Dropdown */}
              {selectedSubject && (
                <div>
                  <label htmlFor="chapter" className="block text-sm font-medium text-gray-300 mb-2">
                    Chapter
                  </label>
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="w-full p-2 rounded-lg bg-dark-light/30 text-white border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    disabled={!selectedSubject}
                  >
                    <option value="" className="bg-dark text-gray-400">Select Chapter</option>
                    {chapters.map((chapter) => (
                      <option key={chapter.id} value={chapter.id} className="bg-dark text-white">
                        {chapter.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Drag & Drop Zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-600 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-300">
                  {isDragActive
                    ? 'Drop the playlist file here...'
                    : 'Drag & drop a text file with playlist URLs, or click to select'}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  One playlist URL per line
                </p>
              </div>

              {/* Playlist Inputs */}
              <div className="space-y-4">
                {playlists.map((playlist, index) => (
                  <div key={index} className="space-y-4 md:space-y-0 md:flex md:gap-4 items-start">
                    <div className="w-full">
                      <input
                        type="text"
                        value={playlist.url}
                        onChange={(e) => updatePlaylist(index, 'url', e.target.value)}
                        placeholder="Enter YouTube Playlist URL"
                        className="w-full px-4 py-3 text-sm md:text-base rounded-lg bg-dark-light/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="w-full">
                      <input
                        type="text"
                        value={playlist.title}
                        onChange={(e) => updatePlaylist(index, 'title', e.target.value)}
                        placeholder="Enter Playlist Title (Optional)"
                        className="w-full px-4 py-3 text-sm md:text-base rounded-lg bg-dark-light/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePlaylist(index)}
                      className="w-full md:w-auto px-4 py-3 text-sm md:text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Add More Button */}
              <div>
                <button
                  type="button"
                  onClick={addPlaylist}
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  + Add Another Playlist
                </button>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Progress Bar */}
              {loading && progress > 0 && (
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 text-sm md:text-base font-medium text-white bg-primary hover:bg-primary/80 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Uploading...' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
