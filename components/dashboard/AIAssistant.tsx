'use client';

import { useState, useEffect } from 'react';
import { ChocolateChatClient, ChatMessage } from '@/utils/chat-client';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Bot, Send, AlertCircle, RefreshCw, Volume2, Pause } from 'lucide-react';

export default function AIAssistant() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatAvailable, setChatAvailable] = useState(false);
  const [checking, setChecking] = useState(true);
  const [ttsLoading, setTtsLoading] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<{ id: string; audio: HTMLAudioElement } | null>(null);

  // TODO: Move this to environment variables
  const INWORLD_API_KEY = 'b1lXVXAyYjdRTkxwVGlUWDJSTGtNYnBIWlVMdzZBZnc6MkxwZnZHWmFnMFdqVHJ4M0pFR1JJU1pIbEpBZnB3UlpLc0UzWjNNalYyTk96S1FTNnhIamNsbFM1OXBNVGhvaQ==';

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

  const playTextToSpeech = async (text: string, messageId: string) => {
    // If clicking on the same audio that's playing, pause/resume it
    if (currentAudio && currentAudio.id === messageId) {
      if (currentAudio.audio.paused) {
        currentAudio.audio.play();
      } else {
        currentAudio.audio.pause();
      }
      return;
    }

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.audio.pause();
      currentAudio.audio.currentTime = 0;
      setCurrentAudio(null);
    }

    setTtsLoading(messageId);
    try {
      const response = await fetch('https://api.inworld.ai/tts/v1/voice', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${INWORLD_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          voiceId: 'Ashley',
          modelId: 'inworld-tts-1'
        })
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const result = await response.json();
      const audioContent = atob(result.audioContent);
      const audioArray = new Uint8Array(audioContent.length);
      
      for (let i = 0; i < audioContent.length; i++) {
        audioArray[i] = audioContent.charCodeAt(i);
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Set up event listeners before playing
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
        setCurrentAudio(null);
      });

      audio.addEventListener('pause', () => {
        if (currentAudio && currentAudio.id === messageId && audio.currentTime === audio.duration) {
          setCurrentAudio(null);
        }
      });

      // Store the audio instance
      setCurrentAudio({ id: messageId, audio });
      
      await audio.play();
      
    } catch (error) {
      console.error('Text-to-speech error:', error);
      alert('Failed to play text-to-speech. Please try again.');
    } finally {
      setTtsLoading(null);
    }
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
                <div className="!text-black flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Response time:</span>
                  <span className="!text-black font-medium">~2 seconds</span>
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
                        {msg.role === 'assistant' && (
                          <div className="mt-2 flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => playTextToSpeech(msg.content, `msg-${i}`)}
                              disabled={ttsLoading === `msg-${i}`}
                              className="!text-gray-600 hover:!text-gray-800 p-1"
                              title="Listen to this message"
                            >
                              {ttsLoading === `msg-${i}` ? (
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                              ) : currentAudio && currentAudio.id === `msg-${i}` && !currentAudio.audio.paused ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        )}
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
                  className="!text-black flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
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
                    question === "I'd like to place an order" ? (
                      <div key={i} className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setChatInput(question)}
                          className="!text-black"
                        >
                          {question}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playTextToSpeech(question, 'sample-order')}
                          disabled={ttsLoading === 'sample-order'}
                          className="!text-black px-2"
                          title="Text to Speech"
                        >
                          {ttsLoading === 'sample-order' ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : currentAudio && currentAudio.id === 'sample-order' && !currentAudio.audio.paused ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => setChatInput(question)}
                        className="!text-black"
                      >
                        {question}
                      </Button>
                    )
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
              <select className="!text-black w-full p-2 border border-gray-300 rounded-lg">
                <option>Friendly & Helpful</option>
                <option>Professional</option>
                <option>Casual & Fun</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Special Instructions</label>
              <p className="text-sm text-gray-500 mb-2">Any specific guidelines for your AI?</p>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg !text-black"
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