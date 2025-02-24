import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import { RiTwitterXFill } from "react-icons/ri";

const Hero = () => {
  return (
    <div
      id="home"
      className="relative w-full min-h-[100svh] overflow-hidden bg-gradient-to-br from-white to-gray-100 px-4 sm:px-6 lg:px-8"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 -right-16 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-1/4 -left-16 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative h-full flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent 
                      clip-diagonal transform -rotate-3 scale-110" />

        <div className="relative z-10 w-full sm:max-w-2xl lg:max-w-full xl:max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-6">
          {/* Greeting */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-600 font-medium"
          >
            They call me
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
          >
            <span className="text-orange-500">SREECHARAN</span>
          </motion.h1>

          {/* Role with Fixed Height */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-4xl font-semibold"
          >
            <div className="h-[50px] flex items-center">
              <TypeAnimation
                sequence={[
                  "Full Stack & DevOps engineer",
                  3000,
                  "CS Sophomore at RGUKT",
                  2000,
                  "Exploring new Technologies",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent"
              />
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="py-4 text-gray-600 text-lg sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl"
          >
            Full-stack developer passionate about creating impactful digital
            solutions. Bringing a unique blend of technical expertise and
            creative problem-solving to every project. Currently exploring
            DevOps and cloud technologies while pursuing my CS degree at RGUKT.
          </motion.p>

          {/* Location */}
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-gray-600 flex items-center gap-2"
          >
            <span className="text-orange-500">📍</span>
            SBI Road, Pamidipadu, Addanki, Andhra Pradesh, India
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 max-w-xs sm:max-w-none mx-auto sm:mx-0"
          >
            <motion.a
              href="mailto:sreecharan309@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-orange-500/25 text-center w-full sm:w-auto"
            >
              Get in Touch
            </motion.a>

            {/* Call Me button - only visible on mobile */}
            <motion.a
              href="tel:+916300625861"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="sm:hidden px-8 py-3 bg-white text-orange-500 rounded-full font-medium border-2 border-orange-500 hover:bg-orange-50 transition-colors duration-300 text-center w-full"
            >
              Call Me
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 pt-4"
          >
            {[
              { icon: FaGithub, link: "https://github.com/sreecharan-desu", label: "GitHub" },
              { icon: FaLinkedin, link: "https://linkedin.com/in/sreecharan-desu", label: "LinkedIn" },
              { icon: RiTwitterXFill, link: "https://x.com/sreecharandesu", label: "X (Twitter)" },
              { icon: FaYoutube, link: "https://www.youtube.com/@mrsreecharan", label: "YouTube" },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="group relative"
              >
                <social.icon className="text-2xl text-gray-600 hover:text-orange-500 transition-colors duration-300" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {social.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
