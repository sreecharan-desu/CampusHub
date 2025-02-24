import { motion } from 'framer-motion'
import { Element } from 'react-scroll'
import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiPrisma,
  SiPostgresql,
  SiFlask,
  SiVercel,
  SiPostman,
  SiMysql,
  SiCss3,
  SiBootstrap,
  SiHtml5,
  SiNetlify,
  SiExpress,
  SiMongodb,
  SiRecoil,
  SiAwsamplify,
  SiGithubactions,
  SiMui,
  SiNextdotjs,
  SiDocker,
  SiPhp,
  SiTurborepo,
  SiMoonrepo,
  SiLinux,
  SiBun,
} from 'react-icons/si'
import { FaGit, FaPython, FaNode } from 'react-icons/fa'

const Skills = () => {
  const skills = [
    // **Frontend**
    { name: 'React', icon: <SiReact size={32} color="#61DAFB" /> },
    { name: 'Next.js', icon: <SiNextdotjs size={32} color="#000000" /> },
    { name: 'TypeScript', icon: <SiTypescript size={32} color="#3178C6" /> },
    { name: 'JavaScript', icon: <SiJavascript size={32} color="#F7DF1E" /> },
    { name: 'HTML', icon: <SiHtml5 size={32} color="#E34F26" /> },
    { name: 'CSS', icon: <SiCss3 size={32} color="#1572B6" /> },
    { name: 'Tailwind', icon: <SiTailwindcss size={32} color="#06B6D4" /> },
    { name: 'Material UI', icon: <SiMui size={32} color="#0081CB" /> },
    { name: 'Bootstrap', icon: <SiBootstrap size={32} color="#7952B3" /> },
  
    // **Backend**
    { name: 'Bun.js', icon: <SiBun size={32} color="#F7B93E" /> }, // Best color for Bun.js
    // { name: 'Elysia.js', icon: <FaElysia size={32} color="#F7B93E" /> }, // Best color for Bun.js
    { name: 'Node.js', icon: <FaNode size={32} color="#68A063" /> }, // Slightly brighter green
    { name: 'Express', icon: <SiExpress size={32} color="#000000" /> },
    { name: 'PHP', icon: <SiPhp size={32} color="#4FC08D" /> },
    { name: 'Python', icon: <FaPython size={32} color="#3776AB" /> },
    { name: 'Flask', icon: <SiFlask size={32} color="#000000" /> },
  
    // **Database**
    { name: 'PostgreSQL', icon: <SiPostgresql size={32} color="#336791" /> }, // Slightly darker blue
    { name: 'MongoDB', icon: <SiMongodb size={32} color="#47A328" /> },
    { name: 'MySQL', icon: <SiMysql size={32} color="#4479A1" /> },
    { name: 'Prisma', icon: <SiPrisma size={32} color="#2D3748" /> },
  
    // **DevOps / Tools**
    { name: 'Docker', icon: <SiDocker size={32} color="#2496ED" /> }, // Slightly brighter blue
    { name: 'AWS', icon: <SiAwsamplify size={32} color="#FF9900" /> }, // More vibrant orange for AWS
    { name: 'CI/CD', icon: <SiGithubactions size={32} color="#2088FF" /> },
    { name: 'Vercel', icon: <SiVercel size={32} color="#000000" /> },
    { name: 'Netlify', icon: <SiNetlify size={32} color="#00C7B7" /> },
    { name: 'Turborepo', icon: <SiTurborepo size={32} color="#00C7B7" /> },
    { name: 'Monorepo', icon: <SiMoonrepo size={32} color="#FF6C37" /> },
  
    // **Version Control**
    { name: 'Git', icon: <FaGit size={32} color="#F05032" /> },
  
    // **Others**
    { name: 'Recoil', icon: <SiRecoil size={32} color="#764ABC" /> },
    { name: 'NextAuth', icon: <SiLinux size={32} color="#FF6C37" /> },
    { name: 'RESTful APIs', icon: <SiPostman size={32} color="#FF6C37" /> },

    
  ];
  

  return (
    <Element
      name="skills"
      className="min-h-screen py-32 relative overflow-hidden bg-gradient-to-br from-orange-100 via-white to-orange-100"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-orange-400/5 to-pink-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, -20, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 bg-gradient-to-br from-orange-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent tracking-tight relative">
            Skills & Tools
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-400 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: '10rem' }}
              transition={{ duration: 0.8 }}
            />
          </h2>

        </motion.div>

        <motion.div
          className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -5, scale: 1.1 }}
              className="group"
            >
              <motion.div
                className="bg-white/80 backdrop-blur-lg p-6 rounded-full shadow-lg border border-white/30 hover:border-orange-200/50 hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center gap-3"
                whileHover={{ scale: 1.1 }}
                title={skill.name}
              >
                <motion.div
                  className="text-3xl md:text-4xl text-gray-700 transition-colors duration-200 group-hover:text-orange-500"
                >
                  {skill.icon}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Element>
  )
}

export default Skills
