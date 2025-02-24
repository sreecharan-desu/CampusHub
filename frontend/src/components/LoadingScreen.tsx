import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const LoadingScreen = () => {
  const [count, setCount] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col items-center justify-center z-50"
    >
      <div className="max-w-2xl w-full px-4 text-center space-y-8">
        {/* Minimal Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 text-sm"
        >
          connecting to sreecharan in {count}
        </motion.p>

        {/* Loading Animation */}
        <div className="relative">
          {/* Outer Ring */}
          <motion.div
            className="w-24 h-24 rounded-full border-4 border-orange-200 relative mx-auto"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Inner Ring */}
            <motion.div
              className="absolute inset-2 rounded-full border-4 border-orange-400"
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Center Dot */}
            <motion.div
              className="absolute inset-0 m-auto w-3 h-3 bg-orange-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          className="w-48 h-0.5 bg-orange-100 rounded-full mx-auto overflow-hidden"
        >
          <motion.div
            className="h-full bg-orange-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoadingScreen 