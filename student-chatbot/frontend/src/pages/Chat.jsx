import React, { useState } from 'react';
import { api } from '../api.js';
import ReactMarkdown from "react-markdown";
import { useAuth } from '../store.js';

export default function Chat() {



function MessageBubble({ content, role }) {
  return (
    <div className={role === "user" ? "user-bubble" : "ai-bubble"}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
  const token = useAuth(state => state.token);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Hi Bhawar, I’m ready to chat!' }
  ]);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);

    try {
      const res = await api.post('/chat', { message: input }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const reply = res.data.reply || "⚠️ No reply from server.";
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ Error talking to server.' }]);
    }

    setInput('');
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} flex h-screen`}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out z-20`}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">📂 Menu</h2>
            <button
              className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              ✖
            </button>
          </div>
          <button
            className="w-full p-2 rounded bg-blue-600 hover:bg-blue-500"
            onClick={() => setDarkMode(!darkMode)}
          >
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </button>
          <button
            className="w-full p-2 rounded bg-gray-700 hover:bg-gray-600"
            onClick={() => alert('⚙️ Settings coming soon!')}
          >
            ⚙️ Settings
          </button>
          <button
            className="w-full p-2 rounded bg-green-600 hover:bg-green-500"
            onClick={() => alert('📜 Chat history feature coming soon!')}
          >
            📜 Chat History
          </button>
          <button
            className="w-full p-2 rounded bg-purple-600 hover:bg-purple-500"
            onClick={() => alert('🔔 Notifications feature coming soon!')}
          >
            🔔 Notifications
          </button>
        </div>
      </aside>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="text-xl font-bold">✨ Premium Chatbot ✨</h1>
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </header>

        {/* Chat Window */}
        <section className="flex-1 overflow-y-auto p-6 space-y-4 grid gap-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-lg shadow ${msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </section>





        {/* Floating Input */}
        <form
          onSubmit={sendMessage}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 md:w-2/3 lg:w-1/2"
        >
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 p-3 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="submit"
              className="ml-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 shadow-md transition-transform transform hover:-translate-y-0.5"
            >
              ➤
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}





//new chat.jsx by deepseek

// import React, { useState, useEffect, useRef } from 'react';
// import { api } from '../api.js';
// import { useAuth } from '../store.js';

// export default function Chat() {
//   const token = useAuth(state => state.token);
//   const [messages, setMessages] = useState([
//     { role: 'assistant', content: '👋 Hi Bhawar, I\'m ready to chat! How can I assist you today?' }
//   ]);
//   const [input, setInput] = useState('');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(true);
//   const [isSending, setIsSending] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim() || isSending) return;

//     const newMessages = [...messages, { role: 'user', content: input }];
//     setMessages(newMessages);
//     setInput('');
//     setIsSending(true);

//     try {
//       const res = await api.post('/api/chat', { message: input }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const reply = res.data.reply || "⚠️ No reply from server.";
//       setMessages([...newMessages, { role: 'assistant', content: reply }]);
//     } catch (err) {
//       console.error(err);
//       setMessages([...newMessages, { role: 'assistant', content: '⚠️ Error talking to server. Please try again.' }]);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   // Sidebar menu items
//   const menuItems = [
//     {
//       label: '⚙️ Settings',
//       color: 'from-gray-700 to-gray-600',
//       hoverColor: 'from-gray-600 to-gray-500',
//       onClick: () => alert('⚙️ Settings coming soon!'),
//       description: 'Configure your preferences'
//     },
//     {
//       label: '📜 Chat History',
//       color: 'from-green-600 to-emerald-500',
//       hoverColor: 'from-green-500 to-emerald-400',
//       onClick: () => alert('📜 Chat history feature coming soon!'),
//       description: 'View past conversations'
//     },
//     {
//       label: '🔔 Notifications',
//       color: 'from-purple-600 to-violet-500',
//       hoverColor: 'from-purple-500 to-violet-400',
//       onClick: () => alert('🔔 Notifications feature coming soon!'),
//       description: 'Manage alerts & updates'
//     },
//     {
//       label: '📤 Export Chats',
//       color: 'from-amber-600 to-orange-500',
//       hoverColor: 'from-amber-500 to-orange-400',
//       onClick: () => alert('📤 Export feature coming soon!'),
//       description: 'Save conversations'
//     }
//   ];

//   return (
//     <div className={`${darkMode ? 'dark' : ''} flex h-screen overflow-hidden`}>
//       {/* Sidebar Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Enhanced Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 to-black text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } transition-all duration-500 ease-out z-30 shadow-2xl`}
//       >
//         <div className="p-6 space-y-4 h-full flex flex-col">
//           {/* Sidebar Header */}
//           <div className="flex justify-between items-center pb-4 border-b border-gray-700">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
//                 <span className="text-xl">🤖</span>
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Premium Chat</h2>
//                 <p className="text-xs text-gray-400">Menu</p>
//               </div>
//             </div>
//             <button
//               className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <span className="text-lg">✖</span>
//             </button>
//           </div>

//           {/* Dark Mode Toggle */}
//           <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-amber-100'}`}>
//                   {darkMode ? '🌙' : '☀️'}
//                 </div>
//                 <div>
//                   <p className="font-medium">Theme</p>
//                   <p className="text-sm text-gray-400">{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
//                 </div>
//               </div>
//               <button
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-500 ${darkMode ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-amber-400 to-orange-500'
//                   }`}
//                 onClick={() => setDarkMode(!darkMode)}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-500 ${darkMode ? 'translate-x-6' : 'translate-x-1'
//                     }`}
//                 />
//               </button>
//             </div>
//           </div>

//           {/* Menu Items */}
//           <div className="space-y-2 flex-1 overflow-y-auto">
//             {menuItems.map((item, index) => (
//               <button
//                 key={index}
//                 onClick={item.onClick}
//                 className={`w-full p-4 rounded-xl bg-gradient-to-r ${item.color} hover:${item.hoverColor} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-between group`}
//               >
//                 <div className="flex items-center space-x-3">
//                   <span className="text-xl">{item.label.split(' ')[0]}</span>
//                   <div className="text-left">
//                     <p className="font-semibold">{item.label.split(' ').slice(1).join(' ')}</p>
//                     <p className="text-xs opacity-75 group-hover:opacity-100">{item.description}</p>
//                   </div>
//                 </div>
//                 <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
//                   ➤
//                 </span>
//               </button>
//             ))}
//           </div>

//           {/* Sidebar Footer */}
//           <div className="pt-4 border-t border-gray-700">
//             <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
//               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
//               <div className="flex-1">
//                 <p className="text-sm font-medium">Bhawar</p>
//                 <p className="text-xs text-gray-400">Premium User</p>
//               </div>
//               <span className="text-xs px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full">
//                 Online
//               </span>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Main Layout */}
//       <main className="flex-1 flex flex-col bg-gradient-to-br from-gray-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-black text-gray-900 dark:text-white transition-all duration-500">
//         {/* Enhanced Header */}
//         <header className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center space-x-4">
//             <button
//               className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//             >
//               <span className="text-lg group-hover:rotate-90 transition-transform duration-300">☰</span>
//             </button>
//             <div className="hidden md:block">
//               <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
//               <p className="font-bold">Bhawar 👋</p>
//             </div>
//           </div>

//           <div className="flex flex-col items-center">
//             <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               ✨ Premium Chatbot ✨
//             </h1>
//             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Powered by Advanced AI</p>
//           </div>

//           <div className="flex items-center space-x-3">
//             <button
//               className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
//               onClick={() => setDarkMode(!darkMode)}
//             >
//               <span className="text-xl">{darkMode ? '🌙' : '☀️'}</span>
//             </button>
//             <div className="relative">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300">
//                 <span className="text-lg">👤</span>
//               </div>
//               <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
//             </div>
//           </div>
//         </header>

//         {/* Enhanced Chat Window */}
//         <section className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
//             >
//               <div
//                 className={`max-w-[85%] md:max-w-[70%] px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${msg.role === 'user'
//                     ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
//                     : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-bl-none'
//                   }`}
//               >
//                 <div className="flex items-center space-x-3 mb-2">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user'
//                       ? 'bg-blue-400'
//                       : 'bg-gradient-to-r from-purple-500 to-pink-500'
//                     }`}>
//                     {msg.role === 'user' ? '👤' : '🤖'}
//                   </div>
//                   <span className={`text-sm font-semibold ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-300'
//                     }`}>
//                     {msg.role === 'user' ? 'You' : 'Assistant'}
//                   </span>
//                   <span className="text-xs opacity-75">
//                     {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </span>
//                 </div>
//                 <p className="leading-relaxed">{msg.content}</p>
//               </div>
//             </div>
//           ))}

//           {/* Loading indicator */}
//           {isSending && (
//             <div className="flex justify-start animate-pulse">
//               <div className="max-w-[70%] px-6 py-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-bl-none">
//                 <div className="flex space-x-2">
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </section>

//         {/* Enhanced Floating Input */}
//         <form
//           onSubmit={sendMessage}
//           className="sticky bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-white/90 dark:from-gray-900/90 via-white/70 dark:via-gray-900/70 to-transparent backdrop-blur-lg"
//         >
//           <div className="mx-auto max-w-4xl">
//             <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-2 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-3xl hover:scale-[1.005]">
//               <button
//                 type="button"
//                 className="ml-2 p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 transform hover:scale-110"
//                 onClick={() => alert('📎 Attachment feature coming soon!')}
//               >
//                 <span className="text-lg">📎</span>
//               </button>

//               <input
//                 type="text"
//                 value={input}
//                 onChange={e => setInput(e.target.value)}
//                 placeholder="Type your message here... (Press Enter to send)"
//                 className="flex-1 p-4 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-lg"
//                 onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(e)}
//               />

//               <div className="flex items-center space-x-2 mr-2">
//                 <button
//                   type="button"
//                   className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 transform hover:scale-110"
//                   onClick={() => {
//                     const voice = speechSynthesis.getVoices().find(v => v.lang.includes('en'));
//                     const utterance = new SpeechSynthesisUtterance(messages[messages.length - 1].content);
//                     if (voice) utterance.voice = voice;
//                     speechSynthesis.speak(utterance);
//                   }}
//                 >
//                   <span className="text-lg">🔊</span>
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={isSending || !input.trim()}
//                   className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:scale-95 ${isSending || !input.trim()
//                       ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:shadow-2xl'
//                     }`}
//                 >
//                   {isSending ? (
//                     <span className="flex items-center space-x-2">
//                       <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                       <span>Sending...</span>
//                     </span>
//                   ) : (
//                     <span className="flex items-center space-x-2">
//                       <span>Send</span>
//                       <span className="text-lg">➤</span>
//                     </span>
//                   )}
//                 </button>
//               </div>
//             </div>
//             <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
//               ✨ Premium AI • End-to-end encrypted • Real-time responses
//             </p>
//           </div>
//         </form>
//       </main>

//       {/* Add custom animations */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out forwards;
//         }
//         .hover-shadow-3xl {
//           box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
//         }
//       `}</style>
//     </div>
//   );
// }

