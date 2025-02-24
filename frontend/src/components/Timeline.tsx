import { motion } from 'framer-motion'
import { FaGraduationCap, FaChessKnight, FaMedal } from 'react-icons/fa'
import { HiAcademicCap } from 'react-icons/hi'
import { Element } from 'react-scroll'

interface TimelineEvent {
  title: string
  subtitle: string
  date: string
  description?: string
  achievements?: JSX.Element[]
  icon: JSX.Element
  image?: string
  color?: string
}

const Timeline = () => {
  const timelineEvents: TimelineEvent[] = [
    {
      title: "RAJIV GANDHI UNIVERSITY OF KNOWLEDGE TECHNOLOGIES",
      subtitle: "Bachelor of Technology - BTech, Computer Science",
      date: "2023 - 2027",
      achievements: [
        <span>Team lead for the only O21 batch selected for the Inter-University TechHackathon (2025).</span>,
        <span>First Prize in Hackathon 2024</span>,
        <span>Active learner</span>
      ],
      icon: <HiAcademicCap className="text-3xl" />,
      image: "/rgukt.jpg",
      color: "orange"
    },
    {
      title: "RGUKT PRE-UNIVERSITY COURSE",
      subtitle: "Mathematics, Physics, Chemistry",
      date: "2021 - 2023",
      achievements: [
        <div className="achievements">
          <div className="flex flex-col items-start mb-3 space-y-2 lg:space-y-0 lg:space-x-4">
          <a href='https://www.vidyavision.com/results/RGUKT-2021-RESULT%20DATA_compressed.pdf' target='_blank' className='text-decoration-none'>
            <span className="text-sm">
              <b>Top 1%</b> in the entrance examination (967/73,548) <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 text-white text-center px-7 py-1 italic text-xs font-bold rounded-full shadow-md hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 transform hover:scale-105 transition-all duration-300">
              state level
            </span>
            </span>
          </a>
          </div>
        </div>,
                  <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                  <span className="text-sm font-medium">97% Academic Score</span>
                </div>
      ],
      
      icon: <FaGraduationCap className="text-3xl" />,
      color: "blue"
    },
    {
      title: "PRAGATHI HIGH SCHOOL",
      subtitle: "Secondary School Education",
      date: "2020 - 2021",
      achievements: [
        <div className="flex flex-row items-start mb-2">
          Chess Champion
          <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 text-white ml-1 px-3 italic text-[10px]  lg:text-xs lg:mt-1 font-bold rounded-full shadow-md hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 transform hover:scale-105 transition-all duration-300">
            school level
          </span>
        </div>,
        <div className="flex flex-row items-start mb-2">
          Chekumuki winners
          <span className="bg-gradient-to-r from-green-400 via-green-500 to-teal-400 text-white ml-1 px-3 italic text-[10px] lg:text-xs lg:mt-1 font-bold rounded-full shadow-md hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 transform hover:scale-105 transition-all duration-300">
            mandal level
          </span>
        </div>,
        <div className="flex flex-row items-start mb-2">
          Topped in Talent test
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 text-white ml-1 px-1 text-center lg:py-0 italic  text-[8px] lg:text-[10px]  font-bold rounded-full shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 transform hover:scale-105 transition-all duration-300">
            district level
          </span>
        </div>,
        <span className="text-gray-800 font-semibold text-sm">Perfect Attendance Award</span>
      ],
      
      
      icon: <FaChessKnight className="text-2xl sm:text-3xl" />,
      color: "green"
    }
  ]

  return (
    <Element name="education" className="py-32 relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent tracking-tight relative">
            Educational Journey
            <motion.div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 
                        bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: '8rem' }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </h2>
        </motion.div>

        <motion.div className="space-y-12 sm:space-y-16 md:space-y-24 relative">
          {/* Central Timeline Line - Enhanced for desktop */}
          <div className="absolute left-[21px] md:left-1/2 top-0 h-full md:-translate-x-1/2">
            <div className="hidden md:block w-0.5 h-full bg-gradient-to-b from-orange-200 via-orange-300 to-orange-200 
                         rounded-full shadow-lg" />
            <div className="md:hidden w-0.5 h-full bg-gradient-to-b from-orange-200 via-orange-300 to-orange-200 
                         transform translate-x-[5px]" />
          </div>
  
          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative flex flex-col md:flex-row items-center md:items-start 
                       ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}
                       md:mx-auto md:max-w-[90%]`}
            >
              {/* Content Container - Enhanced for desktop */}
              <motion.div 
                className={`relative md:w-[48%] flex flex-row items-start gap-4 sm:gap-6 
                         ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse md:w-[50%]'}
                         md:hover:w-[50%] transition-all duration-300`}
              >
                {/* Icon with Enhanced Visual Effects */}
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative z-20 flex-shrink-0"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white shadow-lg 
                              border-2 border-orange-200 p-2 sm:p-2.5 md:p-3
                              transition-all duration-300 hover:border-orange-400
                              hover:shadow-orange-200/50 hover:rotate-12">
                    <div className="w-full h-full flex items-center justify-center 
                                text-orange-500 transition-colors duration-300">
                      {event.icon}
                    </div>
                  </div>
                  {/* Enhanced Connecting Line */}
                  <div className="md:hidden absolute top-12 left-1/2 h-full w-px 
                              bg-gradient-to-b from-orange-200 to-transparent" />
                </motion.div>
  
                {/* Content Card with Enhanced Desktop Interactivity */}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`flex-1 p-4 sm:p-5 md:p-8 bg-white rounded-xl shadow-md hover:shadow-xl
                           border border-orange-100/20 hover:border-orange-200
                           transition-all duration-300 transform
                           ${index % 2 === 0 ? 'origin-left' : 'origin-right'}
                           md:hover:bg-orange-50/10`}
                >
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    {/* Title and Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 leading-tight">
                        {event.title}
                      </h3>

                    </div>
                    <span className="inline-flex items-center py-0.5 px-4 sm:py-1 
                                   text-xs sm:text-sm font-medium text-orange-500 
                                   bg-orange-50 rounded-full">
                        {event.date}
                      </span>
                    {/* Subtitle */}
                    <p className="text-sm sm:text-base text-gray-600 font-medium">
                      {event.subtitle}
                    </p>
                    
                    {/* Achievements */}
                    {event.achievements && (
                      <motion.div className="space-y-2 pt-2 border-t border-gray-100">
                        {event.achievements.map((achievement, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            className="flex items-start gap-2 group"
                          >
                            <FaMedal className="text-orange-400 flex-shrink-0 mt-1 
                                            transform group-hover:scale-110 transition-transform" />
                            <span className="text-sm sm:text-base text-gray-600 
                                         group-hover:text-gray-800 transition-colors">
                              {achievement}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Glass Effect Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[100px] pointer-events-none" />
    </Element>
  )
}

export default Timeline
