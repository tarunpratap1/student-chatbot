// frontend/src/store.js
import create from 'zustand';

// 🔐 Authentication store

export const useAuth = create(set => ({
  token: null,
  login: (token) => set({ token }),
  logout: () => set({ token: null }),
}));


// 💬 Chat store
export const useChats = create((set) => ({
  chats: [],        // list of all chats
  current: null,    // currently open chat
  messages: [],     // messages in the current chat

  // setters
  setChats: (chats) => set({ chats }),
  setCurrent: (chat) => set({ current: chat, messages: chat?.messages || [] }),
  setMessages: (messages) => set({ messages }),

  // helpers
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  reset: () => set({ chats: [], current: null, messages: [] }),
}));
