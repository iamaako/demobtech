'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { supabase } from '@/utils/supabase'
import { FaYoutube, FaCheck, FaTimes, FaEdit, FaTrash, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'

interface Developer {
  id: string
  name: string
  role: string
  image_url: string
  github_url: string | null
  linkedin_url: string | null
  instagram_url: string | null
}

interface Playlist {
  id: string
  title: string
  url: string
  thumbnail_url: string
  status: string
  created_at: string
  subject: { id: string; name: string } | null
  chapter: { id: string; name: string } | null
}

interface Subject {
  id: string
  name: string
}

interface Chapter {
  id: string
  name: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('pending')
  const [pendingPlaylists, setPendingPlaylists] = useState<Playlist[]>([])
  const [approvedPlaylists, setApprovedPlaylists] = useState<Playlist[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedUrl, setEditedUrl] = useState('')
  const [addingSubject, setAddingSubject] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState('')
  const [addingChapter, setAddingChapter] = useState(false)
  const [newChapterName, setNewChapterName] = useState('')
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [showDeveloperModal, setShowDeveloperModal] = useState(false)
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null)
  const [newDeveloper, setNewDeveloper] = useState({
    name: '',
    role: '',
    image_url: '',
    github_url: '',
    linkedin_url: '',
    instagram_url: ''
  })

  useEffect(() => {
    checkAdminSession()
  }, [])

  useEffect(() => {
    if (!loading) {
      fetchPendingPlaylists()
      fetchApprovedPlaylists()
      fetchSubjects()
      fetchDevelopers()
    }
  }, [loading])

  useEffect(() => {
    if (selectedSubject && selectedSubject !== 'add_new') {
      fetchChapters()
    } else {
      setChapters([])
    }
  }, [selectedSubject])

  const checkAdminSession = async () => {
    try {
      const adminId = localStorage.getItem('adminId')
      if (!adminId) {
        router.push('/admin')
        return
      }
      setLoading(false)
    } catch (err) {
      console.error('Error checking admin session:', err)
      router.push('/admin')
    }
  }

  const fetchPendingPlaylists = async () => {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })

      if (error) throw error
      setPendingPlaylists(data || [])
    } catch (err) {
      console.error('Error fetching pending playlists:', err)
    }
  }

  const fetchApprovedPlaylists = async () => {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: true })

      if (error) throw error
      setApprovedPlaylists(data || [])
    } catch (err) {
      console.error('Error fetching approved playlists:', err)
    }
  }

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setSubjects(data || [])
    } catch (err) {
      console.error('Error fetching subjects:', err)
    }
  }

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('subject_id', selectedSubject)
        .order('name', { ascending: true })

      if (error) throw error
      setChapters(data || [])
    } catch (err) {
      console.error('Error fetching chapters:', err)
    }
  }

  const fetchDevelopers = async () => {
    try {
      const { data, error } = await supabase
        .from('developers')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      setDevelopers(data || [])
    } catch (err) {
      console.error('Error fetching developers:', err)
    }
  }

  const handleAddDeveloper = async () => {
    try {
      const { error } = await supabase
        .from('developers')
        .insert([newDeveloper])

      if (error) throw error

      setShowDeveloperModal(false)
      setNewDeveloper({
        name: '',
        role: '',
        image_url: '',
        github_url: '',
        linkedin_url: '',
        instagram_url: ''
      })
      fetchDevelopers()
    } catch (err) {
      console.error('Error adding developer:', err)
    }
  }

  const handleUpdateDeveloper = async () => {
    if (!editingDeveloper) return

    try {
      const { error } = await supabase
        .from('developers')
        .update({
          name: editingDeveloper.name,
          role: editingDeveloper.role,
          image_url: editingDeveloper.image_url,
          github_url: editingDeveloper.github_url,
          linkedin_url: editingDeveloper.linkedin_url,
          instagram_url: editingDeveloper.instagram_url
        })
        .eq('id', editingDeveloper.id)

      if (error) throw error

      setShowDeveloperModal(false)
      setEditingDeveloper(null)
      fetchDevelopers()
    } catch (err) {
      console.error('Error updating developer:', err)
    }
  }

  const handleDeleteDeveloper = async (id: string) => {
    if (!confirm('Are you sure you want to delete this developer?')) return

    try {
      const { error } = await supabase
        .from('developers')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchDevelopers()
    } catch (err) {
      console.error('Error deleting developer:', err)
    }
  }

  const handlePlaylistAction = async (playlistId: string, action: 'approve' | 'decline') => {
    try {
      if (action === 'approve') {
        const { error } = await supabase
          .from('playlists')
          .update({ status: 'approved' })
          .eq('id', playlistId);

        if (error) throw error;
      } else if (action === 'decline') {
        // Delete the playlist if declined
        const { error } = await supabase
          .from('playlists')
          .delete()
          .eq('id', playlistId);

        if (error) throw error;
      }

      // Refresh playlists after action
      fetchPendingPlaylists()
      fetchApprovedPlaylists()
    } catch (err) {
      console.error('Error handling playlist action:', err);
    }
  };

  const handleEdit = (playlist: Playlist) => {
    setEditingPlaylist(playlist)
    setEditedTitle(playlist.title)
    setEditedUrl(playlist.url)
  }

  const handleSaveEdit = async () => {
    if (!editingPlaylist) return

    try {
      const { error } = await supabase
        .from('playlists')
        .update({
          title: editedTitle,
          url: editedUrl
        })
        .eq('id', editingPlaylist.id)

      if (error) throw error

      fetchApprovedPlaylists()
      setEditingPlaylist(null)
      setEditedTitle('')
      setEditedUrl('')
    } catch (err) {
      console.error('Error updating playlist:', err)
      setError('Failed to update playlist')
    }
  }

  const handleCancelEdit = () => {
    setEditingPlaylist(null)
    setEditedTitle('')
    setEditedUrl('')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return

    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id)

      if (error) throw error

      fetchApprovedPlaylists()
    } catch (err) {
      console.error('Error deleting playlist:', err)
      setError('Failed to delete playlist')
    }
  }

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return

    try {
      const { error } = await supabase
        .from('subjects')
        .insert([{ name: newSubjectName.trim() }])

      if (error) throw error

      setNewSubjectName('')
      setAddingSubject(false)
      fetchSubjects()
    } catch (err) {
      console.error('Error adding subject:', err)
      setError('Failed to add subject')
    }
  }

  const handleAddChapter = async () => {
    if (!newChapterName.trim() || !selectedSubject || selectedSubject === 'add_new') return

    try {
      const { error } = await supabase
        .from('chapters')
        .insert([{
          name: newChapterName.trim(),
          subject_id: selectedSubject
        }])

      if (error) throw error

      setNewChapterName('')
      setAddingChapter(false)
      fetchChapters()
    } catch (err) {
      console.error('Error adding chapter:', err)
      setError('Failed to add chapter')
    }
  }

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return

    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', chapterId)

      if (error) throw error

      fetchChapters()
    } catch (err) {
      console.error('Error deleting chapter:', err)
      setError('Failed to delete chapter')
    }
  }

  const handleDeleteSubject = async (subjectId: string) => {
    if (!confirm('Are you sure you want to delete this subject? This will also delete all associated chapters.')) return

    try {
      // First delete all chapters
      const { error: chaptersError } = await supabase
        .from('chapters')
        .delete()
        .eq('subject_id', subjectId)

      if (chaptersError) throw chaptersError

      // Then delete the subject
      const { error: subjectError } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId)

      if (subjectError) throw subjectError

      setSelectedSubject('')
      fetchSubjects()
    } catch (err) {
      console.error('Error deleting subject:', err)
      setError('Failed to delete subject')
    }
  }

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem('adminId')
    localStorage.removeItem('adminUsername')
    localStorage.removeItem('adminToken')
    // Redirect to login
    router.push('/admin')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-dark to-dark-light">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl text-white">Loading...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark to-dark-light">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 ${
                activeTab === 'pending'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Pending Playlists
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 ${
                activeTab === 'approved'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Approved Playlists
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-4 py-2 ${
                activeTab === 'subjects'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Manage Subjects
            </button>
            <button
              onClick={() => setActiveTab('developers')}
              className={`px-4 py-2 ${
                activeTab === 'developers'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Manage Developers
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-400">Loading...</p>
            </div>
          )}

          {/* Pending Playlists Tab */}
          {!loading && activeTab === 'pending' && (
            <div className="bg-dark-light/50 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Pending Playlists</h2>
              <div className="space-y-4">
                {pendingPlaylists.length > 0 ? (
                  pendingPlaylists.map((playlist) => (
                    <div key={playlist.id} className="bg-dark/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium">{playlist.title}</h3>
                          <p className="text-gray-400">
                            Subject: {playlist.subject?.name} | Chapter: {playlist.chapter?.name}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <a 
                              href={playlist.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:text-primary/80 text-sm flex items-center space-x-1"
                            >
                              <FaYoutube className="text-lg" />
                              <span>View Playlist</span>
                            </a>
                            <span className="text-gray-500 text-sm">
                              Submitted: {new Date(playlist.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(playlist)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handlePlaylistAction(playlist.id, 'approve')}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handlePlaylistAction(playlist.id, 'decline')}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">No pending playlists</p>
                )}
              </div>
            </div>
          )}

          {/* Approved Playlists Tab */}
          {!loading && activeTab === 'approved' && (
            <div className="bg-dark-light/50 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Approved Playlists</h2>
              <div className="space-y-4">
                {approvedPlaylists.length > 0 ? (
                  approvedPlaylists.map((playlist) => (
                    <div key={playlist.id} className="bg-dark/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          {editingPlaylist?.id === playlist.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-dark border border-gray-600 rounded text-white"
                                placeholder="Playlist Title"
                              />
                              <input
                                type="url"
                                value={editedUrl}
                                onChange={(e) => setEditedUrl(e.target.value)}
                                className="w-full px-3 py-2 bg-dark border border-gray-600 rounded text-white"
                                placeholder="Playlist URL"
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={handleSaveEdit}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-1"
                                >
                                  <FaCheck className="text-sm" />
                                  <span>Save</span>
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-1"
                                >
                                  <FaTimes className="text-sm" />
                                  <span>Cancel</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={playlist.thumbnail_url} 
                                  alt={playlist.title}
                                  className="w-16 h-16 rounded object-cover"
                                />
                                <div>
                                  <h3 className="text-lg font-medium">{playlist.title}</h3>
                                  <p className="text-gray-400">
                                    Subject: {playlist.subject?.name} | Chapter: {playlist.chapter?.name}
                                  </p>
                                  <div className="flex items-center space-x-4 mt-2">
                                    <a 
                                      href={playlist.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-primary hover:text-primary/80 text-sm flex items-center space-x-1"
                                    >
                                      <FaYoutube className="text-lg" />
                                      <span>View Playlist</span>
                                    </a>
                                    <span className="text-gray-500 text-sm">
                                      Submitted: {new Date(playlist.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        {!editingPlaylist && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(playlist)}
                              className="p-2 text-blue-500 hover:text-blue-400 transition-colors rounded-lg"
                              title="Edit Playlist"
                            >
                              <FaEdit className="text-xl" />
                            </button>
                            <button
                              onClick={() => handleDelete(playlist.id)}
                              className="p-2 text-red-500 hover:text-red-400 transition-colors rounded-lg"
                              title="Delete Playlist"
                            >
                              <FaTrash className="text-xl" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">No approved playlists</p>
                )}
              </div>
            </div>
          )}

          {/* Subjects Tab */}
          {!loading && activeTab === 'subjects' && (
            <div className="bg-dark-light/50 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Manage Subjects</h2>
              
              {/* Subject Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    const value = e.target.value
                    setSelectedSubject(value)
                    if (value === 'add_new') {
                      setAddingSubject(true)
                    } else {
                      setAddingSubject(false)
                    }
                  }}
                  className="w-full px-4 py-2 bg-dark/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                  <option value="add_new">+ Add New Subject</option>
                </select>
              </div>

              {/* Add Subject Form */}
              {addingSubject && (
                <div className="mb-6 p-4 bg-dark/50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Add New Subject</h3>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      placeholder="Enter subject name"
                      className="flex-1 px-4 py-2 bg-dark-light/50 border border-gray-600 rounded-lg text-white"
                    />
                    <button
                      onClick={handleAddSubject}
                      disabled={!newSubjectName.trim()}
                      className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg disabled:opacity-50"
                    >
                      Add Subject
                    </button>
                    <button
                      onClick={() => {
                        setAddingSubject(false)
                        setSelectedSubject('')
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Chapters Management */}
              {selectedSubject && selectedSubject !== 'add_new' && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Chapters</h3>
                    <button
                      onClick={() => setAddingChapter(true)}
                      className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg"
                    >
                      Add Chapter
                    </button>
                  </div>

                  {/* Add Chapter Form */}
                  {addingChapter && (
                    <div className="mb-6 p-4 bg-dark/50 rounded-lg">
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={newChapterName}
                          onChange={(e) => setNewChapterName(e.target.value)}
                          placeholder="Enter chapter name"
                          className="flex-1 px-4 py-2 bg-dark-light/50 border border-gray-600 rounded-lg text-white"
                        />
                        <button
                          onClick={handleAddChapter}
                          disabled={!newChapterName.trim()}
                          className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg disabled:opacity-50"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setAddingChapter(false)}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Chapters List */}
                  <div className="space-y-3">
                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="flex items-center justify-between p-3 bg-dark/50 rounded-lg"
                      >
                        <span>{chapter.name}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteChapter(chapter.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {chapters.length === 0 && (
                      <p className="text-center text-gray-400">No chapters added yet</p>
                    )}
                  </div>

                  {/* Delete Subject Button */}
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <button
                      onClick={() => handleDeleteSubject(selectedSubject)}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                      Delete Subject and All Its Chapters
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Developers Tab */}
          {!loading && activeTab === 'developers' && (
            <div className="bg-dark-light/50 backdrop-blur-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Manage Developers</h2>
                <button
                  onClick={() => setShowDeveloperModal(true)}
                  className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg"
                >
                  Add Developer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {developers.map((dev) => (
                  <div key={dev.id} className="bg-dark-light/50 backdrop-blur-md rounded-lg p-6">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <Image
                        src={dev.image_url}
                        alt={dev.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-2">{dev.name}</h3>
                    <p className="text-gray-400 text-center mb-4">{dev.role}</p>
                    <div className="flex justify-center space-x-4 mb-4">
                      {dev.github_url && <FaGithub className="text-xl text-gray-400" />}
                      {dev.linkedin_url && <FaLinkedin className="text-xl text-gray-400" />}
                      {dev.instagram_url && <FaInstagram className="text-xl text-gray-400" />}
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => {
                          setEditingDeveloper(dev)
                          setShowDeveloperModal(true)
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDeveloper(dev.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Developer Modal */}
      {showDeveloperModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-dark-light rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingDeveloper ? 'Edit Developer' : 'Add Developer'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editingDeveloper?.name || newDeveloper.name}
                  onChange={(e) =>
                    editingDeveloper
                      ? setEditingDeveloper({ ...editingDeveloper, name: e.target.value })
                      : setNewDeveloper({ ...newDeveloper, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  value={editingDeveloper?.role || newDeveloper.role}
                  onChange={(e) =>
                    editingDeveloper
                      ? setEditingDeveloper({ ...editingDeveloper, role: e.target.value })
                      : setNewDeveloper({ ...newDeveloper, role: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingDeveloper?.image_url || newDeveloper.image_url}
                  onChange={(e) =>
                    editingDeveloper
                      ? setEditingDeveloper({ ...editingDeveloper, image_url: e.target.value })
                      : setNewDeveloper({ ...newDeveloper, image_url: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={editingDeveloper?.github_url || newDeveloper.github_url}
                  onChange={(e) =>
                    editingDeveloper
                      ? setEditingDeveloper({ ...editingDeveloper, github_url: e.target.value })
                      : setNewDeveloper({ ...newDeveloper, github_url: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={editingDeveloper?.linkedin_url || newDeveloper.linkedin_url}
                  onChange={(e) =>
                    editingDeveloper
                      ? setEditingDeveloper({ ...editingDeveloper, linkedin_url: e.target.value })
                      : setNewDeveloper({ ...newDeveloper, linkedin_url: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={editingDeveloper?.instagram_url || newDeveloper.instagram_url}
                  onChange={(e) =>
                    editingDeveloper
                      ? setEditingDeveloper({ ...editingDeveloper, instagram_url: e.target.value })
                      : setNewDeveloper({ ...newDeveloper, instagram_url: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowDeveloperModal(false)
                  setEditingDeveloper(null)
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingDeveloper ? handleUpdateDeveloper : handleAddDeveloper}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                {editingDeveloper ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
