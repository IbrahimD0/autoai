'use client'

import React from 'react'
import { Coffee, Facebook, Instagram, Twitter } from 'lucide-react'

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

export default function ShopFooter({ businessInfo }: { businessInfo: BusinessInfo }) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-8 h-8 text-amber-500" />
              <span className="text-xl font-bold">{businessInfo.name}</span>
            </div>
            {businessInfo.tagline && (
              <p className="text-gray-400 mb-4">{businessInfo.tagline}</p>
            )}
            <div className="flex gap-4">
              {businessInfo.socialMedia?.facebook && (
                <a href={businessInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {businessInfo.socialMedia?.instagram && (
                <a href={businessInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {businessInfo.socialMedia?.twitter && (
                <a href={businessInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#home" className="block text-gray-400 hover:text-white transition-colors">Home</a>
              <a href="#menu" className="block text-gray-400 hover:text-white transition-colors">Menu</a>
              <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              {businessInfo.address && <p>{businessInfo.address}</p>}
              {businessInfo.phone && <p>{businessInfo.phone}</p>}
              {businessInfo.email && <p>{businessInfo.email}</p>}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {businessInfo.name}. All rights reserved.</p>
          <p className="text-sm mt-2">Powered by AutoAI</p>
        </div>
      </div>
    </footer>
  )
}