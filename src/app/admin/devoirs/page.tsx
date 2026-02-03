'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Plus, Search, Edit, Trash2, FileText, Calendar } from 'lucide-react'

import {
  getDevoirs,
  createDevoir,
  updateDevoir,
  deleteDevoir,
} from '@/lib/api'

type Devoir = {
  id: number
  titre: string
  description?: string
  dateLimite?: string // ISO string
  coursId?: number
}

type FormState = {
  titre: string
  description: string
  dateLimite: string
  coursId: number | ''
}

export default function AdminDevoirsPage() {
  const [items, setItems] = useState<Devoir[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Devoir | null>(null)

  const [form, setForm] = useState<FormState>({
    titre: '',
    description: '',
    dateLimite: '',
    coursId: '',
  })

  const load = async () => {
    try {
      setLoading(true)
      const data = await getDevoirs()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      alert("Erreur lors du chargement des devoirs (vérifie token/rôle/endpoints).")
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
        String(d.id).includes(q)
      )
    })
  }, [items, search])

  const openCreate = () => {
    setEditing(null)
    setForm({ titre: '', description: '', dateLimite: '', coursId: '' })
    setShowModal(true)
  }

  const openEdit = (d: Devoir) => {
    setEditing(d)
    setForm({
      titre: d.titre ?? '',
      description: d.description ?? '',
      dateLimite: d.dateLimite ? d.dateLimite.slice(0, 16) : '', // pour input datetime-local
      coursId: d.coursId ?? '',
    })
    setShowModal(true)
  }

  const onSubmit = async () => {
    // payload minimal (adaptable selon ton DevoirRequest backend)
    const payload: any = {
      titre: form.titre.trim(),
      description: form.description.trim(),
    }

    if (!payload.titre) return alert('Titre requis')

    // optionnels si ton backend les accepte
    if (form.dateLimite) payload.dateLimite = new Date(form.dateLimite).toISOString()
    if (form.coursId !== '') payload.coursId = Number(form.coursId)

    try {
      if (editing) {
        await updateDevoir(editing.id, payload)
      } else {
        await createDevoir(payload)
      }
      setShowModal(false)
      await load()
    } catch (e) {
      console.error(e)
      alert("Erreur lors de l'enregistrement du devoir.")
    }
  }

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer ce devoir ?')) return
    try {
      await deleteDevoir(id)
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
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Devoirs</h1>
            <p className="text-gray-600 mt-1">{filtered.length} devoir(s)</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un devoir
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par titre/description/id..."
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
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      {d.titre}
                    </h3>
                    {/* <p className="text-sm text-gray-500">ID #{d.id}</p> */}
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

                {d.description ? (
                  <p className="text-gray-700 mb-4">{d.description}</p>
                ) : (
                  <p className="text-gray-400 italic mb-4">Aucune description</p>
                )}

                <div className="flex items-center justify-between border-t pt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    {d.dateLimite ? new Date(d.dateLimite).toLocaleString() : 'Pas de date limite'}
                  </span>

                  <span className="text-gray-500">
                    Cours: {d.coursId ?? '-'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editing ? 'Modifier le devoir' : 'Ajouter un devoir'}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                value={form.titre}
                onChange={(e) => setForm((p) => ({ ...p, titre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Devoir 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Consignes..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date limite</label>
                <input
                  type="datetime-local"
                  value={form.dateLimite}
                  onChange={(e) => setForm((p) => ({ ...p, dateLimite: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button onClick={onSubmit}>
                {editing ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
