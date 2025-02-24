import { motion } from 'framer-motion'
import { Element } from 'react-scroll'
import { FaTrophy, FaLanguage } from 'react-icons/fa'
import { HiAcademicCap } from 'react-icons/hi'
import { IoSchool } from 'react-icons/io5'

const About = () => {
  return (
    <Element name="about" className="py-20 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-orange-50" />
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">About Me</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              I'm a dedicated Computer Science sophomore at Rajiv Gandhi University of Knowledge Technologies,
              specializing in full-stack web development. With a strong foundation in modern web technologies
              including the MERN stack, I'm passionate about creating scalable and user-friendly web applications.
            </p>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HiAcademicCap className="text-orange-500" />
                Education
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <IoSchool className="text-2xl text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Bachelor of Technology in Computer Science</h4>
                    <p className="text-gray-600">Rajiv Gandhi University of Knowledge Technologies</p>
                    <p className="text-sm text-gray-500">Expected Graduation: 2027</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaLanguage className="text-orange-500" />
                Languages
              </h3>
              <div className="flex gap-4">
                <span className="px-4 py-2 bg-orange-50 rounded-full text-orange-600">English</span>
                <span className="px-4 py-2 bg-orange-50 rounded-full text-orange-600">Telugu</span>
              </div>
            </div>



          </motion.div>

          {/* Education & Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaTrophy className="w-6 h-6 text-orange-500" />
                Achievements
              </h3>

              <ul className="space-y-4">
                <a href='https://www.vidyavision.com/results/RGUKT-2021-RESULT%20DATA_compressed.pdf' target='_blank'>
                  <li className="-mt-4 lg:mt-0 flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
                    <span className="text-orange-500 text-lg mt-1 flex-shrink-0 text-le">•</span>
                    <p className='-mt-8 ml-4 lg:mt-1 lg:ml-0'> <div className="space-y-2">
                      <p className="text-sm sm:text-base text-start lg:text-lg text-black">
                        <b>Top 1%</b> in the entrance examination for Rajiv Gandhi University of Knowledge Technologies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-300 px-3 py-1 text-sm italic rounded-full text-black">
                          rank no.967 over 73,548
                        </span>
                        <span className="bg-gradient-to-r from-orange-400 pt-1 via-orange-500 to-yellow-400 text-white text-center px-4 py-1 italic text-xs font-bold rounded-full shadow-md hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 transform hover:scale-105 transition-all duration-300">
                          state level
                        </span>
                      </div>
                    </div>
                    </p>
                  </li>
                </a>
                <li className="flex items-start gap-2 sm:gap-4">
                  <span className="text-orange-500 text-lg mt-1 flex-shrink-0">•</span>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                    First Prize in Hackathon at RGUKT, Ongole campus <b>(Ornate 2k24)</b>
                  </p>
                </li>

                <li className="flex items-start gap-2 sm:gap-4">
                  <span className="text-orange-500 text-lg mt-1 flex-shrink-0">•</span>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                    <b>Team lead</b> for the only O21 batch selected for the Inter-University <b>TechHackathon (2025)</b>
                  </p>
                </li>

                <li className="flex items-start gap-2 sm:gap-4">
                  <span className="text-orange-500 text-lg mt-1 flex-shrink-0">•</span>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                    Actively participated in various hackathons and coding competitions workshops and consistently stood in the <strong>top</strong>
                  </p>
                </li>
              </ul>
            </div>

          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <h3 className="text-3xl font-bold text-orange-500">10+</h3>
            <p className="text-gray-600">Projects</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <h3 className="text-3xl font-bold text-orange-500">3+</h3>
            <p className="text-gray-600">Years Coding</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <h3 className="text-3xl font-bold text-orange-500">1000+</h3>
            <p className="text-gray-600">Contributions</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <h3 className="text-3xl font-bold text-orange-500">6+</h3>
            <p className="text-gray-600">Technologies</p>
          </motion.div>
        </motion.div>
      </div>
    </Element>
  )
}

export default About
