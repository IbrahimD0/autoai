'use client';

import { useState, useEffect } from 'react';
import { ChocolateChatClient, ChatMessage } from '@/utils/chat-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, AlertCircle, RefreshCw } from 'lucide-react';

export default function AIAssistant() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatAvailable, setChatAvailable] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkChatAvailability();
  }, []);

  const checkChatAvailability = async () => {
    setChecking(true);
    const availability = await ChocolateChatClient.checkAvailability();
    setChatAvailable(availability.available);
    if (availability.available && availability.shopName) {
      setChatMessages([ChocolateChatClient.getWelcomeMessage(availability.shopName)]);
    }
    setChecking(false);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const newMessages = ChocolateChatClient.addMessage(chatMessages, 'user', chatInput);
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);

    const response = await ChocolateChatClient.sendMessage(newMessages);
    
    if (response.error) {
      alert(`Error: ${response.error}`);
    } else {
      setChatMessages(ChocolateChatClient.addMessage(
        newMessages, 
        'assistant', 
        response.response
      ));

      if (response.orderId) {
        alert(`Order placed successfully! Order ID: ${response.orderId}`);
      }
    }

    setChatLoading(false);
  };

  const resetChat = () => {
    setChatMessages([ChocolateChatClient.getWelcomeMessage('Your Restaurant')]);
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Checking AI assistant status...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Assistant Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-amber-600" />
              AI Assistant Configuration
            </span>
            <Badge className={chatAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {chatAvailable ? 'Active' : 'Inactive'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chatAvailable ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Your AI assistant is ready to help customers with menu questions, 
                recommendations, and order placement.
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Response time:</span>
                  <span className="font-medium">~2 seconds</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">Upload a menu first to activate your AI assistant</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {chatAvailable && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Test Your AI Assistant</span>
              <Button
                onClick={resetChat}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                      <div className={`rounded-lg p-3 ${
                        msg.role === 'user' 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                      <p className={`text-xs mt-1 ${
                        msg.role === 'user' ? 'text-right' : 'text-left'
                      } text-gray-500`}>
                        {msg.role === 'user' ? 'Customer' : 'AI Assistant'}
                      </p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Test a customer question..."
                  disabled={chatLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                />
                <Button
                  onClick={sendChatMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Sample Questions */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Try these sample questions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "What's on your menu?",
                    "Do you have any specials?",
                    "What's good for someone with allergies?",
                    "I'd like to place an order"
                  ].map((question, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => setChatInput(question)}
                      className="text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Assistant Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Response Style</label>
              <p className="text-sm text-gray-500 mb-2">How should your AI assistant communicate?</p>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>Friendly & Helpful</option>
                <option>Professional</option>
                <option>Casual & Fun</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Special Instructions</label>
              <p className="text-sm text-gray-500 mb-2">Any specific guidelines for your AI?</p>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="E.g., Always mention our daily specials, emphasize organic ingredients..."
              />
            </div>
            <Button className="w-full">Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}