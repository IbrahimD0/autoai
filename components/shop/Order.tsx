'use client'

import { useState } from 'react'
import { ShoppingCart, Trash2, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface MenuItem {
  name: string
  price: string
}

export default function OrderPanel({ menu }: { menu: MenuItem[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [order, setOrder] = useState<Record<string, number>>({})

  const addToOrder = (item: string) => {
    setOrder((prev) => ({
      ...prev,
      [item]: (prev[item] || 0) + 1
    }))
  }

  const removeItem = (item: string) => {
    setOrder((prev) => {
      const updated = { ...prev }
      delete updated[item]
      return updated
    })
  }

  const total = Object.entries(order).reduce((sum, [item, qty]) => {
    const price = parseFloat(menu.find(m => m.name === item)?.price.replace('$', '') || '0')
    return sum + price * qty
  }, 0)

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full shadow-lg flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
      </motion.button>

      {/* Order Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 left-4 w-80 max-h-[70vh] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 overflow-y-auto"
        >
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">🛒 Your Order</h3>
            {Object.keys(order).length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No items added yet.</p>
            )}
          </div>

          <div className="flex-1 p-4 space-y-3">
            {Object.entries(order).map(([item, qty]) => {
              const price = parseFloat(menu.find(m => m.name === item)?.price.replace('$', '') || '0')
              return (
                <div key={item} className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <div>
                    <p className="font-semibold text-black dark:text-white">{item}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {qty} — ${(price * qty).toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeItem(item)}>
                    <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                  </button>
                </div>
              )
            })}
          </div>

          {Object.keys(order).length > 0 && (
            <div className="p-4 border-t dark:border-gray-700">
              <p className="font-semibold text-black dark:text-white">Total: ${total.toFixed(2)}</p>
            </div>
          )}
        </motion.div>
      )}
    </>
  )
}
