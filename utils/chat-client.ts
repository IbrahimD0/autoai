// Client-side utility for chocolate shop AI chat
// This can be easily integrated into any UI component

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: string;
  orderDetails?: any;
  orderId?: string;
  message?: string;
  error?: string;
}

export interface ChatAvailability {
  available: boolean;
  shopName?: string;
  menuItemCount?: number;
  reason?: string;
}

export class ChocolateChatClient {
  // Check if chat is available (shop exists and has menu items)
  static async checkAvailability(): Promise<ChatAvailability> {
    try {
      const response = await fetch('/api/chat', {
        method: 'GET',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking chat availability:', error);
      return {
        available: false,
        reason: 'Network error'
      };
    }
  }

  // Send messages to the AI assistant
  static async sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          response: '',
          error: data.error || 'Failed to send message'
        };
      }

      return data;
    } catch (error) {
      console.error('Chat error:', error);
      return {
        response: '',
        error: 'Network error. Please try again.'
      };
    }
  }

  // Helper to add a new message to conversation
  static addMessage(
    messages: ChatMessage[], 
    role: 'user' | 'assistant', 
    content: string
  ): ChatMessage[] {
    return [...messages, { role, content }];
  }

  // Generate a welcome message
  static getWelcomeMessage(shopName: string = 'our restaurant'): ChatMessage {
    return {
      role: 'assistant',
      content: `Welcome to ${shopName}! I'm your AI assistant. How can I help you today? 

I can:
- Help you explore our menu
- Take your order for pickup or delivery
- Answer questions about ingredients and allergens
- Make recommendations based on your preferences
- Handle dietary restrictions and special requests

What would you like to know about our menu?`
    };
  }
}

// Example usage in a React component:
/*
import { useState, useEffect } from 'react';
import { ChocolateChatClient, ChatMessage } from '@/utils/chat-client';

function ChocolateChatComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    // Check if chat is available
    ChocolateChatClient.checkAvailability().then(result => {
      setAvailable(result.available);
      if (result.available && result.shopName) {
        // Add welcome message
        setMessages([ChocolateChatClient.getWelcomeMessage(result.shopName)]);
      }
    });
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // Add user message
    const newMessages = ChocolateChatClient.addMessage(messages, 'user', input);
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Send to AI
    const response = await ChocolateChatClient.sendMessage(newMessages);
    
    if (response.error) {
      alert(`Error: ${response.error}`);
    } else {
      // Add AI response
      setMessages(ChocolateChatClient.addMessage(
        newMessages, 
        'assistant', 
        response.response
      ));

      // If order was placed, show confirmation
      if (response.orderId) {
        alert(`Order placed successfully! Order ID: ${response.orderId}`);
      }
    }

    setLoading(false);
  };

  if (!available) {
    return <div>Chat not available. Please upload a menu first.</div>;
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about our chocolates..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
*/