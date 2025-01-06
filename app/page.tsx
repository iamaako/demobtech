'use client';

import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'

type Developer = {
  id: string
  name: string
  role: string
  image_url: string
  github_url: string | null
  linkedin_url: string | null
  instagram_url: string | null
}

export default function Home() {
  const [developers, setDevelopers] = useState<Developer[]>([])

  useEffect(() => {
    fetchDevelopers()
  }, [])

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark to-dark-light">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Welcome to GTC Study Hub
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Your one-stop destination for quality educational content
          </p>
          <Link
            href="/subjects"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors"
          >
            Start Learning
          </Link>
        </div>
      </section>

      {/* Our Developers Section */}
      <section className="py-16 px-4 bg-dark/50" id="developers">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((dev) => (
              <div
                key={dev.id}
                className="bg-dark-light/50 backdrop-blur-md rounded-lg p-6 transform hover:scale-[1.02] transition-all duration-500 ease-in-out hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <Image
                    src={dev.image_url}
                    alt={dev.name}
                    fill
                    className="rounded-full object-cover border-2 border-primary/20"
                  />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2 text-white">{dev.name}</h3>
                <p className="text-gray-400 text-center mb-4 text-base">{dev.role}</p>
                <div className="flex justify-center space-x-4">
                  {dev.github_url && (
                    <a
                      href={dev.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary transition-colors duration-300"
                    >
                      <FaGithub className="text-2xl" />
                    </a>
                  )}
                  {dev.linkedin_url && (
                    <a
                      href={dev.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary transition-colors duration-300"
                    >
                      <FaLinkedin className="text-2xl" />
                    </a>
                  )}
                  {dev.instagram_url && (
                    <a
                      href={dev.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary transition-colors duration-300"
                    >
                      <FaInstagram className="text-2xl" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <div className="py-8 text-center">
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary transition-colors"
          >
            <FaGithub className="text-2xl" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary transition-colors"
          >
            <FaLinkedin className="text-2xl" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary transition-colors"
          >
            <FaInstagram className="text-2xl" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary transition-colors"
          >
            <FaTwitter className="text-2xl" />
          </a>
        </div>
        <p className="text-gray-500">
          {new Date().getFullYear()} GTC Study Hub. All rights reserved.
        </p>
      </div>
    </main>
  )
}
