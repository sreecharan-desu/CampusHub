import { motion } from 'framer-motion'
import { Element } from 'react-scroll'
import { FaYoutube } from 'react-icons/fa'


const link = "https://www.youtube.com/watch?v=DhWCM4sYR_w"

const YouTubeSection = () => {
  // Extract video ID from the URL
  const videoId = new URL(link).searchParams.get('v') || link.split('v=')[1].split('&')[0];

  // Fallback to default if the ID cannot be found
  if (!videoId) {
    return <div className="text-center text-red-500">Invalid YouTube URL</div>;
  }

  // Use YouTube API to fetch title and description (optional)
  // In this example, I'll assume the title and description are passed along, but you can extend this if needed.

  return (
    <Element name="youtube" className="py-32 relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50">
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
            Featured Video
            <motion.div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 
                        bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: '8rem' }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </h2>
        </motion.div>

        {/* Single Featured Video Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden 
                         shadow-lg border border-white/20 hover:border-orange-200/50 
                         hover:shadow-orange-500/20 transition-all duration-300">
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Featured Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 
                     text-white px-8 py-4 rounded-full text-lg font-medium
                     hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaYoutube className="text-2xl" />
            Watch on YouTube
          </motion.a>
        </motion.div>
      </div>

      {/* Glass Effect Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[100px] pointer-events-none" />
    </Element>
  )
}

export default YouTubeSection;
