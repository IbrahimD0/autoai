'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, X, Send, MessageCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

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

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: string
}

function Chatbot({ 
  isOpen, 
  onClose, 
  businessInfo, 
  menuItems 
}: { 
  isOpen: boolean
  onClose: () => void
  businessInfo: BusinessInfo
  menuItems: MenuCategory[]
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: `Hi! Welcome to ${businessInfo.name}. I can help you with:\n\n• Our menu (${menuItems.reduce((sum, cat) => sum + cat.items.length, 0)} items)\n• Business hours\n• Location & contact info\n• Recommendations\n\nWhat would you like to know?`,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Menu inquiries
    if (message.includes("menu") || message.includes("food") || message.includes("drink")) {
      const categories = menuItems.map(cat => cat.category).join(", ")
      const totalItems = menuItems.reduce((sum, cat) => sum + cat.items.length, 0)
      
      // Provide more detailed menu information
      let response = `We have ${totalItems} items across these categories: ${categories}.\n\n`
      
      // Show a few items from each category
      menuItems.forEach(category => {
        const itemNames = category.items.slice(0, 3).map(item => `${item.name} (${item.price})`).join(", ")
        response += `${category.category.toUpperCase()}: ${itemNames}${category.items.length > 3 ? ', and more...' : ''}\n`
      })
      
      response += "\nYou can ask about specific categories (appetizers, main courses, specials) or items by name!"
      return response
    }
    
    // Hours inquiry
    if (message.includes("hour") || message.includes("open") || message.includes("close")) {
      return businessInfo.hours 
        ? `We're open ${businessInfo.hours}. We'd love to see you soon!`
        : "Please check our contact section for current hours."
    }
    
    // Location inquiry
    if (message.includes("location") || message.includes("address") || message.includes("where")) {
      return businessInfo.address 
        ? `You can find us at ${businessInfo.address}.`
        : "Please check our contact section for our address."
    }
    
    // Contact inquiry
    if (message.includes("phone") || message.includes("call") || message.includes("contact")) {
      const contact = []
      if (businessInfo.phone) contact.push(`Phone: ${businessInfo.phone}`)
      if (businessInfo.email) contact.push(`Email: ${businessInfo.email}`)
      return contact.length > 0 
        ? `You can reach us at: ${contact.join(", ")}`
        : "Please check our contact section for contact information."
    }
    
    // Price inquiries
    if (message.includes("price") || message.includes("cost") || message.includes("$")) {
      const allItems = menuItems.flatMap(cat => cat.items)
      const prices = allItems.map(item => parseFloat(item.price.replace('$', ''))).filter(p => !isNaN(p))
      if (prices.length > 0) {
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)
        return `Our items range from $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}. What specific item would you like to know about?`
      }
      return "Please check our menu section for current pricing."
    }
    
    // Category-specific inquiries
    if (message.includes("appetizer") || message.includes("starter")) {
      const appetizers = menuItems.find(cat => cat.category.toLowerCase().includes("appetizer"))
      if (appetizers) {
        const items = appetizers.items.map(item => `${item.name} (${item.price})`).join(", ")
        return `Our appetizers include: ${items}. Which one interests you?`
      }
    }
    
    if (message.includes("main") || message.includes("entree")) {
      const mains = menuItems.find(cat => cat.category.toLowerCase().includes("main"))
      if (mains) {
        const items = mains.items.map(item => `${item.name} (${item.price})`).join(", ")
        return `Our main courses include: ${items}. Would you like details about any of these?`
      }
    }
    
    if (message.includes("special")) {
      const specials = menuItems.find(cat => cat.category.toLowerCase().includes("special"))
      if (specials) {
        const items = specials.items.map(item => `${item.name} (${item.price})`).join(", ")
        return `Today's specials are: ${items}. What would you like to know more about?`
      }
    }
    
    // Specific item search
    const allItems = menuItems.flatMap(cat => cat.items)
    const foundItem = allItems.find(item => {
      const itemWords = item.name.toLowerCase().split(' ')
      return itemWords.some(word => message.includes(word) && word.length > 3) || 
             message.includes(item.name.toLowerCase())
    })
    
    if (foundItem) {
      let response = `${foundItem.name} - ${foundItem.price}`
      if (foundItem.description) {
        response += `\n\n${foundItem.description}`
      }
      return response
    }
    
    // Recommendations
    if (message.includes("recommend") || message.includes("popular") || message.includes("best")) {
      const recommendations = allItems.slice(0, 3)
      let response = "I recommend trying:\n\n"
      recommendations.forEach(item => {
        response += `• ${item.name} (${item.price})`
        if (item.description) {
          response += ` - ${item.description.substring(0, 50)}...`
        }
        response += "\n"
      })
      return response
    }
    
    // Default response
    return `I'd be happy to help! I can tell you about our menu items, hours, location, or answer any other questions. What would you like to know about ${businessInfo.name}?`
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")

    // Generate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-4 right-4 w-80 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Shop Assistant</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Online now</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] p-3 rounded-lg text-sm",
                message.sender === "user"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={cn(
                "text-xs mt-1",
                message.sender === "user" ? "text-white/70" : "text-gray-500"
              )}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about our menu, hours..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-800 dark:text-gray-100"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function ShopChatbot({ 
  businessInfo, 
  menuItems 
}: { 
  businessInfo: BusinessInfo
  menuItems: MenuCategory[] 
}) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chatbot */}
      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        businessInfo={businessInfo}
        menuItems={menuItems}
      />
    </>
  )
}