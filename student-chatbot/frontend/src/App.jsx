// App.jsx
import "./fixes.css"
import React, { useState, useEffect, useRef } from 'react';
import { api } from './api.js';
import { useAuth } from './store.js';
import axios from "axios";
import {
  Menu,
  X,
  Sun,
  Moon,
  Send,
  Mic,
  MicOff,
  Bot,
  Volume2,
  VolumeX,
  Clock,
  FileText,
  Image as ImageIcon,
  User,
  Brain,
  Cpu,
  Rocket,
  Lock,
  Globe,
  MessageCircle,
  FileUp,
  ImageUp,
  Activity,
  Plus,
  Trash2,
  Edit,
  Copy,
  MessageSquare,
  ChevronDown,
  Check,
  XCircle,
  MoreVertical
} from 'lucide-react';

export default function Chat() {
  const token = useAuth(state => state.token);
  
  // Multiple chat sessions state
  const [chatSessions, setChatSessions] = useState([
    {
      id: '1',
      name: 'Welcome Chat',
      messages: [{
        role: 'assistant',
        content: '✨ Hello! I\'m **Pixel Talk**, your intelligent AI assistant. Ready to help you with anything!',
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
      isActive: true
    }
  ]);
  
  const [activeChatId, setActiveChatId] = useState('1');
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [activeUploadType, setActiveUploadType] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatDropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const renameInputRef = useRef(null);
  
  // Get active chat messages
  const activeChat = chatSessions.find(chat => chat.id === activeChatId) || chatSessions[0];
  const messages = activeChat?.messages || [];

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript = transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          setInput(prev => prev + finalTranscript);
        }
        
        if (interimTranscript) {
          setInput(prev => {
            const withoutInterim = prev.replace(/\[.*?\]/g, '');
            return withoutInterim + ' [' + interimTranscript + ']';
          });
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          alert('Microphone access was denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          alert('No speech detected. Please speak clearly.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsVoiceSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatDropdownRef.current && !chatDropdownRef.current.contains(event.target)) {
        setShowChatDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus rename input when renaming
  useEffect(() => {
    if (renamingChatId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingChatId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create new chat
  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      name: `Chat ${chatSessions.length + 1}`,
      messages: [{
        role: 'assistant',
        content: '✨ Hello! I\'m Pixel Talk. How can I assist you today?',
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    // Deactivate all other chats
    const updatedChats = chatSessions.map(chat => ({
      ...chat,
      isActive: false
    }));
    
    setChatSessions([...updatedChats, newChat]);
    setActiveChatId(newChatId);
    setInput('');
    setTranscript('');
    setSidebarOpen(false);
    setShowChatDropdown(false);
  };

  // Switch to existing chat
  const switchToChat = (chatId) => {
    setChatSessions(prev => 
      prev.map(chat => ({
        ...chat,
        isActive: chat.id === chatId
      }))
    );
    setActiveChatId(chatId);
    setSidebarOpen(false);
    setShowChatDropdown(false);
  };

  // Start renaming chat
  const startRenamingChat = (chatId, currentName) => {
    setRenamingChatId(chatId);
    setRenameValue(currentName);
  };

  // Complete renaming chat
  const completeRenamingChat = () => {
    if (renamingChatId && renameValue.trim()) {
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === renamingChatId ? {...chat, name: renameValue.trim()} : chat
        )
      );
    }
    setRenamingChatId(null);
    setRenameValue('');
  };

  // Cancel renaming
  const cancelRenaming = () => {
    setRenamingChatId(null);
    setRenameValue('');
  };

  // Delete chat
  const deleteChat = (chatId) => {
    if (chatSessions.length <= 1) {
      alert('You must have at least one chat session.');
      return;
    }
    
    setChatSessions(prev => {
      const newSessions = prev.filter(chat => chat.id !== chatId);
      // If deleting active chat, switch to another one
      if (chatId === activeChatId && newSessions.length > 0) {
        newSessions[0].isActive = true;
        setActiveChatId(newSessions[0].id);
      }
      return newSessions;
    });
    setShowDeleteConfirm(false);
    setChatToDelete(null);
    setShowChatDropdown(false);
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInput(prev => prev.replace(/\[.*?\]/g, '').trim());
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        alert('Failed to access microphone. Please check permissions.');
      }
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage = {
      role: 'user',
      content: input.replace(/\[.*?\]/g, '').trim(),
      timestamp: new Date().toISOString()
    };
    
    // Update active chat with new message
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === activeChatId 
          ? {...chat, messages: [...chat.messages, userMessage]}
          : chat
      )
    );
    
    const currentInput = input.replace(/\[.*?\]/g, '').trim();
    setInput('');
    setTranscript('');
    setIsSending(true);

    try {
      const res = await api.post('/chat', { message: currentInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const reply = res.data.reply || "🤔 I'm processing your request...";
      
      // Update with assistant response
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === activeChatId 
            ? {...chat, messages: [...chat.messages, {
                role: 'assistant',
                content: reply,
                timestamp: new Date().toISOString()
              }]}
            : chat
        )
      );
    } catch (err) {
      console.error(err);
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === activeChatId 
            ? {...chat, messages: [...chat.messages, {
                role: 'assistant',
                content: '⚠️ Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString()
              }]}
            : chat
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for chat history
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Open file upload modal
  const openFileUploadModal = (type) => {
    setActiveUploadType(type);
    setShowFileModal(true);
    setSidebarOpen(false);
    setShowChatDropdown(false);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (activeUploadType === 'pdf') {
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setTimeout(() => analyzePdf(file), 100);
      } else {
        alert('Please select a valid PDF file');
      }
    } else if (activeUploadType === 'image') {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        setTimeout(() => analyzeImage(file), 100);
      } else {
        alert('Please select a valid image file');
      }
    }
    setShowFileModal(false);
  };

  // Function to analyze PDF
  const analyzePdf = async (file) => {
    if (!file) {
      alert("📄 Please select a PDF file first.");
      return;
    }

    const userMessage = {
      role: 'user',
      content: `📄 Uploaded PDF: ${file.name}`,
      timestamp: new Date().toISOString()
    };
    
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === activeChatId 
          ? {...chat, messages: [...chat.messages, userMessage]}
          : chat
      )
    );

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/analyze-pdf",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === activeChatId 
            ? {...chat, messages: [...chat.messages, {
                role: "assistant",
                content: `📊 **PDF Analysis Complete**\n\n${res.data.reply || 'Analysis successful!'}`,
                timestamp: new Date().toISOString()
              }]}
            : chat
        )
      );
    } catch (err) {
      console.error("PDF analyze error:", err);
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === activeChatId 
            ? {...chat, messages: [...chat.messages, {
                role: "assistant",
                content: "❌ Error analyzing PDF. Please check if the server is running and try again.",
                timestamp: new Date().toISOString()
              }]}
            : chat
        )
      );
    }
    setPdfFile(null);
  };

  // Function to analyze Image
  const analyzeImage = async (file) => {
    if (!file) {
      alert("🖼️ Please select an image file first.");
      return;
    }

    const userMessage = {
      role: 'user',
      content: `🖼️ Uploaded Image: ${file.name}`,
      timestamp: new Date().toISOString()
    };
    
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === activeChatId 
          ? {...chat, messages: [...chat.messages, userMessage]}
          : chat
      )
    );

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/analyze-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === activeChatId 
            ? {...chat, messages: [...chat.messages, {
                role: "assistant",
                content: `🖼️ **Image Analysis Complete**\n\n${res.data.reply || 'Image analysis successful!'}`,
                timestamp: new Date().toISOString()
              }]}
            : chat
        )
      );
    } catch (err) {
      console.error("Image analyze error:", err);
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === activeChatId 
            ? {...chat, messages: [...chat.messages, {
                role: "assistant",
                content: "❌ Error analyzing image. Please check if the server is running and try again.",
                timestamp: new Date().toISOString()
              }]}
            : chat
        )
      );
    }
    setImageFile(null);
  };

  // Handle file upload click
  const handleFileUploadClick = (type) => {
    setActiveUploadType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'pdf' ? '.pdf,application/pdf' : 'image/*';
      fileInputRef.current.click();
    }
  };

  // Text-to-speech function
  const speakMessage = (text) => {
    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('female') ||
      voice.lang.includes('en-US')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Quick suggestions
  const quickSuggestions = [
    'Explain quantum computing',
    'Write a creative poem',
    'Plan a healthy meal',
    'Python code example',
    'Latest AI trends',
    'Debug JavaScript code'
  ];

  return (
    <div className={`${darkMode ? 'dark' : ''} flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden`}>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Delete Chat
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure?
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setChatToDelete(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                This will permanently delete "{chatSessions.find(c => c.id === chatToDelete)?.name}". 
                This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setChatToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteChat(chatToDelete)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${activeUploadType === 'pdf' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                  {activeUploadType === 'pdf' ? (
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Upload {activeUploadType === 'pdf' ? 'PDF' : 'Image'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select a file to analyze
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFileModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}>
                <div className="flex flex-col items-center">
                  <div className={`p-4 rounded-full mb-4 ${activeUploadType === 'pdf' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                    {activeUploadType === 'pdf' ? (
                      <FileUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <ImageUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activeUploadType === 'pdf' ? 'PDF files only (Max 10MB)' : 'JPG, PNG, GIF, WEBP (Max 5MB)'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Supported Features:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {activeUploadType === 'pdf' ? (
                    <>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        Text extraction and analysis
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        Content summarization
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        Table and chart recognition
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        Object detection
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        Text recognition (OCR)
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        Scene description
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Glassmorphic Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-500 ease-out z-40 shadow-2xl`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header with Gradient */}
          <div className="p-6 border-b border-white/10 dark:border-gray-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div>
                  <h2 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Pixel Talk
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors hover:rotate-90 duration-300"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-5 border-b border-white/10 dark:border-gray-700/50">
            <button
              onClick={createNewChat}
              className="w-full p-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat History Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Chat History
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {chatSessions.length} chats
                </span>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {chatSessions.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                      chat.isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => switchToChat(chat.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className={`p-2 rounded-lg ${
                          chat.isActive
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <MessageSquare className={`w-4 h-4 ${
                            chat.isActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          {renamingChatId === chat.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                ref={renameInputRef}
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') completeRenamingChat();
                                  if (e.key === 'Escape') cancelRenaming();
                                }}
                                className="flex-1 px-2 py-1 text-sm bg-white/50 dark:bg-gray-700/50 rounded-lg border border-blue-300 dark:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button
                                onClick={completeRenamingChat}
                                className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                              >
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              </button>
                              <button
                                onClick={cancelRenaming}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                              >
                                <XCircle className="w-3.5 h-3.5 text-red-600" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className={`text-sm font-medium truncate ${
                                chat.isActive
                                  ? 'text-blue-700 dark:text-blue-300'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {chat.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {formatDate(chat.createdAt)} • {chat.messages.length} messages
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startRenamingChat(chat.id, chat.name);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="Rename chat"
                        >
                          <Edit className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        {chatSessions.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatToDelete(chat.id);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete chat"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="p-5 border-t border-white/10 dark:border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">AI Features</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleFileUploadClick('pdf')}
                className="w-full group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center p-3 rounded-xl hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">PDF Analysis</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Upload & analyze documents</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleFileUploadClick('image')}
                className="w-full group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center p-3 rounded-xl hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 group-hover:scale-110 transition-transform duration-300">
                    <ImageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Image Analysis</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Upload & analyze images</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className="mt-auto p-5 border-t border-white/10 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-700 dark:text-gray-300">Tarun</p>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Rocket className="w-3 h-3 text-amber-500 mr-1" />
                    <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent font-bold">PRO</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Premium User</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Glassmorphic Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Left side - Logo and Chat Management */}
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors lg:hidden flex-shrink-0"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {/* Logo - Shows only icon when sidebar is open on mobile */}
              <div className="flex items-center space-x-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                
                {/* Show Pixel Talk text only when sidebar is closed or on larger screens */}
                <div className={`${sidebarOpen ? 'hidden' : 'hidden sm:block'}`}>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                    Pixel Talk
                  </h1>
                </div>
              </div>

              {/* Chat Dropdown for Desktop */}
              <div className="hidden lg:block relative" ref={chatDropdownRef}>
                <button
                  onClick={() => setShowChatDropdown(!showChatDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors min-w-0"
                >
                  <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                    {activeChat?.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${showChatDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showChatDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-xl z-50 overflow-hidden">
                    <div className="p-2">
                      <button
                        onClick={createNewChat}
                        className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 mb-2"
                      >
                        <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">New Chat</span>
                      </button>
                      
                      <div className="max-h-64 overflow-y-auto">
                        {chatSessions.map((chat) => (
                          <div
                            key={chat.id}
                            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                              chat.isActive
                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                            }`}
                            onClick={() => switchToChat(chat.id)}
                          >
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <MessageSquare className={`w-3 h-3 flex-shrink-0 ${
                                chat.isActive
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-gray-500'
                              }`} />
                              <span className={`text-sm truncate ${
                                chat.isActive
                                  ? 'text-blue-700 dark:text-blue-300 font-medium'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {chat.name}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startRenamingChat(chat.id, chat.name);
                                  setShowChatDropdown(false);
                                }}
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                                title="Rename"
                              >
                                <Edit className="w-3 h-3 text-gray-500" />
                              </button>
                              {chatSessions.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setChatToDelete(chat.id);
                                    setShowDeleteConfirm(true);
                                    setShowChatDropdown(false);
                                  }}
                                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                          {chatSessions.length} chat{chatSessions.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* New Chat Button - Always visible */}
              <button
                onClick={createNewChat}
                className="p-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
                title="New Chat"
              >
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </button>

              {/* File Upload Buttons - Responsive */}
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => handleFileUploadClick('pdf')}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300 flex items-center space-x-2 group"
                >
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hidden sm:inline">PDF</span>
                </button>
                <button
                  onClick={() => handleFileUploadClick('image')}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20 transition-all duration-300 flex items-center space-x-2 group"
                >
                  <ImageIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400 hidden sm:inline">Image</span>
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 hover:rotate-12"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Chat Messages with Gradient Background */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gradient-to-b from-transparent to-blue-50/50 dark:to-gray-900/50">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {messages.length === 1 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl mb-6">
                  <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 id="title" className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  Welcome to Pixel Talk
                </h2>
                <p id="textstart" className="textp text-gray-600 dark:text-gray-300 max-w-md mb-8">
                  Start a conversation by typing a message or using voice input
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(suggestion)}
                      className="px-3 py-1.5 text-sm rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md border border-white/50 dark:border-gray-700/50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.slice(1).map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`group max-w-[90%] sm:max-w-[85%] rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 rounded-bl-md border border-white/30 dark:border-gray-700/30'
                    }`}
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-400'
                          : 'bg-gradient-to-br from-purple-500 to-pink-500'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${
                              msg.role === 'user' ? 'text-blue-100' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {msg.role === 'user' ? 'You' : 'Pixel Talk'}
                            </span>
                            {msg.role === 'assistant' && (
                              <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400">
                                <Cpu className="w-3 h-3 inline mr-1" />
                                AI
                              </span>
                            )}
                          </div>
                          <span className="text-xs opacity-75 flex items-center mt-1 sm:mt-0">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <div className={`prose prose-sm dark:prose-invert max-w-none ${
                          msg.role === 'user' ? 'text-blue-50' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        {msg.role === 'assistant' && (
                          <div className="mt-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => speakMessage(msg.content)}
                              className={`p-1.5 sm:p-2 rounded-lg backdrop-blur-sm transition-colors ${
                                isSpeaking ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/50'
                              }`}
                            >
                              {isSpeaking ? (
                                <VolumeX className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(msg.content);
                                alert('Message copied to clipboard!');
                              }}
                              className="p-1.5 sm:p-2 rounded-lg bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/50 backdrop-blur-sm transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isSending && (
              <div className="flex justify-start animate-fadeIn">
                <div className="max-w-[90%] sm:max-w-[85%] rounded-2xl sm:rounded-3xl rounded-bl-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 sm:p-4 md:p-5 border border-white/30 dark:border-gray-700/30 shadow-lg">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="sticky bottom-0 px-3 sm:px-4 pb-4 sm:pb-6 pt-3 sm:pt-4 bg-gradient-to-t from-white/95 dark:from-gray-900/95 via-white/90 dark:via-gray-900/90 to-transparent backdrop-blur-xl">
          <div className="max-w-3xl mx-auto">
            {/* Voice Transcript Display */}
            {transcript && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-200 dark:border-green-800 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">Voice Input:</span>
                  </div>
                  <button
                    onClick={() => setTranscript('')}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Clear
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 break-words">{transcript}</p>
              </div>
            )}

            {/* Voice Status Indicator */}
            {isListening && (
              <div className="mb-3 sm:mb-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full flex items-center justify-center space-x-2 backdrop-blur-sm">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">Listening...</span>
                <div className="ml-1 sm:ml-2 flex space-x-1">
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}

            {/* Voice Not Supported Warning */}
            {!isVoiceSupported && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-200 dark:border-amber-800 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <MicOff className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300">Voice input not supported in this browser</span>
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={sendMessage} className="relative">
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden backdrop-blur-sm">
                {/* Mobile Action Buttons */}
                <div className="flex items-center pl-2 sm:pl-4 space-x-1">
                  <button
                    type="button"
                    onClick={() => handleFileUploadClick('pdf')}
                    className="p-1.5 sm:p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                    title="Upload PDF"
                  >
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFileUploadClick('image')}
                    className="p-1.5 sm:p-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                    title="Upload Image"
                  >
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 group-hover:text-green-600 transition-colors" />
                  </button>
                </div>
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="💬 Ask Pixel Talk..."
                  className="flex-1 px-3 sm:px-4 py-3 sm:py-4 bg-transparent border-0 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base sm:text-lg font-medium min-w-0"
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(e)}
                />
                
                <div className="flex items-center pr-2 sm:pr-2">
                  {/* Voice Input Button */}
                  {isVoiceSupported && (
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      className={`p-1.5 sm:p-2.5 rounded-xl mr-1 transition-all duration-300 ${
                        isListening
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-105'
                      }`}
                      title={isListening ? 'Stop listening' : 'Start voice input'}
                    >
                      {isListening ? (
                        <div className="flex items-center">
                          <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      ) : (
                        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSending || !input.trim()}
                    className={`p-2.5 sm:p-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isSending || !input.trim()
                        ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isSending ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Footer Text */}
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
              <span className="flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                End-to-end encrypted
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center">
                <Globe className="w-3 h-3 mr-1" />
                Powered by Advanced AI
              </span>
            </p>
          </div>
        </div>
      </main>

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}