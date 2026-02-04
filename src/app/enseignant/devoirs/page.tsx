'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Plus, Search, FileText, Calendar, Edit, Trash2, Loader2 } from 'lucide-react'
import { enseignantGetMyCours, getDevoirs, createDevoir, updateDevoir, deleteDevoir } from '@/lib/api'

type BackendCours = {
  id: number
  titre?: string
}

type BackendDevoir = {
  id: number
  titre?: string
  consigne?: string
  dateLimite?: string // ISO
  cours?: { id: number; titre?: string } | null
}

function isoToDatetimeLocal(iso?: string) {
  if (!iso) return ''
  // "2025-01-10T12:00:00" -> "2025-01-10T12:00"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

function datetimeLocalToIso(v: string) {
  if (!v) return undefined
  // On envoie ISO standard
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}

export default function EnseignantDevoirsPage() {
  const [loading, setLoading] = useState(true)

  const [myCours, setMyCours] = useState<BackendCours[]>([])
  const [allDevoirs, setAllDevoirs] = useState<BackendDevoir[]>([])

  const [search, setSearch] = useState('')

  // Modal create/edit
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<BackendDevoir | null>(null)

  // Form fields
  const [fTitre, setFTitre] = useState('')
  const [fConsigne, setFConsigne] = useState('')
  const [fCoursId, setFCoursId] = useState<string>('')
  const [fDateLimite, setFDateLimite] = useState<string>('')

  const myCoursIdSet = useMemo(() => new Set(myCours.map((c) => c.id)), [myCours])

  const devoirs = useMemo(() => {
    // affiche uniquement les devoirs des cours de l’enseignant
    const filtered = allDevoirs.filter((d) => {
      const cid = d.cours?.id
      return typeof cid === 'number' && myCoursIdSet.has(cid)
    })

    const q = search.trim().toLowerCase()
    if (!q) return filtered

    return filtered.filter((d) => {
      const t = (d.titre ?? '').toLowerCase()
      const c = (d.cours?.titre ?? '').toLowerCase()
      return t.includes(q) || c.includes(q)
    })
  }, [allDevoirs, myCoursIdSet, search])

  const load = async () => {
    setLoading(true)
    try {
      const [coursRes, devoirsRes] = await Promise.all([enseignantGetMyCours(), getDevoirs()])
      setMyCours(Array.isArray(coursRes) ? coursRes : [])
      setAllDevoirs(Array.isArray(devoirsRes) ? devoirsRes : [])
    } catch (e: any) {
      console.error('Erreur chargement devoirs:', e?.response?.data ?? e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setFTitre('')
    setFConsigne('')
    setFCoursId(myCours?.[0]?.id ? String(myCours[0].id) : '')
    setFDateLimite('')
    setShowModal(true)
  }

  const openEdit = (d: BackendDevoir) => {
    setEditing(d)
    setFTitre(d.titre ?? '')
    setFConsigne(d.consigne ?? '')
    setFCoursId(d.cours?.id ? String(d.cours.id) : '')
    setFDateLimite(isoToDatetimeLocal(d.dateLimite))
    setShowModal(true)
  }

  const onSubmit = async () => {
    if (!fTitre.trim()) return alert('Titre requis')
    if (!fCoursId) return alert('Cours requis')

    const payload: any = {
      titre: fTitre.trim(),
      consigne: fConsigne?.trim() || undefined,
      coursId: Number(fCoursId),
      dateLimite: datetimeLocalToIso(fDateLimite),
    }

    try {
      if (editing?.id) {
        await updateDevoir(editing.id, payload)
      } else {
        await createDevoir(payload)
      }
      setShowModal(false)
      await load()
    } catch (e: any) {
      console.error('Erreur save devoir:', e?.response?.data ?? e)
      alert(e?.response?.data?.message ?? "Erreur lors de l'enregistrement")
    }
  }

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer ce devoir ?')) return
    try {
      await deleteDevoir(id)
      await load()
    } catch (e: any) {
      console.error('Erreur suppression devoir:', e?.response?.data ?? e)
      alert(e?.response?.data?.message ?? 'Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="enseignant">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="enseignant">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Devoirs</h1>
            <p className="text-gray-600 mt-1">
               filtré sur vos cours
            </p>
          </div>

          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau devoir
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par titre ou cours…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {devoirs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-600">
            Aucun devoir trouvé.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {devoirs.map((d) => (
              <div key={d.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-gray-800 truncate">{d.titre ?? `Devoir #${d.id}`}</h3>
                      <p className="text-sm text-gray-600 truncate">
                        {d.cours?.titre ? `Cours : ${d.cours.titre}` : d.cours?.id ? `Cours #${d.cours.id}` : 'Cours : —'}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEdit(d)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        aria-label="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(d.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-gray-700 mb-4">
                    {d.consigne ? d.consigne : <span className="text-gray-500 italic">Aucune consigne.</span>}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                      {d.dateLimite ? new Date(d.dateLimite).toLocaleString() : 'Date limite : —'}
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-500" />
      
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editing ? 'Modifier le devoir' : 'Créer un devoir'}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                value={fTitre}
                onChange={(e) => setFTitre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Ex: Devoir 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cours *</label>
              <select
                value={fCoursId}
                onChange={(e) => setFCoursId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Sélectionnez un cours</option>
                {myCours.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.titre ?? `Cours #${c.id}`}
                  </option>
                ))}
              </select>
              {myCours.length === 0 && (
                <p className="text-xs text-gray-500 mt-1 italic">Aucun cours rattaché à cet enseignant.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consigne</label>
              <textarea
                value={fConsigne}
                onChange={(e) => setFConsigne(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="Détails, attentes, consignes…"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date limite</label>
              <input
                type="datetime-local"
                value={fDateLimite}
                onChange={(e) => setFDateLimite(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button onClick={onSubmit}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editing ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
