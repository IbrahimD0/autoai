'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Heart, Plus } from 'lucide-react'
import { cn } from '@/utils/cn'

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

export default function MenuSection({ menuItems, onAddItem }: { menuItems: MenuCategory[], onAddItem: (item: MenuItem) => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredItems = menuItems.flatMap(category => 
    category.items.filter(item => 
      (selectedCategory === "all" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Our Menu</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our carefully crafted selection
          </p>
        </motion.div>

        {/* Search and filter */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                selectedCategory === "all"
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              All Items
            </button>
            {menuItems.map((category) => (
              <button
                key={category.category}
                onClick={() => setSelectedCategory(category.category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  selectedCategory === category.category
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {category.category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No items found matching your search.</p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={`${item.category}-${item.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:scale-105"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-lg font-bold text-amber-600">{item.price}</span>
                </div>
                {item.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                    {item.category}
                  </span>
                  <button
                    onClick={() => onAddItem(item)}
                    className="text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}