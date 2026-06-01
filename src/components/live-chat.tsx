'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store/useStore'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

const welcomeMessage = {
  id: 'welcome',
  content: 'Hello! Welcome to Wasi Dental Clinic. How can we help you today?',
  sender: 'bot' as const,
  timestamp: new Date().toISOString(),
}

const quickReplies = [
  'Book an appointment',
  'View our services',
  'Check pricing',
  'Emergency contact',
  'Talk to a dentist',
]

function TypewriterText({ content, speed = 30 }: { content: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(content.slice(0, i))
      if (i >= content.length) {
        clearInterval(timer)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [content, speed])

  return (
    <span>
      {displayed}
      {!done && <span className="animate-pulse">|</span>}
    </span>
  )
}

export function LiveChat() {
  const { isChatOpen, setIsChatOpen } = useUIStore()
  const [messages, setMessages] = useState<any[]>([{ ...welcomeMessage, _typing: true, _done: false }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [showForm, setShowForm] = useState(true)
  const [sessionId, setSessionId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isChatOpen && inputRef.current) inputRef.current.focus()
  }, [isChatOpen])

  const handleSend = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId || crypto.randomUUID(),
          content,
          language: 'en',
          patientName: name || undefined,
          patientEmail: '',
          patientPhone: phone || undefined,
        }),
      })
      const data = await res.json()
      const reply = data.message?.content || data.reply || 'Thank you! Our team will get back to you shortly.'

      setIsTyping(false)
      const botId = (Date.now() + 1).toString()
      setMessages((prev) => [...prev, {
        id: botId,
        content: reply,
        sender: 'bot',
        _typing: true,
        _done: false,
        timestamp: new Date().toISOString(),
      }])
      if (data.sessionId) setSessionId(data.sessionId)
    } catch {
      setIsTyping(false)
      const reply = 'Thank you for your message! Our team will get back to you shortly. For immediate assistance, please call our clinic.'
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        content: reply,
        sender: 'bot',
        _typing: true,
        _done: false,
        timestamp: new Date().toISOString(),
      }])
    }
  }, [sessionId])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message: 'Website Chat lead', source: 'Website Chat' }),
      })
    } catch {}

    setShowForm(false)
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      content: `Welcome, ${name}! How can we help you today?`,
      sender: 'bot',
      _typing: true,
      _done: false,
      timestamp: new Date().toISOString(),
    }])
  }

  return (
    <>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open chat"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#1B8A5D] animate-ping opacity-20 group-hover:opacity-30" style={{ animationDuration: '2s' }} />
          <div className="relative w-14 h-14 rounded-full bg-[#1B8A5D] flex items-center justify-center shadow-lg shadow-[#1B8A5D]/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#1B8A5D]/40">
            {isChatOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <MessageCircle className="w-6 h-6 text-white" />
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-40px)] h-[560px] max-h-[calc(100vh-160px)] rounded-2xl bg-white border border-gray-200 overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#1B8A5D]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Wasi Dental</p>
                  <p className="text-xs text-green-200">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {showForm && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleFormSubmit}
                  className="bg-white rounded-xl p-4 border border-gray-200 space-y-3 mb-3"
                >
                  <p className="text-xs font-medium text-gray-600">Share your details to connect with us:</p>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1B8A5D]"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1B8A5D]"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-[#1B8A5D] text-white text-sm font-medium hover:bg-[#157a4f] transition-colors"
                  >
                    Start Chat
                  </button>
                </motion.form>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#1B8A5D] text-white rounded-tr-sm'
                        : 'bg-white border border-gray-200 rounded-tl-sm text-gray-700'
                    }`}
                  >
                    {msg.sender === 'bot' && msg._typing ? (
                      <TypewriterText content={msg.content} speed={25} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1">
                    <motion.span
                      className="w-2 h-2 rounded-full bg-gray-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
                    />
                    <motion.span
                      className="w-2 h-2 rounded-full bg-gray-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                    />
                    <motion.span
                      className="w-2 h-2 rounded-full bg-gray-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-100 bg-white">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => { if (!showForm) handleSend(reply) }}
                    disabled={showForm}
                    className="px-3 py-1.5 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-[#1B8A5D]/10 hover:text-[#1B8A5D] transition-colors disabled:opacity-40"
                  >
                    {reply}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !showForm) { e.preventDefault(); handleSend(input) } }}
                  placeholder={showForm ? 'Fill details above first...' : 'Type your message...'}
                  disabled={showForm}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1B8A5D] transition-colors disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || showForm}
                  className="w-10 h-10 rounded-xl bg-[#1B8A5D] flex items-center justify-center disabled:opacity-50 hover:bg-[#157a4f] transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
