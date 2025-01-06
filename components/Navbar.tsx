import Link from 'next/link'
import { FaHome, FaUpload, FaUserLock } from 'react-icons/fa'
import { MdFeedback } from 'react-icons/md'

const Navbar = () => {
  return (
    <nav className="bg-dark-light/50 backdrop-blur-md fixed w-full z-50 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold neon-glow text-primary">
              BTechNode
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-light transition-all duration-300"
              >
                <FaHome className="mr-2" /> Home
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
                <MdFeedback className="mr-2" /> Raise Request
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
