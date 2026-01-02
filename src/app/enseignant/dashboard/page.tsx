'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { api } from '@/lib/api'
import {
  BookOpen,
  Users,
  Clock,
  Award,
  Calendar,
  Bell,
  FileText,
  CheckCircle,
} from 'lucide-react'

type Cours = { id: number; titre?: string }
type Devoir = {
  id: number
  titre: string
  dateLimite?: string
  cours?: { id: number; titre?: string }
}
type Utilisateur = { id: number; nomComplet?: string; email?: string }
type NoteDevoir = { note?: number | null; commentaire?: string | null }
type DepotDevoir = {
  id: number
  urlFichier?: string | null
  version?: number
  dateDepot?: string | null
  devoir?: Devoir | null
  etudiant?: Utilisateur | null
  note?: NoteDevoir | null
}

function asArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.content)) return data.content
  return []
}

function toDate(ts?: string | null) {
  if (!ts) return null
  const d = new Date(ts)
  return Number.isNaN(d.getTime()) ? null : d
}

function formatDate(ts?: string | null) {
  const d = toDate(ts)
  return d ? d.toLocaleString() : '—'
}

function formatShortDate(ts?: string | null) {
  const d = toDate(ts)
  return d ? d.toLocaleDateString() : '—'
}

function isNoted(dp: DepotDevoir) {
  return dp.note?.note !== null && dp.note?.note !== undefined
}

export default function EnseignantDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [cours, setCours] = useState<Cours[]>([])
  const [devoirs, setDevoirs] = useState<Devoir[]>([])
  const [depots, setDepots] = useState<DepotDevoir[]>([])

  /** ===== Load backend ===== */
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const [cRes, dRes, dpRes] = await Promise.all([
          api.get('/api/enseignants/me/cours'),
          api.get('/api/v1/devoirs'),
          api.get('/api/v1/depots-devoir'),
        ])

        const c = asArray<Cours>(cRes.data)
        const d = asArray<Devoir>(dRes.data)
        const dp = asArray<DepotDevoir>(dpRes.data)

        setCours(c)
        setDevoirs(d)
        setDepots(dp)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  /** ===== IDs utiles ===== */
  const coursIds = useMemo(() => new Set(cours.map(c => c.id)), [cours])

  const devoirsEnseignant = useMemo(() => {
    // on garde uniquement les devoirs dont le cours appartient à l’enseignant
    return devoirs.filter(d => (d.cours?.id ? coursIds.has(d.cours.id) : false))
  }, [devoirs, coursIds])

  const depotsEnseignant = useMemo(() => {
    // on garde uniquement les dépôts dont le devoir appartient aux cours de l’enseignant
    return depots.filter(dp => {
      const cid = dp.devoir?.cours?.id
      return cid ? coursIds.has(cid) : false
    })
  }, [depots, coursIds])

  /** ===== Stats dynamiques ===== */
  const stats = useMemo(() => {
    const coursEnseignes = cours.length

    // total étudiants uniques (basé sur les dépôts reçus)
    const etuSet = new Set<number>()
    for (const dp of depotsEnseignant) {
      if (dp.etudiant?.id) etuSet.add(dp.etudiant.id)
    }
    const totalEtudiants = etuSet.size

    // heures/semaine: non disponible via les endpoints listés → on n’invente pas
    const heuresEnseignement: number | null = null

    // moyenne générale: moyenne des notes saisies (sur dépôts notés)
    const notes = depotsEnseignant
      .map(d => d.note?.note)
      .filter((n): n is number => typeof n === 'number')
    const moyenneGenerale = notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : null

    return { coursEnseignes, totalEtudiants, heuresEnseignement, moyenneGenerale }
  }, [cours, depotsEnseignant])

  /** ===== Activités récentes (dynamique) =====
   *  - “Dépôt reçu” (dateDepot)
   *  - “Dépôt noté” (si note existe)
   */
  const recentActivities = useMemo(() => {
    const items = depotsEnseignant
      .slice()
      .sort((a, b) => {
        const da = toDate(a.dateDepot)?.getTime() ?? 0
        const db = toDate(b.dateDepot)?.getTime() ?? 0
        return db - da
      })
      .slice(0, 6)
      .map(dp => {
        const course = dp.devoir?.cours?.titre || '—'
        const devoirTitle = dp.devoir?.titre || '—'
        const etu = dp.etudiant?.nomComplet || dp.etudiant?.email || 'Étudiant'
        const noted = isNoted(dp)
        return {
          id: dp.id,
          type: noted ? 'note' : 'depot',
          title: noted ? `Dépôt noté — ${course}` : `Dépôt reçu — ${course}`,
          description: noted
            ? `${etu} • ${devoirTitle} • Note: ${dp.note?.note}/20`
            : `${etu} • ${devoirTitle}`,
          date: formatShortDate(dp.dateDepot || null),
        }
      })

    return items
  }, [depotsEnseignant])

  /** ===== “Cours à venir” -> on remplace par “Devoirs à venir” (dynamique) ===== */
  const upcomingDevoirs = useMemo(() => {
    const now = Date.now()
    return devoirsEnseignant
      .filter(d => {
        const dl = toDate(d.dateLimite || null)?.getTime()
        return typeof dl === 'number' && dl > now
      })
      .slice()
      .sort((a, b) => {
        const da = toDate(a.dateLimite || null)?.getTime() ?? 0
        const db = toDate(b.dateLimite || null)?.getTime() ?? 0
        return da - db
      })
      .slice(0, 5)
  }, [devoirsEnseignant])

  /** ===== Devoirs à corriger (dynamique) ===== */
  const devoirsACorriger = useMemo(() => {
    const map = new Map<
      number,
      {
        devoir: Devoir
        submissions: number
        aCorriger: number
        etudiantsUniques: Set<number>
      }
    >()

    // initialise sur les devoirs de l’enseignant
    for (const dv of devoirsEnseignant) {
      map.set(dv.id, { devoir: dv, submissions: 0, aCorriger: 0, etudiantsUniques: new Set<number>() })
    }

    for (const dp of depotsEnseignant) {
      const did = dp.devoir?.id
      if (!did || !map.has(did)) continue

      const item = map.get(did)!
      item.submissions += 1
      if (!isNoted(dp)) item.aCorriger += 1
      if (dp.etudiant?.id) item.etudiantsUniques.add(dp.etudiant.id)
    }

    // tri : d’abord ceux qui ont le + à corriger
    return Array.from(map.values())
      .filter(x => x.submissions > 0) // on affiche ceux qui ont au moins un dépôt
      .sort((a, b) => b.aCorriger - a.aCorriger)
      .slice(0, 10)
  }, [devoirsEnseignant, depotsEnseignant])

  /** ===== UI ===== */
  return (
    <DashboardLayout role="enseignant">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord Enseignant</h1>
          <p className="text-gray-600 mt-1">Bienvenue sur votre espace d'enseignement</p>

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
          <>
            {/* ===== Stats ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Cours enseignés</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.coursEnseignes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Étudiants (uniques)</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalEtudiants}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Heures/semaine</p>
                    {/* ✅ pas d’invention : si backend ne donne pas, on affiche — */}
                    <p className="text-2xl font-bold text-gray-800">{stats.heuresEnseignement ?? '—'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Moyenne générale</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.moyenneGenerale === null ? '—' : `${stats.moyenneGenerale.toFixed(2)}/20`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Activités + Devoirs à venir ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-600" />
                  Activités récentes
                </h2>

                {recentActivities.length === 0 ? (
                  <p className="text-sm text-gray-600">Aucune activité récente.</p>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map(a => (
                      <div key={a.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${a.type === 'note' ? 'bg-green-500' : 'bg-blue-500'}`} />
                        <div className="flex-1">
                          <div className="flex justify-between gap-3">
                            <p className="font-medium">{a.title}</p>
                            <span className="text-xs text-gray-500">{a.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{a.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  Devoirs à venir
                </h2>

                {upcomingDevoirs.length === 0 ? (
                  <p className="text-sm text-gray-600">Aucun devoir à venir.</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingDevoirs.map(dv => (
                      <div key={dv.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2 gap-3">
                          <h3 className="font-semibold text-gray-800">{dv.titre}</h3>
                          <span className="text-sm font-medium text-blue-600">{formatShortDate(dv.dateLimite || null)}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="mr-2">📘 {dv.cours?.titre || '—'}</span>
                          <span>⏳ {formatDate(dv.dateLimite || null)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ===== Devoirs à corriger (table) ===== */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-700" />
                Devoirs à corriger
              </h2>

              {devoirsACorriger.length === 0 ? (
                <p className="text-sm text-gray-600">Aucun dépôt à corriger pour le moment.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Cours</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Devoir</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Date limite</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Soumissions</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">À corriger</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {devoirsACorriger.map(row => (
                        <tr key={row.devoir.id} className="border-b hover:bg-gray-50 transition">
                          <td className="py-4 px-6">{row.devoir.cours?.titre || '—'}</td>
                          <td className="py-4 px-6">{row.devoir.titre}</td>
                          <td className="py-4 px-6">{formatShortDate(row.devoir.dateLimite || null)}</td>
                          <td className="py-4 px-6">
                            {row.submissions}
                            <span className="ml-2 text-xs text-gray-500">
                              (étudiants: {row.etudiantsUniques.size})
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                row.aCorriger > 10
                                  ? 'bg-red-100 text-red-800'
                                  : row.aCorriger > 0
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {row.aCorriger}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {/* Action simple : diriger vers la page notes (ou avec filtre via query si tu veux) */}
                            <a
                              href="/enseignant/notes"
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Corriger
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
