import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingScreen from './components/LoadingScreen'
import ResumeButton from './components/ResumeButton'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Footer from './components/Footer'
import Timeline from './components/Timeline'
import YouTubeSection from './components/YouTubeSection'
import GitHubSection from './components/GitHubSection'

const App = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Timeline />
          <GitHubSection />
          <YouTubeSection/>
          <Footer />
          <ResumeButton />
        </>
      )}
    </ErrorBoundary>
  )
}

export default App