'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Button from '@/components/ui/Button'
import { MessageCircle, Send, Search } from 'lucide-react'
import useAuthStore from '@/lib/store'
import {
  getEtudiantMesDiscussions,
  getMessagesDiscussionV2,
  envoyerMessageDiscussionV2,
  type Discussion,
} from '@/lib/api'

type MessageDiscussion = {
  id: number
  contenu: string
  dateEnvoi?: string
  auteur?: { id: number; nomComplet?: string; email?: string }
}

function formatDate(ts?: string) {
  if (!ts) return ''
  const d = new Date(ts)
  return Number.isNaN(d.getTime()) ? ts : d.toLocaleString()
}

export default function EtudiantDiscussionsPage() {
  const user = useAuthStore((s) => s.user)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [selected, setSelected] = useState<Discussion | null>(null)

  const [messages, setMessages] = useState<MessageDiscussion[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  const [q, setQ] = useState('')
  const [msg, setMsg] = useState('')
  const [sending, setSending] = useState(false)

  const loadDiscussions = async () => {
    const d = await getEtudiantMesDiscussions()
    setDiscussions(d)
  }

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        await loadDiscussions()
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return discussions
    return discussions.filter(d =>
      (d.sujet || '').toLowerCase().includes(s) ||
      (d.cours?.titre || '').toLowerCase().includes(s)
    )
  }, [discussions, q])

  const openDiscussion = async (d: Discussion) => {
    setSelected(d)
    try {
      setLoadingMessages(true)
      const data = await getMessagesDiscussionV2(d.id)
      setMessages(Array.isArray(data) ? data : [])
    } catch {
      setMessages([])
      alert("Impossible de charger les messages.")
    } finally {
      setLoadingMessages(false)
    }
  }

  const send = async () => {
    if (!selected) return
    const contenu = msg.trim()
    if (!contenu) return
    if (!user?.id) return alert("Utilisateur non chargé (id manquant).")

    try {
      setSending(true)
      await envoyerMessageDiscussionV2(selected.id, user.id, contenu)
      setMsg('')
      await openDiscussion(selected)
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Erreur d'envoi")
    } finally {
      setSending(false)
    }
  }

  return (
    <DashboardLayout role="etudiant">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Discussions</h1>
        <p className="text-gray-600 mt-1">Échanges liés à vos cours</p>

        {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">{error}</div>}

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">Chargement…</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher…"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="space-y-3">
                {filtered.map(d => (
                  <div
                    key={d.id}
                    onClick={() => openDiscussion(d)}
                    className={`p-4 rounded-lg cursor-pointer transition ${
                      selected?.id === d.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">{d.sujet || '—'}</div>
                    <div className="text-xs text-gray-500">{d.cours?.titre || ''}</div>
                  </div>
                ))}
                {filtered.length === 0 && <div className="text-sm text-gray-600">Aucune discussion.</div>}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              {!selected ? (
                <div className="text-center text-gray-500 py-12">Sélectionnez une discussion.</div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <div className="font-semibold text-gray-800">{selected.sujet || 'Discussion'}</div>
                    <div className="text-xs text-gray-500 ml-auto">{selected.cours?.titre || ''}</div>
                  </div>

                  <div className="border rounded-lg p-3 h-[380px] overflow-y-auto bg-gray-50">
                    {loadingMessages ? (
                      <div className="text-gray-600">Chargement des messages…</div>
                    ) : messages.length === 0 ? (
                      <div className="text-gray-600">Aucun message.</div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map(m => (
                          <div key={m.id} className="bg-white rounded-lg p-3">
                            <div className="text-xs text-gray-500 flex justify-between">
                              <span>{m.auteur?.nomComplet || m.auteur?.email || 'Utilisateur'}</span>
                              <span>{formatDate(m.dateEnvoi)}</span>
                            </div>
                            <div className="text-gray-800 mt-1 whitespace-pre-wrap">{m.contenu}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <input
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder="Écrire un message…"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <Button onClick={send} disabled={sending}>
                      <Send className="w-4 h-4 mr-2" />
                      {sending ? 'Envoi…' : 'Envoyer'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
