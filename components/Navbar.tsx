'use client';

import Link from 'next/link';
import { FaYoutube, FaUpload, FaUserLock } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <FaYoutube className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-white">BtechNode</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <HiMenu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/subjects"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-light transition-all duration-300"
            >
              Subjects
            </Link>
            <Link
              href="/upload"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-light transition-all duration-300"
            >
              <FaUpload className="mr-2" /> Upload
            </Link>
            <Link
              href="/admin"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-light transition-all duration-300"
            >
              <FaUserLock className="mr-2" /> Admin Login
            </Link>
            <a
              href="https://forms.gle/oAvZyJSTaN2QPbrf8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-light transition-all duration-300"
            >
              Request Subject
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed top-16 left-0 w-64 h-full bg-dark shadow-lg z-50`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/subjects"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-light transition-all duration-300"
          >
            Subjects
          </Link>
          <Link
            href="/upload"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-light transition-all duration-300"
          >
            <FaUpload className="mr-2" /> Upload
          </Link>
          <Link
            href="/admin"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-light transition-all duration-300"
          >
            <FaUserLock className="mr-2" /> Admin Login
          </Link>
          <a
            href="https://forms.gle/oAvZyJSTaN2QPbrf8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-light transition-all duration-300"
          >
            Request Subject
          </a>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </nav>
  );
}
