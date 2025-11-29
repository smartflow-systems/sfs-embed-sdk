/**
 * SFS Embed SDK - Enhanced Live Chat Widget
 * With AI assistant, rich media, voice messages, and file uploads
 */

import { useState, useEffect, useRef } from 'react';
import { AIAssistant, analyzeSentiment } from '../core/ai';
import type { ChatWidgetConfig } from '../types';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  type?: 'text' | 'image' | 'file' | 'voice';
  fileUrl?: string;
  fileName?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface EnhancedChatWidgetProps {
  config: ChatWidgetConfig;
  workspaceId: string;
  apiKey?: string;
  aiEnabled?: boolean;
}

export function EnhancedChatWidget({
  config,
  workspaceId,
  apiKey,
  aiEnabled = true,
}: EnhancedChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const aiAssistant = useRef<AIAssistant | null>(null);

  useEffect(() => {
    if (aiEnabled) {
      aiAssistant.current = new AIAssistant({
        enabled: true,
        systemPrompt: 'You are a helpful customer support assistant for SFS.',
      });

      // Send AI greeting when chat opens
      if (isOpen && messages.length === 0) {
        setTimeout(() => {
          addBotMessage("Hi there! 👋 I'm your AI assistant. How can I help you today?");
          setQuickReplies(['I have a question', 'I need help', 'Tell me about pricing']);
        }, 500);
      }
    }
  }, [aiEnabled, isOpen]);

  useEffect(() => {
    if (isOpen && !isConnected) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    const wsUrl = config.wsUrl || 'wss://ws.sfs.dev';
    const ws = new WebSocket(`${wsUrl}/chat?workspace=${workspaceId}`);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('Chat connected');

      ws.send(
        JSON.stringify({
          type: 'auth',
          apiKey,
          workspaceId,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'message':
          const newMessage: Message = {
            id: data.id,
            content: data.content,
            sender: data.sender,
            timestamp: new Date(data.timestamp),
            type: data.messageType || 'text',
            fileUrl: data.fileUrl,
            fileName: data.fileName,
          };
          setMessages((prev) => [...prev, newMessage]);

          if (!isOpen) {
            setUnreadCount((prev) => prev + 1);
          }
          break;

        case 'typing':
          setIsTyping(data.isTyping);
          break;

        case 'error':
          console.error('Chat error:', data.message);
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('Chat disconnected');
    };

    wsRef.current = ws;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (content: string, suggestions?: string[]) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages((prev) => [...prev, message]);

    if (suggestions) {
      setQuickReplies(suggestions);
    }
  };

  const sendMessage = async (e?: React.FormEvent, quickReply?: string) => {
    e?.preventDefault();

    const messageText = quickReply || inputValue;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      sentiment: analyzeSentiment(messageText).sentiment,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setQuickReplies([]);

    // Send to WebSocket if connected
    if (wsRef.current && isConnected) {
      wsRef.current.send(
        JSON.stringify({
          type: 'message',
          content: messageText,
          workspaceId,
        })
      );
    }

    // Get AI response if enabled
    if (aiEnabled && aiAssistant.current) {
      setIsTyping(true);

      // Simulate typing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const aiResponse = await aiAssistant.current.generateResponse(messageText);

      setIsTyping(false);
      addBotMessage(aiResponse.message, aiResponse.suggestions);

      // If requires human, notify
      if (aiResponse.requiresHuman) {
        setTimeout(() => {
          addBotMessage("I'm connecting you with a human agent now...");
        }, 1500);
      }
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(undefined, reply);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Create message with file
    const fileMessage: Message = {
      id: Date.now().toString(),
      content: `Uploaded ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      fileName: file.name,
      fileUrl: URL.createObjectURL(file), // In production, upload to cloud storage first
    };

    setMessages((prev) => [...prev, fileMessage]);
    setShowFilePicker(false);

    // Upload file to server
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', workspaceId);

    try {
      const response = await fetch('https://api.sfs.dev/upload', {
        method: 'POST',
        headers: {
          ...(apiKey && { 'X-SFS-API-Key': apiKey }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('File uploaded:', data.url);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        const voiceMessage: Message = {
          id: Date.now().toString(),
          content: 'Voice message',
          sender: 'user',
          timestamp: new Date(),
          type: 'voice',
          fileUrl: audioUrl,
        };

        setMessages((prev) => [...prev, voiceMessage]);

        // Upload voice message
        const file = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
        uploadFile(file);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone error:', error);
      alert('Could not access microphone');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const getSentimentEmoji = (sentiment?: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      default:
        return '';
    }
  };

  return (
    <>
      {/* Chat Button with pulsing animation */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="sfs-widget-button relative animate-pulse-slow"
          style={{
            bottom: config.position?.bottom || '20px',
            right: config.position?.right || '20px',
          }}
          aria-label="Open chat"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
          {aiEnabled && (
            <span className="absolute -bottom-1 -left-1 bg-purple-500 text-white text-xs font-bold rounded-full px-2 py-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
              AI
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="sfs-widget-card flex flex-col shadow-2xl"
          style={{
            bottom: config.position?.bottom || '20px',
            right: config.position?.right || '20px',
            width: '400px',
            height: '650px',
            maxHeight: 'calc(100vh - 40px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                {isConnected && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Support Chat</h3>
                <p className="text-xs opacity-90 flex items-center gap-1">
                  {isConnected ? (
                    <>
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      {aiEnabled ? 'AI Assistant Online' : 'Online'}
                    </>
                  ) : (
                    <>
                      <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
                      Connecting...
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors hover:rotate-90 transform duration-200"
              aria-label="Close chat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                } animate-slide-up`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-3 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : message.sender === 'bot'
                      ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-gray-800 border border-purple-200'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {message.type === 'image' && message.fileUrl && (
                    <img
                      src={message.fileUrl}
                      alt="Uploaded"
                      className="rounded-lg mb-2 max-w-full"
                    />
                  )}

                  {message.type === 'voice' && message.fileUrl && (
                    <audio controls className="mb-2 max-w-full">
                      <source src={message.fileUrl} type="audio/webm" />
                    </audio>
                  )}

                  {message.type === 'file' && (
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{message.fileName}</span>
                    </div>
                  )}

                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                    {message.sentiment && ` ${getSentimentEmoji(message.sentiment)}`}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <p
                      className={`text-xs ${
                        message.sender === 'user'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                    {message.sender === 'bot' && (
                      <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
                        AI
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {quickReplies.length > 0 && (
            <div className="px-4 py-2 border-t bg-gray-50 dark:bg-gray-900">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-4 border-t bg-white rounded-b-lg">
            {showFilePicker && (
              <div className="mb-2 flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                >
                  📎 Upload File
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                >
                  🖼️ Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilePicker(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilePicker(!showFilePicker)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Attach file"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                disabled={!isConnected && !aiEnabled}
              />

              {isRecording ? (
                <button
                  type="button"
                  onClick={stopVoiceRecording}
                  className="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors animate-pulse"
                  aria-label="Stop recording"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label="Voice message"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </button>

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || (!isConnected && !aiEnabled)}
                    className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </form>

          <p className="text-xs text-center text-gray-500 py-2 bg-gray-50">
            {aiEnabled && <span className="text-purple-600 font-semibold">AI-Powered</span>}{' '}
            • Powered by <span className="font-semibold">SFS</span>
          </p>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </>
  );
}
