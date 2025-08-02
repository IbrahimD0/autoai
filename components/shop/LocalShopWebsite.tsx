'use client'

import React from 'react'
import HeroSection from './HeroSection'
import MenuSection from './MenuSection'
import ContactSection from './ContactSection'
import ShopNavigation from './ShopNavigation'
import ShopChatbot from './ShopChatbot'
import ShopFooter from './ShopFooter'

// Business data interface
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

interface MenuItem {
  name: string
  price: string
  description?: string
  category: string
}

interface MenuCategory {
  category: string
  items: MenuItem[]
}

interface LocalShopWebsiteProps {
  businessInfo: BusinessInfo
  menuItems: MenuCategory[]
}

export default function LocalShopWebsite({ businessInfo, menuItems }: LocalShopWebsiteProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ShopNavigation businessInfo={businessInfo} />
      
      {/* Main Content */}
      <main>
        <div id="home">
          <HeroSection businessInfo={businessInfo} />
        </div>
        <div id="menu">
          <MenuSection menuItems={menuItems} />
        </div>
        <div id="contact">
          <ContactSection businessInfo={businessInfo} />
        </div>
      </main>

      {/* Chatbot */}
      <ShopChatbot businessInfo={businessInfo} menuItems={menuItems} />

      {/* Footer */}
      <ShopFooter businessInfo={businessInfo} />
    </div>
  )
}