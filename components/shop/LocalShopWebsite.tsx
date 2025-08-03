'use client'

import React, { useState } from 'react'
import HeroSection from './HeroSection'
import MenuSection from './MenuSection'
import ContactSection from './ContactSection'
import ShopNavigation from './ShopNavigation'
import ShopChatbot from './ShopChatbot'
import ShopFooter from './ShopFooter'
import OrderPanel from './Order'

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
  const [orderItems, setOrderItems] = useState<MenuItem[]>([])
  const [isOrderPanelOpen, setIsOrderPanelOpen] = useState(false)

  const handleAddItemToOrder = (item: MenuItem) => {
    setOrderItems(prev => [...prev, item])
  }

  const handleToggleOrderPanel = () => {
    setIsOrderPanelOpen(prev => !prev)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ShopNavigation 
        businessInfo={businessInfo} 
        orderCount={orderItems.length} 
        onToggleOrderPanel={handleToggleOrderPanel} 
      />

      {/* Main Content */}
      <main>
        <div id="home">
          <HeroSection businessInfo={businessInfo} />
        </div>
        <div id="menu">
          <MenuSection menuItems={menuItems} onAddItem={handleAddItemToOrder} />
        </div>
        <div id="contact">
          <ContactSection businessInfo={businessInfo} />
        </div>
      </main>

      {isOrderPanelOpen && <OrderPanel menu={orderItems} />}

      {/* Chatbot */}
      <ShopChatbot businessInfo={businessInfo} menuItems={menuItems} />

      {/* Footer */}
      <ShopFooter businessInfo={businessInfo} />
    </div>
  )
}