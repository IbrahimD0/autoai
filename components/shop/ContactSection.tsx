'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Facebook, Instagram, Twitter } from 'lucide-react'

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

export default function ContactSection({ businessInfo }: { businessInfo: BusinessInfo }) {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Visit Us</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            We'd love to welcome you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {businessInfo.address && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h3>
                    <p className="text-gray-600 dark:text-gray-400">{businessInfo.address}</p>
                  </div>
                </div>
              </div>
            )}

            {businessInfo.hours && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hours</h3>
                    <p className="text-gray-600 dark:text-gray-400">{businessInfo.hours}</p>
                  </div>
                </div>
              </div>
            )}

            {(businessInfo.phone || businessInfo.email) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact</h3>
                    {businessInfo.phone && <p className="text-gray-600 dark:text-gray-400">{businessInfo.phone}</p>}
                    {businessInfo.email && <p className="text-gray-600 dark:text-gray-400">{businessInfo.email}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Social Media */}
            {businessInfo.socialMedia && Object.keys(businessInfo.socialMedia).length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {businessInfo.socialMedia.facebook && (
                    <a href={businessInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {businessInfo.socialMedia.instagram && (
                    <a href={businessInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:from-purple-600 hover:to-pink-600 transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {businessInfo.socialMedia.twitter && (
                    <a href={businessInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="w-full h-96 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interactive Map</h3>
                <p className="text-gray-600 dark:text-gray-400">Click to view directions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}