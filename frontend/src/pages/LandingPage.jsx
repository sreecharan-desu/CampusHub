import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigateTo = useNavigate();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Key features data
  const features = [
    {
      title: "Event Discovery",
      icon: "🔍",
      description: "Browse through upcoming campus events in a clean, organized dashboard"
    },
    {
      title: "One-Click Registration",
      icon: "✓",
      description: "Register instantly and receive automated confirmation emails"
    },
    {
      title: "Event Creation",
      icon: "✏️",
      description: "Organizers can easily create and manage events with a simple form"
    },
    {
      title: "Smart Reminders",
      icon: "🔔",
      description: "Get timely notifications for events you've registered for"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <motion.nav
        className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/vite.svg" alt="CampusHub Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-gray-900">CampusHub</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium">How It Works</a>
            <button
              onClick={() => navigateTo("/signin")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
          <button className="md:hidden text-gray-700 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 z-0" />

        <motion.div
          className="absolute top-20 right-0 w-1/3 h-1/3 bg-blue-100 rounded-full filter blur-3xl opacity-60 z-0"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                Your Campus Events,
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  {" "}Simplified
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Discover, register, and manage campus events effortlessly.
                All in one beautifully designed platform.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <button
                  onClick={() => navigateTo("/signup")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg shadow-md hover:shadow-lg transition-all"
                >
                  Get Started
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <motion.section
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-8 md:px-10 md:py-12">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-inner"
              >
                <div className="h-8 bg-white/10 flex items-center px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
                    <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
                  </div>
                </div>
                <div className="p-4 bg-white/5">
                  <img
                    src="/dashboard-preview.png"
                    alt="CampusHub Dashboard Preview"
                    className="w-full rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/1200x675?text=CampusHub+Dashboard"
                      e.target.alt = "CampusHub Dashboard Placeholder"
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage campus events efficiently in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                initial="hidden"
                animate="visible"
                variants={slideUp}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started with CampusHub is simple and straightforward
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Create an Account",
                description: "Sign up with your email or campus credentials in seconds"
              },
              {
                step: "02",
                title: "Browse Events",
                description: "Explore upcoming events or create your own if you're an organizer"
              },
              {
                step: "03",
                title: "Register & Attend",
                description: "One-click registration and get reminders before events start"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + index * 0.2 }}
              >
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                  {item.step}
                </div>
                <div className={index < 2 ? "relative w-full hidden md:block" : "hidden"}>
                  <div className="absolute top-[-30px] left-[calc(50%+30px)] w-full h-[2px] bg-blue-100">
                    <div className="absolute right-0 top-[-4px] w-3 h-3 border-t-2 border-r-2 border-blue-100 transform rotate-45" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Ready to simplify campus events?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students and organizers already using CampusHub
            </p>
            <button
              onClick={() => navigateTo("/signup")}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium text-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
            >
              Get Started For Free
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}