'use client';

import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar';
import { FaYoutube, FaGraduationCap, FaUsers, FaLightbulb } from 'react-icons/fa';
import { BiBookReader } from 'react-icons/bi';
import { MdEngineering } from 'react-icons/md';
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
    <div className="min-h-screen bg-gradient-to-b from-dark to-dark-light">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold animate-pulse-glow mb-6">
            Welcome to BtechNode
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your one-stop platform for B.Tech education. Access curated YouTube playlists, organized by subject and chapter, to enhance your engineering journey.
          </p>
          <Link 
            href="/subjects"
            className="inline-block bg-primary hover:bg-primary/80 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Start Learning
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-light/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Why Choose BtechNode?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-dark-light/20 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-primary text-4xl mb-4">
                <FaYoutube />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Curated Content</h3>
              <p className="text-gray-300">
                Handpicked YouTube playlists from top educators, organized for effective learning.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-dark-light/20 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-primary text-4xl mb-4">
                <BiBookReader />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Structured Learning</h3>
              <p className="text-gray-300">
                Content organized by subjects and chapters for systematic study approach.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-dark-light/20 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-primary text-4xl mb-4">
                <FaGraduationCap />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Free Education</h3>
              <p className="text-gray-300">
                Access quality engineering education completely free of cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <div className="text-gray-300">Engineering Subjects</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-gray-300">Video Playlists</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray-300">Students Learning</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-light/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">About BtechNode</h2>
              <p className="text-gray-300 mb-4">
                BtechNode is an initiative to make quality engineering education accessible to everyone. We believe in the power of organized learning and the impact of visual education.
              </p>
              <p className="text-gray-300">
                Created by Team GTC, our platform brings together the best educational content from YouTube, carefully curated and structured for B.Tech students.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-light/20 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-primary text-3xl mb-2">
                  <FaUsers />
                </div>
                <h3 className="text-lg font-bold text-white">Community Driven</h3>
              </div>
              <div className="bg-dark-light/20 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-primary text-3xl mb-2">
                  <MdEngineering />
                </div>
                <h3 className="text-lg font-bold text-white">Engineering Focus</h3>
              </div>
              <div className="bg-dark-light/20 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-primary text-3xl mb-2">
                  <FaLightbulb />
                </div>
                <h3 className="text-lg font-bold text-white">Innovative Learning</h3>
              </div>
              <div className="bg-dark-light/20 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-primary text-3xl mb-2">
                  <BiBookReader />
                </div>
                <h3 className="text-lg font-bold text-white">Quality Content</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Developers Section */}
      <section className="py-16 px-4 bg-dark/50" id="developers">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Meet Our Developers
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

      

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-dark">
        <div className="max-w-7xl mx-auto">
          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <FaGithub size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <FaLinkedin size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
              <FaYoutube size={24} />
            </a>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-gray-400">
            <p>&copy; 2025 All Rights Reserved by Team GTC</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
