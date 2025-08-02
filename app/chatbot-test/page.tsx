'use client';

import { ChatBot } from '@/components/ui/ChatBot';

export default function ChatBotTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-amber-900">
            AutoAI - Chocolate Shop Assistant Testing
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Test the Chocolate Shop AI Assistant
          </h2>
          <p className="text-gray-600">
            Try asking about chocolates, placing orders, or getting recommendations!
          </p>
        </div>

        {/* ChatBot Component */}
        <ChatBot />

        {/* Test Scenarios */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Test Scenarios to Try:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• "Hi, I need chocolates for my anniversary tomorrow"</li>
            <li>• "What's the difference between dark and milk chocolate?"</li>
            <li>• "I want to order a gift box for my mom's birthday"</li>
            <li>• "Do you have any sugar-free options?"</li>
            <li>• "What chocolates pair well with red wine?"</li>
            <li>• "I need 50 chocolate favors for a wedding"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}