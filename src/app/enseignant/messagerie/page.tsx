'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { MessageCircle, Users, Send, Plus, Search } from 'lucide-react'
import useAuthStore, { type AuthState, type UiRole } from '@/lib/store'
import {
  getUtilisateurs,
  getHistoriquePrive,
  envoyerMessagePrive,
  getDiscussions,
  getMessagesDiscussion,
  envoyerMessageDiscussion,
} from '@/lib/api'

type Utilisateur = {
  id: number
  email: string
  nomComplet?: string
  role?: string
}

type MessagePrive = {
  id: number
  expediteurId?: number
  destinataireId?: number
  contenu: string
  dateEnvoi?: string
}

type Discussion = {
  id: number
  titre?: string
  creeParId?: number
}

type MessageDiscussion = {
  id: number
  discussionId: number
  contenu: string
  auteurId?: number
  dateEnvoi?: string
}

const authSelector = (s: AuthState) => ({
  role: s.role,
  token: s.token,
  user: s.user,
  isAuthenticated: s.isAuthenticated,
})

export default function MessageriePage() {
  const role = useAuthStore((s) => s.role)
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  // Vérification du rôle de l'utilisateur pour autoriser l'accès à cette page
  useEffect(() => {
    if (role !== 'enseignant') {
      alert("Accès réservé aux enseignants.");
      return;
    }
  }, [role]);

  // Onglets
  const [tab, setTab] = useState<'prive' | 'discussion'>('prive')

  // Utilisateurs
  const [users, setUsers] = useState<Utilisateur[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersSearch, setUsersSearch] = useState('')

  // Messages privés
  const [selectedUser, setSelectedUser] = useState<Utilisateur | null>(null)
  const [historique, setHistorique] = useState<MessagePrive[]>([])
  const [msg, setMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Discussions
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null)
  const [discussionMessages, setDiscussionMessages] = useState<MessageDiscussion[]>([])
  const [loadingDiscussions, setLoadingDiscussions] = useState(false)
  const [loadingDiscMessages, setLoadingDiscMessages] = useState(false)
  const [discMsg, setDiscMsg] = useState('')
  const [creatingDiscussion, setCreatingDiscussion] = useState(false)
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('')

  // DashboardLayout rôle doit être UiRole
  const layoutRole: UiRole = role ?? 'enseignant'

  useEffect(() => {
    if (!isAuthenticated || !token) return
    // Charger les utilisateurs
    ;(async () => {
      try {
        setUsersLoading(true)
        const data = await getUtilisateurs()
        setUsers(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
        setUsers([])
      } finally {
        setUsersLoading(false)
      }
    })()
  }, [isAuthenticated, token])

  const filteredUsers = useMemo(() => {
    const q = usersSearch.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => {
      return (
        (u.email || '').toLowerCase().includes(q) ||
        (u.nomComplet || '').toLowerCase().includes(q) ||
        String(u.id).includes(q)
      )
    })
  }, [users, usersSearch])

  const loadHistorique = async (avecUtilisateurId: number) => {
    try {
      setLoadingHistory(true)
      const data = await getHistoriquePrive(avecUtilisateurId)
      setHistorique(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      alert("Impossible de charger l'historique.")
      setHistorique([])
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleSelectUser = async (u: Utilisateur) => {
    setSelectedUser(u)
    await loadHistorique(u.id)
  }

  const handleSendPrivate = async () => {
    if (!selectedUser) return
    const content = msg.trim()
    if (!content) return

    try {
      setSending(true)
      await envoyerMessagePrive(selectedUser.id, content)
      setMsg('')
      await loadHistorique(selectedUser.id)
    } catch (e) {
      console.error(e)
      alert("Erreur lors de l'envoi du message privé.")
    } finally {
      setSending(false)
    }
  }

  const loadDiscussions = async () => {
    try {
      setLoadingDiscussions(true)
      const data = await getDiscussions()
      setDiscussions(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      alert('Impossible de charger les discussions.')
      setDiscussions([])
    } finally {
      setLoadingDiscussions(false)
    }
  }

  const loadDiscussionMessages = async (discussionId: number) => {
    try {
      setLoadingDiscMessages(true)
      const data = await getMessagesDiscussion(discussionId)
      setDiscussionMessages(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      alert('Impossible de charger les messages de la discussion.')
      setDiscussionMessages([])
    } finally {
      setLoadingDiscMessages(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !token) return
    if (tab === 'discussion') {
      loadDiscussions()
    }
  }, [tab, isAuthenticated, token])

  const handleSelectDiscussion = async (d: Discussion) => {
    setSelectedDiscussion(d)
    await loadDiscussionMessages(d.id)
  }

  const handleSendDiscussion = async () => {
    if (!selectedDiscussion) return
    const content = discMsg.trim()
    if (!content) return

    try {
      setSending(true)
      await envoyerMessageDiscussion(selectedDiscussion.id, content)
      setDiscMsg('')
      await loadDiscussionMessages(selectedDiscussion.id)
    } catch (e) {
      console.error(e)
      alert("Erreur lors de l'envoi du message dans la discussion.")
    } finally {
      setSending(false)
    }
  }

  return (
    <DashboardLayout role={layoutRole}>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Messagerie Enseignant</h1>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-xl shadow-md p-3 mb-6 flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${tab === 'prive' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => setTab('prive')}
          >
            Messages Privés
          </button>
          {/* <button
            className={`px-4 py-2 rounded-lg font-medium transition ${tab === 'discussion' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => setTab('discussion')}
          >
            Discussions
          </button> */}
        </div>

        {/* Messages privés */}
        {tab === 'prive' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste utilisateurs */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-800">Utilisateurs</h2>
              </div>
              {/* Recherche */}
              <input
                value={usersSearch}
                onChange={(e) => setUsersSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {/* Liste utilisateurs */}
              {usersLoading ? (
                <div className="text-sm text-gray-500">Chargement...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-sm text-gray-500">Aucun utilisateur trouvé.</div>
              ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {filteredUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition ${selectedUser?.id === u.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <div className="font-medium text-gray-800">{u.nomComplet ?? u.email}</div>
                      <div className="text-xs text-gray-500">#{u.id}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Historique */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-800">
                  Conversation {selectedUser ? `avec ${selectedUser.nomComplet ?? selectedUser.email}` : ''}
                </h2>
              </div>

              {!selectedUser ? (
                <div className="text-gray-500 text-sm">Sélectionnez un utilisateur pour discuter.</div>
              ) : (
                <>
                  {/* Affichage des messages */}
                  <div className="flex-1 border rounded-lg p-3 overflow-y-auto bg-gray-50">
                    {loadingHistory ? (
                      <div className="text-sm text-gray-500">Chargement...</div>
                    ) : historique.length === 0 ? (
                      <div className="text-sm text-gray-500">Aucun message.</div>
                    ) : (
                      <div className="space-y-2">
                        {historique.map((m) => {
                          const mine = m.expediteurId && user?.id ? m.expediteurId === user.id : false
                          return (
                            <div key={m.id} className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${mine ? 'ml-auto bg-blue-600 text-white' : 'bg-white border'}`}>
                              <div>{m.contenu}</div>
                              <div className={`mt-1 text-[11px] ${mine ? 'text-blue-100' : 'text-gray-400'}`}>
                                {m.dateEnvoi ? new Date(m.dateEnvoi).toLocaleString() : ''}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="mt-3 flex gap-2">
                    <input
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder="Écrire un message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendPrivate()
                      }}
                    />
                    <Button onClick={handleSendPrivate} disabled={sending}>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer
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
