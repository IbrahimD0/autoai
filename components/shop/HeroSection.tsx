'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Coffee } from 'lucide-react'

interface BusinessInfo {
  name: string
  tagline: string
  description: string
  address: string
  phone: string
  email: string
  hours: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
}

export default function HeroSection({ businessInfo }: { businessInfo: BusinessInfo }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-amber-200/20 to-orange-200/20 blur-3xl"
        style={{ y: y1 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-orange-200/20 to-red-200/20 blur-3xl"
        style={{ y: y2 }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-amber-200 dark:border-gray-700 mb-6"
          >
            <Coffee className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Local Favorite</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent"
          >
            {businessInfo.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 font-light"
          >
            {businessInfo.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            {businessInfo.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a href="#menu" className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              View Menu
            </a>
            <a href="#contact" className="px-8 py-3 border-2 border-amber-500 text-amber-600 dark:text-amber-400 rounded-full font-medium hover:bg-amber-500 hover:text-white transition-all duration-300">
              Get Directions
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}