'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, ArrowLeft, User, Shield } from 'lucide-react'

interface ChatSession {
  id: string
  patientName: string | null
  patientEmail: string | null
  patientPhone: string | null
  status: string
  isAdminTakeover: boolean
  createdAt: string
  _count: { messages: number }
}

interface ChatMessage {
  id: string
  content: string
  sender: string
  isAdmin: boolean
  createdAt: string
}

export default function AdminChats() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [takeover, setTakeover] = useState(false)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/admin/chats')
      const data = await res.json()
      if (data.sessions) setSessions(data.sessions)
    } catch (err) {
      console.error('Failed to fetch sessions', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (sessionId: string) => {
    setMessagesLoading(true)
    setSelectedSession(sessionId)
    try {
      const res = await fetch(`/api/admin/chats/${sessionId}/messages`)
      const data = await res.json()
      setMessages(data.messages)
      const session = sessions.find(s => s.id === sessionId)
      if (session) setTakeover(session.isAdminTakeover)
    } catch (err) {
      console.error('Failed to fetch messages', err)
    } finally {
      setMessagesLoading(false)
    }
  }

  const handleBack = () => {
    setSelectedSession(null)
    setMessages([])
    setTakeover(false)
    setReply('')
    fetchSessions()
  }

  const handleTakeoverToggle = async () => {
    if (!selectedSession) return
    const newTakeover = !takeover
    setTakeover(newTakeover)
    try {
      await fetch(`/api/admin/chats/${selectedSession}/takeover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdminTakeover: newTakeover }),
      })
    } catch (err) {
      console.error('Failed to toggle takeover', err)
      setTakeover(!newTakeover)
    }
  }

  const handleSendReply = async () => {
    if (!selectedSession || !reply.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/admin/chats/${selectedSession}/takeover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdminTakeover: takeover, message: reply.trim() }),
      })
      if (res.ok) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: reply.trim(),
          sender: 'Admin',
          isAdmin: true,
          createdAt: new Date().toISOString(),
        }])
        setReply('')
      }
    } catch (err) {
      console.error('Failed to send reply', err)
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const selectedSessionData = sessions.find(s => s.id === selectedSession)

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {!selectedSession ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Chat Sessions</h1>
                  <p className="text-sm text-foreground/50">Monitor and manage patient conversations</p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="rounded-2xl glass-card p-12 text-center">
                  <MessageCircle className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                  <p className="text-lg font-medium">No chat sessions yet</p>
                  <p className="text-sm text-foreground/50 mt-1">Patient conversations will appear here</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {sessions.map((session, index) => (
                    <motion.button
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => fetchMessages(session.id)}
                      className="rounded-2xl glass-card p-5 text-left w-full hover:bg-accent/5 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            session.isAdminTakeover
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-accent/10 text-accent'
                          }`}>
                            {session.isAdminTakeover ? (
                              <Shield className="w-5 h-5" />
                            ) : (
                              <User className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {session.patientName || 'Anonymous'}
                            </p>
                            <p className="text-sm text-foreground/50 truncate">
                              {session.patientEmail || session.patientPhone || 'No contact'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-xs text-foreground/50">{formatDate(session.createdAt)}</p>
                            <p className="text-xs text-foreground/50 mt-0.5">
                              {session._count.messages} message{session._count.messages !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            session.status === 'active'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-gray-500/10 text-gray-500'
                          }`}>
                            {session.status}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBack}
                    className="w-9 h-9 rounded-xl glass-card flex items-center justify-center hover:bg-accent/5 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedSessionData?.patientName || 'Anonymous'}
                    </h2>
                    <p className="text-sm text-foreground/50">
                      {selectedSessionData?.patientEmail || selectedSessionData?.patientPhone || 'No contact'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleTakeoverToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    takeover
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'glass-card hover:bg-accent/5'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  {takeover ? 'Takeover Active' : 'Admin Takeover'}
                </button>
              </div>

              <div className="rounded-2xl glass-card p-6">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-16">
                    <MessageCircle className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
                    <p className="text-foreground/50">No messages in this session yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto mb-4 pr-2">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                            msg.isAdmin
                              ? 'bg-accent text-white rounded-br-md'
                              : 'glass-card rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${
                            msg.isAdmin ? 'text-white/60' : 'text-foreground/40'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit', minute: '2-digit',
                            })}
                            {msg.isAdmin && ' • Admin'}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {takeover && (
                  <div className="flex items-center gap-2 pt-4 border-t border-accent/10">
                    <input
                      type="text"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2.5 rounded-xl glass-card bg-transparent outline-none text-sm placeholder:text-foreground/30"
                      disabled={sending}
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!reply.trim() || sending}
                      className="px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
