'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { api } from '@/lib/api'
import { Search, Save, CheckCircle, Clock } from 'lucide-react'

/** ================== Types ================== */
type Cours = {
  id: number
  titre?: string
}

type Devoir = {
  id: number
  titre: string
  dateLimite?: string
  cours?: { id: number; titre?: string }
}

type Utilisateur = {
  id: number
  nomComplet?: string
  email?: string
}

type NoteDevoir = {
  note?: number | null
  commentaire?: string | null
}

type DepotDevoir = {
  id: number
  urlFichier?: string | null
  version?: number
  dateDepot?: string | null
  devoir?: Devoir | null
  etudiant?: Utilisateur | null
  note?: NoteDevoir | null
}

/** ================== Helpers ================== */
function asArray<T>(data: any): T[] {
  // support: [] direct, {data: []}, {content: []} (pageable)
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.content)) return data.content
  return []
}

function safeName(u?: Utilisateur | null) {
  if (!u) return '—'
  return u.nomComplet || u.email || `Etudiant #${u.id}`
}

function formatDate(s?: string | null) {
  if (!s) return '—'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return s
  return d.toLocaleString()
}

function isNoted(dp: DepotDevoir) {
  return dp.note?.note !== null && dp.note?.note !== undefined
}

/** ================== Page ================== */
export default function NotesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [cours, setCours] = useState<Cours[]>([])
  const [devoirs, setDevoirs] = useState<Devoir[]>([])
  const [depots, setDepots] = useState<DepotDevoir[]>([]) // ✅ toujours un tableau

  const [selectedCoursId, setSelectedCoursId] = useState<number | null>(null)
  const [selectedDevoirId, setSelectedDevoirId] = useState<number | null>(null)

  const [search, setSearch] = useState('')
  const [savingDepotId, setSavingDepotId] = useState<number | null>(null)

  // note/commentaire en édition par dépôt
  const [draft, setDraft] = useState<Record<number, { note: string; commentaire: string }>>({})

  /** ================== API ================== */
  const fetchMesCours = async (): Promise<Cours[]> => {
    const res = await api.get('/api/enseignants/me/cours')
    return asArray<Cours>(res.data)
  }

  const fetchDevoirs = async (): Promise<Devoir[]> => {
    const res = await api.get('/api/v1/devoirs')
    return asArray<Devoir>(res.data)
  }

  const fetchDepots = async (): Promise<DepotDevoir[]> => {
    const res = await api.get('/api/v1/depots-devoir')
    return asArray<DepotDevoir>(res.data)
  }

  const noterDepot = async (depotId: number, note: number, commentaire: string) => {
    await api.post(`/api/enseignants/me/depots/${depotId}/noter`, null, {
      params: { note, commentaire },
    })
  }

  /** ================== Load ================== */
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const [c, d, dp] = await Promise.all([fetchMesCours(), fetchDevoirs(), fetchDepots()])

        setCours(c)
        setDevoirs(d)
        setDepots(dp) // ✅ dp est forcément array grâce à asArray()

        // sélection par défaut
        const firstCoursId = c?.[0]?.id ?? null
        setSelectedCoursId(firstCoursId)

        const firstDevoirId = d.find(x => x.cours?.id === firstCoursId)?.id ?? null
        setSelectedDevoirId(firstDevoirId)

        // init draft
        const initDraft: Record<number, { note: string; commentaire: string }> = {}
        for (const item of dp) {
          initDraft[item.id] = {
            note: item.note?.note === null || item.note?.note === undefined ? '' : String(item.note.note),
            commentaire: item.note?.commentaire || '',
          }
        }
        setDraft(initDraft)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  /** ================== Derived ================== */
  const devoirsDuCours = useMemo(() => {
    if (!selectedCoursId) return []
    return devoirs.filter(d => d.cours?.id === selectedCoursId)
  }, [devoirs, selectedCoursId])

  const depotsFiltres = useMemo(() => {
    // ✅ depots est toujours un array, donc pas de crash
    if (!selectedCoursId) return []

    let list = depots.filter(dp => dp.devoir?.cours?.id === selectedCoursId)

    if (selectedDevoirId) {
      list = list.filter(dp => dp.devoir?.id === selectedDevoirId)
    }

    if (search.trim()) {
      const s = search.trim().toLowerCase()
      list = list.filter(dp => {
        const n = safeName(dp.etudiant).toLowerCase()
        const email = (dp.etudiant?.email || '').toLowerCase()
        const titre = (dp.devoir?.titre || '').toLowerCase()
        return n.includes(s) || email.includes(s) || titre.includes(s)
      })
    }

    list.sort((a, b) => {
      const da = a.dateDepot ? new Date(a.dateDepot).getTime() : 0
      const db = b.dateDepot ? new Date(b.dateDepot).getTime() : 0
      return db - da
    })

    return list
  }, [depots, selectedCoursId, selectedDevoirId, search])

  const pendingCount = useMemo(() => depotsFiltres.filter(d => !isNoted(d)).length, [depotsFiltres])

  /** ================== Actions ================== */
  const reloadDepots = async () => {
    const dp = await fetchDepots()
    setDepots(dp)

    // refresh draft (sans écraser ce que l’enseignant est en train de saisir si tu veux, mais ici on ré-aligne)
    setDraft(prev => {
      const next = { ...prev }
      for (const item of dp) {
        if (!next[item.id]) {
          next[item.id] = {
            note: item.note?.note === null || item.note?.note === undefined ? '' : String(item.note.note),
            commentaire: item.note?.commentaire || '',
          }
        }
      }
      return next
    })
  }

  const saveOne = async (dp: DepotDevoir) => {
    const d = draft[dp.id] || { note: '', commentaire: '' }
    const noteNum = Number(d.note)

    if (!d.note || Number.isNaN(noteNum) || noteNum < 0 || noteNum > 20) {
      alert('Veuillez saisir une note valide entre 0 et 20.')
      return
    }

    try {
      setSavingDepotId(dp.id)
      await noterDepot(dp.id, noteNum, d.commentaire || '')
      await reloadDepots()
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || 'Erreur lors de l’enregistrement')
    } finally {
      setSavingDepotId(null)
    }
  }

  const saveAll = async () => {
    const list = depotsFiltres
    const items = list
      .map(dp => ({ dp, d: draft[dp.id] }))
      .filter(x => x.d?.note && !Number.isNaN(Number(x.d.note)))

    if (items.length === 0) {
      alert('Aucune note à enregistrer.')
      return
    }

    try {
      setLoading(true)
      for (const it of items) {
        const n = Number(it.d.note)
        if (Number.isNaN(n) || n < 0 || n > 20) continue
        await noterDepot(it.dp.id, n, it.d.commentaire || '')
      }
      await reloadDepots()
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || 'Erreur lors de l’enregistrement global')
    } finally {
      setLoading(false)
    }
  }

  /** ================== UI ================== */
  return (
    <DashboardLayout role="enseignant">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Notes & Devoirs</h1>
          <p className="text-gray-600 mt-1">Récupérez les dépôts, notez et modifiez les notes des étudiants.</p>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-700">Chargement…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Mes cours</h2>

                <div className="space-y-3">
                  {cours.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCoursId(c.id)
                        const first = devoirs.find(d => d.cours?.id === c.id)?.id ?? null
                        setSelectedDevoirId(first)
                      }}
                      className={`p-4 rounded-lg cursor-pointer transition ${
                        selectedCoursId === c.id
                          ? 'bg-blue-50 border-l-4 border-blue-600'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-semibold text-gray-800">{c.titre || `Cours #${c.id}`}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {c.id}</div>
                    </div>
                  ))}
                  {cours.length === 0 && <p className="text-sm text-gray-600">Aucun cours trouvé.</p>}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Devoirs</h2>

                <select
                  value={selectedDevoirId ?? ''}
                  onChange={(e) => setSelectedDevoirId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Tous les devoirs</option>
                  {devoirsDuCours.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.titre}
                    </option>
                  ))}
                </select>

                <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  Dépôts en attente (non notés) : <span className="font-semibold">{pendingCount}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={saveAll}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer tout
                  </button>

                  <button
                    onClick={reloadDepots}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    title="Rafraîchir dépôts"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher étudiant, email ou devoir…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Étudiant</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Devoir</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Dépôt</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Note /20</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Commentaire</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {depotsFiltres.map((dp) => {
                        const d = draft[dp.id] || { note: '', commentaire: '' }
                        const noted = isNoted(dp)

                        return (
                          <tr key={dp.id} className="border-b hover:bg-gray-50 transition">
                            <td className="py-4 px-4">
                              <div className="font-medium text-gray-800">{safeName(dp.etudiant)}</div>
                              <div className="text-xs text-gray-500">{dp.etudiant?.email || ''}</div>
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-medium text-gray-800">{dp.devoir?.titre || '—'}</div>
                              <div className="text-xs text-gray-500">
                                Limite : {formatDate(dp.devoir?.dateLimite || null)}
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <div className="text-xs text-gray-500">{formatDate(dp.dateDepot)}</div>
                              <div className="text-xs text-gray-500">Version: {dp.version ?? 1}</div>
                              {dp.urlFichier ? (
                                <a
                                  href={dp.urlFichier}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                                >
                                  Ouvrir le fichier
                                </a>
                              ) : (
                                <div className="text-xs text-gray-500">Aucun fichier</div>
                              )}
                              <div className="mt-2 text-xs">
                                {noted ? (
                                  <span className="text-green-700 bg-green-50 px-2 py-1 rounded">Noté</span>
                                ) : (
                                  <span className="text-yellow-700 bg-yellow-50 px-2 py-1 rounded">En attente</span>
                                )}
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                step={0.5}
                                value={d.note}
                                onChange={(e) =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    [dp.id]: { ...prev[dp.id], note: e.target.value },
                                  }))
                                }
                                className="w-24 border border-gray-300 rounded px-3 py-1 text-center"
                                placeholder="0-20"
                              />
                            </td>

                            <td className="py-4 px-4">
                              <textarea
                                value={d.commentaire}
                                onChange={(e) =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    [dp.id]: { ...prev[dp.id], commentaire: e.target.value },
                                  }))
                                }
                                className="w-64 border border-gray-300 rounded px-3 py-2 text-sm"
                                placeholder="Commentaire (optionnel)"
                                rows={2}
                              />
                            </td>

                            <td className="py-4 px-4">
                              <button
                                onClick={() => saveOne(dp)}
                                disabled={savingDepotId === dp.id}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition text-sm flex items-center"
                              >
                                {savingDepotId === dp.id ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Enregistrement…
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Enregistrer
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        )
                      })}

                      {depotsFiltres.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-600">
                            Aucun dépôt trouvé pour ce filtre.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-6 border-t flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Total dépôts affichés : <span className="font-semibold">{depotsFiltres.length}</span>
                  </div>

                  <button
                    onClick={saveAll}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Enregistrer tout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
