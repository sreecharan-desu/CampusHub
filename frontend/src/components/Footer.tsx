// @ts-nocheck
import { motion } from 'framer-motion'
import { SiGithub, SiLinkedin, SiTwitter } from 'react-icons/si'
import { FaHeart, FaCode, FaCoffee, FaYoutube } from 'react-icons/fa'
import { RiTwitterXFill } from 'react-icons/ri'
import { useEffect, useState } from 'react'

interface GitHubStats {
  public_repos: number;
  total_commits?: number;
  followers: number;
}

const Footer = () => {
  const stats = [
    { label: "Projects", value: "10+" },
    { label: "Commits", value: "1000+" },
    { label: "Followers", value: "2" }
  ]

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/sreecharan-desu",
      icon: SiGithub,
      color: "#333"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/sreecharan-desu",
      icon: SiLinkedin,
      color: "#0077B5"
    },
    {
      name: "X",
      url: "https://x.com/sreecharandesu",
      icon: RiTwitterXFill,
      color: "#000000"
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@mrsreecharan",
      icon: FaYoutube,
      color: "#FF0000"
    }
  ]

  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 pt-12 sm:pt-16 pb-6 sm:pb-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-orange-100/40 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 right-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-blue-100/40 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-3xl mx-auto mb-6 sm:mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 
                         bg-clip-text text-transparent mb-1 sm:mb-2"
              >
                {stat.value}
              </motion.div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                scale: 1.2,
                transition: { type: "spring", stiffness: 400 }
              }}
              transition={{ delay: index * 0.1 }}
              className="p-2 sm:p-3 rounded-full bg-white shadow-lg hover:shadow-xl 
                       transition-all duration-300 group"
              style={{ 
                backgroundColor: `${social.color}10`
              }}
            >
              <social.icon 
                className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300"
                style={{ 
                  color: social.color
                }}
              />
            </motion.a>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6 sm:mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-4xl mx-auto px-4">
          {/* Made with Love */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex flex-wrap justify-center md:justify-start items-center gap-1 sm:gap-2 text-gray-600"
          >
            <span className='text-xs sm:text-sm md:text-base'>Made with</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <FaHeart className="text-orange-500 w-3 h-3 sm:w-4 sm:h-4" />
            </motion.div>
            <span>by</span>
            <motion.a
              href="https://github.com/sreecharan-desu"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="font-medium text-gray-500 hover:text-black text-xs sm:text-sm
                       transition-colors duration-300"
            >
              Sreecharan
            </motion.a>
            <span>for</span>
            <motion.a
              href="https://www.linkedin.com/in/sreecharan-desu"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="font-medium text-blue-500 hover:text-blue-600 text-xs sm:text-sm
                       transition-colors duration-300"
            >
              Sreecharan
            </motion.a>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center gap-2 sm:gap-3 text-gray-500 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-1">
              <FaCode className="text-orange-400 w-3 h-3 sm:w-4 sm:h-4" />
              <span>React + TypeScript</span>
            </div>
            <div className="h-3 sm:h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-1">
              <FaCoffee className="text-orange-400 w-3 h-3 sm:w-4 sm:h-4" />
              <span>Lots of Coffee</span>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center text-gray-400 text-xs sm:text-sm mt-6 sm:mt-8"
        >
          © {new Date().getFullYear()} All rights reserved
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
