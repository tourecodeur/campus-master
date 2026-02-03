'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Plus, Search, Edit, Trash2, FileText, Link as LinkIcon } from 'lucide-react'

import {
  getSupportsCours,
  createSupportCours,
  updateSupportCours,
  deleteSupportCours,
} from '@/lib/api'

type SupportCours = {
  id: number
  titre: string
  description?: string
  urlFichier?: string
  coursId?: number
  type: string
  nomFichier?: string
}

type FormState = {
  titre: string
  description: string
  urlFichier: string
  coursId: number | ''
}

export default function AdminDocumentsPage() {
  const [items, setItems] = useState<SupportCours[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<SupportCours | null>(null)

  const [form, setForm] = useState<FormState>({
    titre: '',
    description: '',
    urlFichier: '',
    coursId: '',
  })

  // ✅ Normalisation Backend -> Frontend (sans toucher api.ts)
  const normalizeSupport = (d: any): SupportCours => {
    const id = Number(d?.id)
    const titre = String(d?.titre ?? d?.nomFichier ?? '')
    const description = typeof d?.description === 'string' ? d.description : undefined
    const urlFichier = typeof d?.urlFichier === 'string' ? d.urlFichier : undefined

    // coursId peut venir de d.coursId ou d.cours.id selon backend
    const coursIdRaw = d?.coursId ?? d?.cours?.id
    const coursId = coursIdRaw !== undefined && coursIdRaw !== null ? Number(coursIdRaw) : undefined

    // ⚠️ fix principal: type toujours présent
    const type = String(d?.type ?? 'cours')

    const nomFichier =
      typeof d?.nomFichier === 'string'
        ? d.nomFichier
        : (typeof d?.titre === 'string' ? d.titre : undefined)

    return { id, titre, description, urlFichier, coursId, type, nomFichier }
  }

  const load = async () => {
    try {
      setLoading(true)
      const data = await getSupportsCours()
      const normalized = Array.isArray(data) ? data.map(normalizeSupport) : []
      setItems(normalized)
    } catch (e) {
      console.error(e)
      alert("Erreur lors du chargement des documents (vérifie token/rôle/endpoints).")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((d) => {
      return (
        (d.titre || '').toLowerCase().includes(q) ||
        (d.description || '').toLowerCase().includes(q) ||
        (d.urlFichier || '').toLowerCase().includes(q) ||
        (d.type || '').toLowerCase().includes(q) ||
        String(d.id).includes(q)
      )
    })
  }, [items, search])

  const openCreate = () => {
    setEditing(null)
    setForm({ titre: '', description: '', urlFichier: '', coursId: '' })
    setShowModal(true)
  }

  const openEdit = (d: SupportCours) => {
    setEditing(d)
    setForm({
      titre: d.titre ?? '',
      description: d.description ?? '',
      urlFichier: d.urlFichier ?? '',
      coursId: d.coursId ?? '',
    })
    setShowModal(true)
  }

  const onSubmit = async () => {
    const payload: any = {
      titre: form.titre.trim(),
      description: form.description.trim(),
      urlFichier: form.urlFichier.trim(),
    }

    if (!payload.titre) return alert('Titre requis')
    if (form.coursId !== '') payload.coursId = Number(form.coursId)

    try {
      if (editing) {
        await updateSupportCours(editing.id, payload)
      } else {
        await createSupportCours(payload)
      }
      setShowModal(false)
      await load()
    } catch (e) {
      console.error(e)
      alert("Erreur lors de l'enregistrement du document.")
    }
  }

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer ce document ?')) return
    try {
      await deleteSupportCours(id)
      await load()
    } catch (e) {
      console.error(e)
      alert('Erreur lors de la suppression.')
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Documents (Supports de cours)</h1>
            <p className="text-gray-600 mt-1">{filtered.length} document(s)</p>
          </div>

          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un document
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par titre/description/url/type/id..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((d) => (
            <div key={d.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      {d.titre}
                    </h2>
                    <p className="text-sm text-gray-500">{d.type}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(d)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(d.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* {d.description ? (
                  <p className="text-gray-700 mb-4">{d.description}</p>
                ) : (
                  <p className="text-gray-400 italic mb-4">Aucune description</p>
                )} */}

                <div className="flex items-center justify-between border-t pt-4 text-sm text-gray-600">
                  <span className="text-gray-500">Cours: {d.coursId ?? '-'}</span>

                  {d.urlFichier ? (
                    <a
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                      href={d.urlFichier}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Ouvrir
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Pas de lien</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editing ? 'Modifier le document' : 'Ajouter un document'}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                value={form.titre}
                onChange={(e) => setForm((p) => ({ ...p, titre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Support 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Résumé du document..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL du fichier</label>
              <input
                value={form.urlFichier}
                onChange={(e) => setForm((p) => ({ ...p, urlFichier: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cours ID (optionnel)</label>
              <input
                type="number"
                value={form.coursId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, coursId: e.target.value === '' ? '' : Number(e.target.value) }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button onClick={onSubmit}>{editing ? 'Modifier' : 'Créer'}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
