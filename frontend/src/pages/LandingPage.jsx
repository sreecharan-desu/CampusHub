import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigateTo = useNavigate();
  
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-auto">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-violet-800 via-indigo-700 to-blue-800 opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Animated mesh gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-[url('/mesh-gradient.svg')] bg-cover mix-blend-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      
      {/* Content container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Hero Section */}
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="relative w-24 h-24 mx-auto mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <img
              src="/vite.svg"
              alt="CampusHub Logo"
              className="absolute inset-0 w-full h-full drop-shadow-glow"
            />
            <motion.div 
              className="absolute inset-0 bg-blue-500 rounded-full filter blur-xl opacity-60"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-black tracking-tight text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
              CAMPUS
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
              HUB
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl mt-4 text-blue-100 font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Your All-in-One Campus Event Manager
          </motion.p>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 1 } },
          }}
        >
          {[
            { 
              title: "Discover Events", 
              icon: "🔍", 
              description: "Find campus events that match your interests" 
            },
            { 
              title: "Register Instantly", 
              icon: "✨", 
              description: "One-click registration for any event" 
            },
            { 
              title: "Track Attendance", 
              icon: "📊", 
              description: "Manage your event schedule effortlessly" 
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="backdrop-blur-lg bg-white/10 p-8 rounded-3xl border border-white/20 shadow-glow flex flex-col items-center hover:bg-white/15 transition-all duration-300"
              variants={slideUp}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.span 
                className="text-5xl mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
              >
                {feature.icon}
              </motion.span>
              <h2 className="text-2xl font-bold text-white mb-2">{feature.title}</h2>
              <p className="text-blue-100 text-center opacity-80">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <motion.button
            className="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 px-10 py-4 rounded-full font-bold text-xl shadow-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateTo("/signin")}
          >
            <motion.span 
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8 }}
            />
            <span className="relative z-10">Get Started Now</span>
          </motion.button>
          
          <motion.p
            className="mt-5 text-blue-200 opacity-70 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
          >
            Join thousands of students already using CampusHub
          </motion.p>
        </motion.div>
      </div>

      {/* Floating animated shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-md border border-white/20"
          style={{
            width: Math.random() * 80 + 40,
            height: Math.random() * 80 + 40,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0],
          }}
          transition={{ 
            scale: { duration: 1, delay: i * 0.2 },
            x: { duration: 10 + i * 5, repeat: Infinity, repeatType: "reverse" },
            y: { duration: 15 + i * 5, repeat: Infinity, repeatType: "reverse" },
          }}
        />
      ))}
    </div>
  );
}