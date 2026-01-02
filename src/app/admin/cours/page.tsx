'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Modal from '@/components/ui/Modal'
import CoursForm, { CoursFormData } from '@/components/forms/CoursForm'
import {
  Plus,
  Search,
  BookOpen,
  Calendar,
  Edit,
  Trash2,
  User as UserIcon,
  Layers,
  GraduationCap,
} from 'lucide-react'

import {
  getCours,
  createCours,
  updateCours,
  deleteCours,
  getSemestres,
  getEnseignants,
  // ✅ nouveaux imports
  getModules,
  createSemestre,
  createModule,
  createMatiere,
} from '@/lib/api'

type CoursApi = {
  id: number
  titre: string
  description?: string | null
  semestreId?: number | null
  enseignantId?: number | null
  semestre?: { id: number; libelle?: string; nom?: string; code?: string }
  enseignant?: { id: number; nomComplet?: string; email?: string; nom?: string; prenom?: string }
}

type Semestre = { id: number; libelle?: string; nom?: string; code?: string; description?: string }
type Enseignant = { id: number; nomComplet?: string; email?: string; nom?: string; prenom?: string }
type Module = { id: number; code: string; libelle: string }

export default function CoursPage() {
  const [cours, setCours] = useState<CoursApi[]>([])
  const [semestres, setSemestres] = useState<Semestre[]>([])
  const [enseignants, setEnseignants] = useState<Enseignant[]>([])
  const [modules, setModules] = useState<Module[]>([])

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [selectedCours, setSelectedCours] = useState<CoursApi | null>(null)

  // ✅ Modals “référentiels”
  const [showSemestreModal, setShowSemestreModal] = useState(false)
  const [showModuleModal, setShowModuleModal] = useState(false)
  const [showMatiereModal, setShowMatiereModal] = useState(false)

  // ✅ form states
  const [semestreForm, setSemestreForm] = useState({ code: '', description: '' })
  const [moduleForm, setModuleForm] = useState({ code: '', libelle: '' })
  const [matiereForm, setMatiereForm] = useState({ libelle: '', moduleId: 0 })

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const [coursData, semestresData, enseignantsData, modulesData] = await Promise.all([
          getCours(),
          getSemestres(),
          getEnseignants(),
          getModules(),
        ])
        setCours(coursData ?? [])
        setSemestres(semestresData ?? [])
        setEnseignants(enseignantsData ?? [])
        setModules(modulesData ?? [])
      } catch (e) {
        console.error('Erreur load:', e)
        alert("Impossible de charger les données (cours/semestres/enseignants/modules). Vérifie le backend + token.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const semestreLabelById = useMemo(() => {
    const map = new Map<number, string>()
    semestres.forEach((s: Semestre) => {
      // ✅ on privilégie code (backend)
      const label = s.code || s.libelle || s.nom || `Semestre #${s.id}`
      map.set(s.id, label)
    })
    return map
  }, [semestres])

  const enseignantLabelById = useMemo(() => {
    const map = new Map<number, string>()
    enseignants.forEach((u: Enseignant) => {
      const label =
        u.nomComplet ||
        `${u.prenom ?? ''} ${u.nom ?? ''}`.trim() ||
        u.email ||
        `Enseignant #${u.id}`
      map.set(u.id, label)
    })
    return map
  }, [enseignants])

  const loadCoursOnly = async () => {
    const data = await getCours()
    setCours(data ?? [])
  }

  const reloadRefs = async () => {
    const [s, m] = await Promise.all([getSemestres(), getModules()])
    setSemestres(s ?? [])
    setModules(m ?? [])
  }

  const handleCreate = () => {
    setSelectedCours(null)
    setShowModal(true)
  }

  const handleEdit = (c: CoursApi) => {
    setSelectedCours(c)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return
    try {
      await deleteCours(id)
      await loadCoursOnly()
    } catch (e) {
      console.error('Erreur suppression:', e)
      alert("Erreur lors de la suppression. Vérifie les droits (ADMIN) et l'existence du cours.")
    }
  }

  const handleSubmit = async (data: CoursFormData) => {
    try {
      if (selectedCours) {
        await updateCours(selectedCours.id, data)
      } else {
        await createCours(data)
      }
      setShowModal(false)
      await loadCoursOnly()
    } catch (e) {
      console.error("Erreur enregistrement:", e)
      alert("Erreur lors de l'enregistrement. Vérifie que le backend accepte le payload.")
    }
  }

  // ===================== CRUD Référentiels =====================

  const submitSemestre = async () => {
    const code = semestreForm.code.trim()
    if (!code) return alert('Code semestre requis (ex: S1, S2)')
    try {
      await createSemestre({ code, description: semestreForm.description.trim() || undefined })
      setShowSemestreModal(false)
      setSemestreForm({ code: '', description: '' })
      await reloadRefs()
      alert('Semestre ajouté ✅')
    } catch (e: any) {
      console.error(e)
      alert(e?.response?.data?.message || e?.message || "Erreur création semestre")
    }
  }

  const submitModule = async () => {
    const code = moduleForm.code.trim()
    const libelle = moduleForm.libelle.trim()
    if (!code) return alert('Code module requis (ex: M1)')
    if (!libelle) return alert('Libellé module requis')
    try {
      await createModule({ code, libelle })
      setShowModuleModal(false)
      setModuleForm({ code: '', libelle: '' })
      await reloadRefs()
      alert('Module ajouté ✅')
    } catch (e: any) {
      console.error(e)
      alert(e?.response?.data?.message || e?.message || "Erreur création module")
    }
  }

  const submitMatiere = async () => {
    const libelle = matiereForm.libelle.trim()
    if (!libelle) return alert('Libellé matière requis')
    try {
      await createMatiere({ libelle, moduleId: matiereForm.moduleId ? Number(matiereForm.moduleId) : null })
      setShowMatiereModal(false)
      setMatiereForm({ libelle: '', moduleId: 0 })
      alert('Matière ajoutée ✅')
    } catch (e: any) {
      console.error(e)
      alert(e?.response?.data?.message || e?.message || "Erreur création matière")
    }
  }

  const filteredCours = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return cours
    return cours.filter((c: CoursApi) => {
      const titre = (c.titre ?? '').toLowerCase()
      const desc = (c.description ?? '').toLowerCase()

      const sid = c.semestreId ?? c.semestre?.id
      const eid = c.enseignantId ?? c.enseignant?.id

      const semestreLabel = sid ? (semestreLabelById.get(sid) ?? '') : ''
      const enseignantLabel = eid ? (enseignantLabelById.get(eid) ?? '') : ''

      return (
        titre.includes(q) ||
        desc.includes(q) ||
        semestreLabel.toLowerCase().includes(q) ||
        enseignantLabel.toLowerCase().includes(q)
      )
    })
  }, [cours, search, semestreLabelById, enseignantLabelById])

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Cours</h1>
            <p className="text-gray-600 mt-1">{filteredCours.length} cours trouvé(s)</p>
          </div>

          {/* ✅ nouveaux boutons */}
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => setShowSemestreModal(true)}
              className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition flex items-center font-medium"
            >
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Ajouter semestre
            </button>

            <button
              onClick={() => setShowModuleModal(true)}
              className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition flex items-center font-medium"
            >
              <Layers className="w-5 h-5 mr-2 text-indigo-600" />
              Ajouter module
            </button>

            <button
              onClick={() => setShowMatiereModal(true)}
              className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition flex items-center font-medium"
            >
              <GraduationCap className="w-5 h-5 mr-2 text-emerald-600" />
              Ajouter matière
            </button>

            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter un cours
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par titre, description, semestre, enseignant..."
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCours.map((c: CoursApi) => {
            const sid = c.semestreId ?? c.semestre?.id
            const eid = c.enseignantId ?? c.enseignant?.id

            const semestreLabel = sid ? (semestreLabelById.get(sid) ?? `Semestre #${sid}`) : '—'
            const enseignantLabel = eid ? (enseignantLabelById.get(eid) ?? `Enseignant #${eid}`) : '—'

            return (
              <div key={c.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{c.titre}</h3>
                      <p className="text-sm text-gray-600">ID: {c.id}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {c.description ? (
                    <p className="text-gray-700 mb-4 whitespace-pre-line">{c.description}</p>
                  ) : (
                    <p className="text-gray-500 mb-4 italic">Aucune description</p>
                  )}

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="font-medium mr-2">Semestre :</span>
                      <span>{semestreLabel}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <UserIcon className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="font-medium mr-2">Enseignant :</span>
                      <span>{enseignantLabel}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                      <span className="font-medium mr-2">Type :</span>
                      <span>Cours</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ==================== Modal Cours ==================== */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedCours ? 'Modifier le cours' : 'Ajouter un cours'}
          size="lg"
        >
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            <CoursForm initialData={selectedCours} onSubmit={handleSubmit} onCancel={() => setShowModal(false)} />
          </div>
        </Modal>

        {/* ==================== Modal Semestre ==================== */}
        <Modal
          isOpen={showSemestreModal}
          onClose={() => setShowSemestreModal(false)}
          title="Ajouter un semestre"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
              <input
                value={semestreForm.code}
                onChange={(e) => setSemestreForm((p) => ({ ...p, code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="S1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={semestreForm.description}
                onChange={(e) => setSemestreForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Semestre 1 - Année 2025/2026"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSemestreModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={submitSemestre}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </Modal>

        {/* ==================== Modal Module ==================== */}
        <Modal
          isOpen={showModuleModal}
          onClose={() => setShowModuleModal(false)}
          title="Ajouter un module"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
              <input
                value={moduleForm.code}
                onChange={(e) => setModuleForm((p) => ({ ...p, code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="M1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
              <input
                value={moduleForm.libelle}
                onChange={(e) => setModuleForm((p) => ({ ...p, libelle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Réseaux & Systèmes"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModuleModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={submitModule}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </Modal>

        {/* ==================== Modal Matière ==================== */}
        <Modal
          isOpen={showMatiereModal}
          onClose={() => setShowMatiereModal(false)}
          title="Ajouter une matière"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
              <input
                value={matiereForm.libelle}
                onChange={(e) => setMatiereForm((p) => ({ ...p, libelle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="TCP/IP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
              <select
                value={matiereForm.moduleId}
                onChange={(e) => setMatiereForm((p) => ({ ...p, moduleId: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={0}>— Aucun (optionnel)</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.code} — {m.libelle}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowMatiereModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={submitMatiere}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
