'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Coffee, Menu, X, ShoppingCart } from 'lucide-react'

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

export default function ShopNavigation({
  businessInfo,
  orderCount,
  onToggleOrderPanel
}: {
  businessInfo: BusinessInfo
  orderCount: number
  onToggleOrderPanel: () => void
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Coffee className="w-8 h-8 text-amber-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">{businessInfo.name}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors">Home</a>
            <a href="#menu" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors">Menu</a>
            <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors">Contact</a>
            
            {/* Orders Button */}
            <button
              onClick={onToggleOrderPanel}
              className="relative px-3 py-2 bg-white border border-amber-600 text-amber-600 rounded-full hover:bg-amber-600 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-1">
                <ShoppingCart className="w-4 h-4" />
                Orders
              </div>
              {orderCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {orderCount}
                </span>
              )}
            </button>

            {businessInfo.phone && (
              <a href={`tel:${businessInfo.phone}`} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-colors">
                Call Now
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col gap-4">
              <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors">Home</a>
              <a href="#menu" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors">Menu</a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors">Contact</a>
              <button
                onClick={onToggleOrderPanel}
                className="flex items-center gap-2 text-amber-600 border border-amber-600 px-3 py-2 rounded-full hover:bg-amber-600 hover:text-white transition-colors w-fit"
              >
                <ShoppingCart className="w-4 h-4" />
                Orders {orderCount > 0 && `(${orderCount})`}
              </button>
              {businessInfo.phone && (
                <a href={`tel:${businessInfo.phone}`} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-colors w-fit">
                  Call Now
                </a>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}