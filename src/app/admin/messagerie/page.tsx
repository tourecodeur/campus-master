'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import useAuthStore, { type AuthState, type UiRole } from '@/lib/store'
import {
  getUtilisateurs,
  getHistoriquePrive,
  envoyerMessagePrive,
  getDiscussions,
  getMessagesDiscussion,
  envoyerMessageDiscussion,
} from '@/lib/api'
import { MessageCircle, Users, Send, Plus, Search } from 'lucide-react'

type Utilisateur = {
  id: number
  email: string
  nomComplet?: string
  role?: string // ROLE_ADMIN / ROLE_ETUDIANT / ROLE_ENSEIGNANT...
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


  // Onglets
  const [tab, setTab] = useState<'prive' | 'discussion'>('prive')

  // Utilisateurs
  const [users, setUsers] = useState<Utilisateur[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersSearch, setUsersSearch] = useState('')

  // Privé
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

  // DashboardLayout role prop doit être UiRole
  const layoutRole: UiRole = role ?? 'etudiant'

  // Sécurité basique : si pas auth, le layout gère déjà (redir)
  useEffect(() => {
    if (!isAuthenticated || !token) return
    // Chargement des utilisateurs pour messagerie privée
    ;(async () => {
      try {
        setUsersLoading(true)

        // ✅ On utilise /api/v1/utilisateurs uniquement si admin
        // Sinon : on peut quand même tenter (si backend autorise), sinon on gère l’erreur.
        const data = await getUtilisateurs()
        setUsers(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
        // fallback : on garde users vide, l’utilisateur peut quand même utiliser discussions
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
      alert("Impossible de charger l'historique (403/401 possible).")
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleCreateDiscussion = async () => {
    // Ici, on suppose que ton backend a POST /api/v1/discussions (body DiscussionRequest)
    // Si ton backend exige autre chose, adapte le payload dans api.ts.
    const title = newDiscussionTitle.trim()
    if (!title) return

    try {
      setSending(true)
      await fetch('/noop') // placeholder pour éviter TS unused in some setups
    } finally {
      setSending(false)
    }
  }

  return (
    <DashboardLayout role={layoutRole}>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Messagerie</h1>
            <p className="text-gray-600 mt-1">Privé + Discussions</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-3 mb-6 flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${
              tab === 'prive' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => setTab('prive')}
          >
            Privé
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${
              tab === 'discussion' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => setTab('discussion')}
          >
            Discussions
          </button>
        </div>

        {/* PRIVÉ */}
        {tab === 'prive' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste utilisateurs */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-800">Utilisateurs</h2>
              </div>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  value={usersSearch}
                  onChange={(e) => setUsersSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {usersLoading ? (
                <div className="text-sm text-gray-500">Chargement...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-sm text-gray-500">
                  Aucun utilisateur (si 403 sur /api/v1/utilisateurs, connecte-toi en ADMIN)
                </div>
              ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {filteredUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                        selectedUser?.id === u.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-gray-800">{u.nomComplet ?? u.email}</div>
                      <div className="text-xs text-gray-500">
                        #{u.id} • {u.role ?? 'ROLE?'}
                      </div>
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
                <div className="text-gray-500 text-sm">Sélectionne un utilisateur à gauche.</div>
              ) : (
                <>
                  <div className="flex-1 border rounded-lg p-3 overflow-y-auto bg-gray-50">
                    {loadingHistory ? (
                      <div className="text-sm text-gray-500">Chargement...</div>
                    ) : historique.length === 0 ? (
                      <div className="text-sm text-gray-500">Aucun message.</div>
                    ) : (
                      <div className="space-y-2">
                        {historique.map((m) => {
                          // heuristique : si expediteurId = user.id => message "moi"
                          const mine = m.expediteurId && user?.id ? m.expediteurId === user.id : false
                          return (
                            <div
                              key={m.id}
                              className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                                mine ? 'ml-auto bg-blue-600 text-white' : 'bg-white border'
                              }`}
                            >
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

                  <div className="mt-3 flex gap-2">
                    <input
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder="Écrire un message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* DISCUSSIONS */}
        {tab === 'discussion' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste discussions */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-800">Discussions</h2>
                </div>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => {
                    setNewDiscussionTitle('')
                    setCreatingDiscussion(true)
                  }}
                  title="Créer"
                >
                  <Plus className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {loadingDiscussions ? (
                <div className="text-sm text-gray-500">Chargement...</div>
              ) : discussions.length === 0 ? (
                <div className="text-sm text-gray-500">Aucune discussion.</div>
              ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {discussions.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleSelectDiscussion(d)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                        selectedDiscussion?.id === d.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-gray-800">{d.titre ?? `Discussion #${d.id}`}</div>
                      <div className="text-xs text-gray-500">ID #{d.id}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Messages discussion */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4 flex flex-col">
              <h2 className="font-semibold text-gray-800 mb-3">
                {selectedDiscussion ? (selectedDiscussion.titre ?? `Discussion #${selectedDiscussion.id}`) : 'Sélectionne une discussion'}
              </h2>

              {!selectedDiscussion ? (
                <div className="text-gray-500 text-sm">Choisis une discussion à gauche.</div>
              ) : (
                <>
                  <div className="flex-1 border rounded-lg p-3 overflow-y-auto bg-gray-50">
                    {loadingDiscMessages ? (
                      <div className="text-sm text-gray-500">Chargement...</div>
                    ) : discussionMessages.length === 0 ? (
                      <div className="text-sm text-gray-500">Aucun message.</div>
                    ) : (
                      <div className="space-y-2">
                        {discussionMessages.map((m) => (
                          <div key={m.id} className="bg-white border rounded-lg p-3 text-sm">
                            <div className="text-gray-800">{m.contenu}</div>
                            <div className="text-[11px] text-gray-400 mt-1">
                              {m.dateEnvoi ? new Date(m.dateEnvoi).toLocaleString() : ''} • auteur #{m.auteurId ?? '-'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input
                      value={discMsg}
                      onChange={(e) => setDiscMsg(e.target.value)}
                      placeholder="Écrire un message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendDiscussion()
                      }}
                    />
                    <Button onClick={handleSendDiscussion} disabled={sending}>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Modal créer discussion */}
        <Modal
          isOpen={creatingDiscussion}
          onClose={() => setCreatingDiscussion(false)}
          title="Créer une discussion"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                value={newDiscussionTitle}
                onChange={(e) => setNewDiscussionTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Groupe L3 Réseaux"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCreatingDiscussion(false)}>
                Annuler
              </Button>
              <Button
                onClick={async () => {
                  // Si tu veux activer création, ajoute createDiscussion dans api.ts
                  alert("Création discussion: ajoute createDiscussion dans api.ts si besoin.")
                  setCreatingDiscussion(false)
                }}
              >
                Créer
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
