import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { FaBars, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [nav, setNav] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { id: 1, link: 'home', label: 'Home' },
    { id: 2, link: 'about', label: 'About' },
    { id: 3, link: 'projects', label: 'Projects' },
    { id: 4, link: 'skills', label: 'Skills' },
    { id: 5, link: 'contact', label: 'Contact' },
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark/95 backdrop-blur-sm shadow-glow-soft' : 'bg-transparent'
    }`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-orange">
            Sree.dev
          </h1>
        </motion.div>

        <ul className="hidden md:flex items-center gap-4 lg:gap-8">
          {links.map(({ id, link, label }) => (
            <motion.li
              key={id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: id * 0.1 }}
            >
              <Link
                to={link}
                smooth
                duration={500}
                className="text-white hover:text-orange transition-colors cursor-pointer font-medium text-sm lg:text-base px-2"
              >
                {label}
              </Link>
            </motion.li>
          ))}
          <motion.a
            href="/resume.pdf"
            target="_blank"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-orange hover:bg-orange-light text-white px-4 lg:px-6 py-2 rounded-lg 
                     hover:shadow-glow transition-all"
          >
            Resume
          </motion.a>
        </ul>

        <div className="md:hidden">
          <button
            onClick={() => setNav(!nav)}
            className="text-gray-300 hover:text-primary-sky transition-colors p-2"
            aria-label="Toggle menu"
          >
            {nav ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {nav && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-dark/95"
          >
            <div className="flex flex-col items-center justify-center h-[100svh]">
              {links.map(({ id, link, label }) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: id * 0.1 }}
                >
                  <Link
                    onClick={() => setNav(false)}
                    to={link}
                    smooth
                    duration={500}
                    className="text-xl sm:text-2xl text-gray-300 hover:text-primary-sky transition-colors"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href="/resume.pdf"
                target="_blank"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-primary-sky via-primary-pink to-primary-purple text-white px-8 py-3 rounded-lg 
                         hover:shadow-lg hover:shadow-primary-sky/20 transition-all text-xl"
                onClick={() => setNav(false)}
              >
                Resume
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar 