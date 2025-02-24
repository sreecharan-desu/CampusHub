import { useRef, useState } from 'react'
import { Element } from 'react-scroll'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

interface GitHubData {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
}

interface Project {
  title: string;
  description: string;
  liveUrl: string;
  githubUrl: string;
  tech: string[];
  image: string;
  repoName: string;
  githubData?: GitHubData;
}

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const isEven = index % 2 === 0

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const x = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [isEven ? -100 : 100, 0, 0, isEven ? -100 : 100]
  )

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, x }}
      className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-20 
                 p-8 rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-white/95
                 backdrop-blur-xl border border-white/40 
                 hover:shadow-2xl hover:shadow-orange-500/30 
                 hover:border-orange-200/50
                 transition-all duration-500 relative overflow-hidden group 
                 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
    >
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-orange-100/30 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated Border Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-orange-500/20 
                    opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

      {/* Project Image Section */}
      <motion.div 
        className="w-full lg:w-3/5 perspective-2000 mb-8 lg:mb-0"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className="relative group rounded-2xl shadow-2xl transform-gpu overflow-hidden
                     aspect-video sm:aspect-[16/10]"
          animate={{
            rotateY: isHovered ? (isEven ? 12 : -12) : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full ${project.title == "GitSeek" ? `object-fill` : `object-cover`} object-center rounded-xl 
                      transform transition-transform duration-700 group-hover:scale-110`}
          />

          {/* Enhanced Project Links Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80
                      backdrop-blur-sm flex items-center justify-center gap-8 opacity-0 
                      group-hover:opacity-100 transition-all duration-500"
          >
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 bg-white/90 rounded-full text-gray-900 hover:text-orange-500 
                        hover:bg-white transition-all duration-300 transform-gpu"
            >
              <FaExternalLinkAlt className="text-xl sm:text-2xl" />
            </motion.a>
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 bg-white/90 rounded-full text-gray-900 hover:text-orange-500 
                        hover:bg-white transition-all duration-300 transform-gpu"
            >
              <FaGithub className="text-xl sm:text-2xl" />
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Project Info Section */}
      <motion.div 
        className="w-full lg:w-2/5 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <motion.h3 
          className={`text-4xl sm:text-5xl md:text-6xl ${project.title == "CampusSchield" ? `lg:text-6xl` : `lg:text-7xl` } font-bold text-center lg:text-left 
                     bg-gradient-to-br from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent
                     tracking-tight leading-none`}
          whileHover={{ scale: 1.02 }}
        >
          {project.title}
        </motion.h3>
        
        <p className="text-gray-600 text-lg leading-relaxed font-medium">
          {project.description}
        </p>
        
        {/* Enhanced Tech Stack Display */}
        <motion.div 
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {project.tech.map((tech, index) => (
            <motion.span
              key={index}
              className="px-6 py-3 bg-gradient-to-br from-orange-50 via-white to-orange-100 
                       rounded-full text-sm font-semibold text-orange-600
                       border border-orange-200/50 shadow-lg shadow-orange-100/50
                       hover:shadow-orange-300/50 hover:border-orange-300/50
                       transition-all duration-300"
              whileHover={{ scale: 1.1, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const Projects = () => {
  const projects: Project[] = [
    {
      title: "UniZ",
      description: "Emerging university management system with advanced Outpass Management features.",
      liveUrl: "https://sreesuniz.vercel.app/student", 
      githubUrl: "https://github.com/sreecharan-desu/uniZ",
      tech: ["TypeScript", "Prisma", "React", "Node.js"],
      image: "/project-images/uniZ.png",
      repoName: "uniZ"
    },
    {
      title: "reX",
      description: "An online reward exchange platform.",
      liveUrl: "https://rex-beige.vercel.app/",
      githubUrl: "https://github.com/sreecharan-desu/reX",
      tech: ["TypeScript", "React", "Express", "MongoDB"],
      image: "/project-images/reX.png",
      repoName: "reX"
    },
    {
      title: "TaskMaster", 
      description: "A full-stack todo application with real-time updates and secure authentication.",
      liveUrl: "https://task-master-black.vercel.app/",
      githubUrl: "https://github.com/sreecharan-desu/TaskMaster",
      tech: ["React", "Node.js", "MongoDB", "JWT"],
      image: "/project-images/taskmaster.png",
      repoName: "TaskMaster"
    },
    {
      title: "ChromaPost",
      description: "An online ad generator built with modern web technologies.",
      liveUrl: "https://chromapost.vercel.app/",
      githubUrl: "https://github.com/sreecharan-desu/ChromaPost",
      tech: ["React", "TypeScript", "Vite", "TailwindCSS"],
      image: "/project-images/chromapost.png",
      repoName: "ChromaPost"
    },
    {
      title: "StudySpace", 
      description: "Platform for students to join study groups and collaborate offline.",
      liveUrl: "https://studyspace-exp.vercel.app/",
      githubUrl: "https://github.com/sreecharan-desu/Studyspace",
      tech: ["TypeScript", "React", "Recoil", "TailwindCSS"],
      image: "/project-images/studyspace.png",
      repoName: "Studyspace"
    },
    {
      title: "GradeLite",
      description: "A grade management and visualization tool for students.",
      liveUrl: "https://sreecharan-desu.github.io/Gradelite/#GradeLite",
      githubUrl: "https://github.com/sreecharan-desu/Gradelite",
      tech: ["JavaScript", "HTML", "CSS"],
      image: "/project-images/gradelite.png",
      repoName: "Gradelite"
    },
    {
      title: "CampusSchield", 
      description: "A safety companion for university students with low confidence (Introverts).",
      liveUrl: "https://campus-schield-frontend.vercel.app/",
      githubUrl: "https://github.com/sreecharan-desu/Campusschield-v.1.0.2",
      tech: ["React","Javascript" , "Node.js" , "Express" ,"TailwindCSS","MongoDB"],
      image: "/project-images/campusschield.png",
      repoName: "Campusschield-v.1.0.2"
    },
    {
      title: "echo.ink", 
      description: "A basic funtional blogging application - powered with hono & cloudflare workers",
      liveUrl: "https://srees-echoink.vercel.app/",
      githubUrl: "https://github.com/sreecharan-desu/echo.ink",
      tech: ["React","Typescript" ,"TailwindCSS", "Hono" , "Cloudflare workers" ,"Prisma","Postgress","NeonDB"],
      image: "/project-images/echo.ink.png",
      repoName: "echo.ink"
    },
    {
      title: "GitSeek", 
      description: "GitSeeker is a GitHub profile searcher that allows users to search for GitHub profiles",
      liveUrl: "https://gitseek.vercel.app/",
      githubUrl: "https://github.com/sreecharan-desu/Gitseek",
      tech: ["React","Typescript" , "TailwindCSS","Github API"],
      image: "/project-images/gitseek.png",
      repoName: "Gitseek"
    }
  ]

  return (
    <Element name="projects" className="min-h-screen py-32 relative overflow-hidden bg-gradient-to-br from-orange-50/50 via-white to-orange-100/30">
      {/* Enhanced Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-white" />
      
      {/* Enhanced Ambient Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -right-32 w-[800px] h-[800px] 
                     bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="absolute -bottom-32 -left-32 w-[600px] h-[600px] 
                     bg-gradient-to-tr from-orange-400/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     w-[700px] h-[700px] bg-gradient-to-r from-orange-300/10 to-yellow-300/10 
                     rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-7xl md:text-8xl font-bold text-center mb-32 
                     bg-gradient-to-br from-orange-500 via-orange-600 to-orange-500 
                     bg-clip-text text-transparent tracking-tight relative z-10"
        >
          Projects
          <motion.div 
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-2 
                      bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: '8rem' }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </motion.h2>

        <div className="space-y-48 md:space-y-64 relative z-10">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.title} 
              project={project} 
              index={index} 
            />
          ))}
        </div>
      </div>

      {/* Enhanced Glass Effect Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[100px] pointer-events-none" />
    </Element>
  )
}

export default Projects