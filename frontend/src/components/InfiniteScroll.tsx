import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Projects from './Projects'

const InfiniteScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -contentHeight/2]),
    { damping: 15, stiffness: 150 }
  )
  console.log(scrollPosition)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      const scroll = containerRef.current.scrollTop
      const height = containerRef.current.scrollHeight - window.innerHeight
      
      // Reset scroll position when reaching bottom
      if (scroll >= height * 0.8) {
        containerRef.current.scrollTop = height * 0.2
      }
      // Reset scroll position when reaching top
      if (scroll <= height * 0.2) {
        containerRef.current.scrollTop = height * 0.8
      }
      
      setScrollPosition(scroll)
    }

    const updateContentHeight = () => {
      if (containerRef.current) {
        setContentHeight(containerRef.current.scrollHeight)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      updateContentHeight()
      // Set initial scroll position
      container.scrollTop = container.scrollHeight * 0.2
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const sections = [
    <Hero key="hero" />,
    <About key="about" />,
    <Skills key="skills" />,
    <Projects key="projects" />,
    // <Contact key="contact" />
  ]

  // Create multiple copies of sections for infinite effect
  const multipliedSections = [...sections, ...sections, ...sections, ...sections]

  return (
    <div 
      ref={containerRef} 
      className="h-screen overflow-y-auto overflow-x-hidden bg-dark scroll-smooth"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      <motion.div
        style={{ y }}
        className="relative w-full"
      >
        {multipliedSections.map((section, index) => (
          <div 
            key={index}
            className="min-h-screen scroll-snap-align-start"
            style={{ scrollSnapAlign: 'start' }}
          >
            {section}
          </div>
        ))}
      </motion.div>

      {/* Smooth gradient overlays */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-dark to-transparent pointer-events-none z-50" />
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-dark to-transparent pointer-events-none z-50" />

      <style>{`
        ::-webkit-scrollbar {
          width: 0;
          background: transparent;
        }
      `}</style>
    </div>
  )
}

export default InfiniteScroll 