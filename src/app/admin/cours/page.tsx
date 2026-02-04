'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Modal from '@/components/ui/Modal'
import CoursForm, { CoursFormData } from '@/components/forms/CoursForm'
import {
  Plus,
  Search,
  Calendar,
  Edit,
  Trash2,
  User as UserIcon,
  Layers,
  GraduationCap,
} from 'lucide-react'

import apiClient, {
  getCours,
  createCours,
  updateCours,
  deleteCours,
  getSemestres,
  getEnseignants,
  getModules,
  createSemestre,
  createModule,
  createMatiere,
  getMatieres,
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
type Matiere = {
  id: number
  libelle: string
  moduleId?: number | null
  module?: { id: number; code?: string; libelle?: string }
}

export default function CoursPage() {
  const [cours, setCours] = useState<CoursApi[]>([])
  const [semestres, setSemestres] = useState<Semestre[]>([])
  const [enseignants, setEnseignants] = useState<Enseignant[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [matieres, setMatieres] = useState<Matiere[]>([])

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [selectedCours, setSelectedCours] = useState<CoursApi | null>(null)

  // ✅ Modals “référentiels”
  const [showSemestreModal, setShowSemestreModal] = useState(false)
  const [showModuleModal, setShowModuleModal] = useState(false)
  const [showMatiereModal, setShowMatiereModal] = useState(false)

  // ✅ mode édition référentiels
  const [editingSemestre, setEditingSemestre] = useState<Semestre | null>(null)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [editingMatiere, setEditingMatiere] = useState<Matiere | null>(null)

  // ✅ form states
  const [semestreForm, setSemestreForm] = useState({ code: '', description: '' })
  const [moduleForm, setModuleForm] = useState({ code: '', libelle: '' })
  const [matiereForm, setMatiereForm] = useState({ libelle: '', moduleId: 0 })

  // ===================== LOAD =====================

  const loadAll = async () => {
    try {
      setLoading(true)
      const [coursData, semestresData, enseignantsData, modulesData, matieresData] = await Promise.all([
        getCours(),
        getSemestres(),
        getEnseignants(),
        getModules(),
        getMatieres(),
      ])
      setCours(coursData ?? [])
      setSemestres(semestresData ?? [])
      setEnseignants(enseignantsData ?? [])
      setModules(modulesData ?? [])
      setMatieres(matieresData ?? [])
    } catch (e) {
      console.error('Erreur load:', e)
      alert("Impossible de charger les données (cours/semestres/enseignants/modules/matières). Vérifie le backend + token.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const loadCoursOnly = async () => {
    const data = await getCours()
    setCours(data ?? [])
  }

  const reloadRefs = async () => {
    const [s, m, mat] = await Promise.all([getSemestres(), getModules(), getMatieres()])
    setSemestres(s ?? [])
    setModules(m ?? [])
    setMatieres(mat ?? [])
  }

  // ===================== LABEL MAPS =====================

  const semestreLabelById = useMemo(() => {
    const map = new Map<number, string>()
    semestres.forEach((s) => {
      const label = s.code || s.libelle || s.nom || `Semestre ${s.id}`
      map.set(s.id, label)
    })
    return map
  }, [semestres])

  const enseignantLabelById = useMemo(() => {
    const map = new Map<number, string>()
    enseignants.forEach((u) => {
      const label =
        u.nomComplet ||
        `${u.prenom ?? ''} ${u.nom ?? ''}`.trim() ||
        u.email ||
        `Enseignant #${u.id}`
      map.set(u.id, label)
    })
    return map
  }, [enseignants])

  const moduleLabelById = useMemo(() => {
    const map = new Map<number, string>()
    modules.forEach((m) => map.set(m.id, `${m.code} — ${m.libelle}`))
    return map
  }, [modules])

  // ===================== CRUD COURS =====================

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
      console.error('Erreur enregistrement:', e)
      alert("Erreur lors de l'enregistrement. Vérifie que le backend accepte le payload.")
    }
  }

  // ===================== CRUD Référentiels (sans api.ts) =====================

  // --- SEMESTRE ---
  const openCreateSemestre = () => {
    setEditingSemestre(null)
    setSemestreForm({ code: '', description: '' })
    setShowSemestreModal(true)
  }

  const openEditSemestre = (s: Semestre) => {
    setEditingSemestre(s)
    setSemestreForm({ code: s.code ?? '', description: s.description ?? '' })
    setShowSemestreModal(true)
  }

  const submitSemestre = async () => {
    const code = semestreForm.code.trim()
    if (!code) return alert('Code semestre requis (ex: S1, S2)')
    try {
      if (editingSemestre) {
        await apiClient.put(`/api/v1/semestres/${editingSemestre.id}`, {
          code,
          description: semestreForm.description.trim() || undefined,
        })
        alert('Semestre modifié ✅')
      } else {
        await createSemestre({ code, description: semestreForm.description.trim() || undefined })
        alert('Semestre ajouté ✅')
      }
      setShowSemestreModal(false)
      setEditingSemestre(null)
      setSemestreForm({ code: '', description: '' })
      await reloadRefs()
    } catch (e: any) {
      console.error(e)
      alert(e?.response?.data?.message || e?.message || 'Erreur enregistrement semestre')
    }
  }

  const onDeleteSemestre = async (id: number) => {
    if (!confirm('Supprimer ce semestre ?')) return
    try {
      await apiClient.delete(`/api/v1/semestres/${id}`)
      await reloadRefs()
      alert('Semestre supprimé ✅')
    } catch (e: any) {
      console.error(e)
      alert(e?.response?.data?.message || e?.message || 'Erreur suppression semestre')
    }
  }

  // --- MODULE ---
  const openCreateModule = () => {
    setEditingModule(null)
    setModuleForm({ code: '', libelle: '' })
    setShowModuleModal(true)
  }

  const openEditModule = (m: Module) => {
    setEditingModule(m)
    setModuleForm({ code: m.code ?? '', libelle: m.libelle ?? '' })
    setShowModuleModal(true)
  }

  const submitModule = async () => {
    const code = moduleForm.code.trim()
    const libelle = moduleForm.libelle.trim()
    if (!code) return alert('Code module requis (ex: M1)')
    if (!libelle) return alert('Libellé module requis')
    try {
      if (editingModule) {
        await apiClient.put(`/api/v1/modules/${editingModule.id}`, { code, libelle })
        alert('Module modifié ✅')
      } else {
        await createModule({ code, libelle })
        alert('Module ajouté ✅')
      }
      setShowModuleModal(false)
      setEditingModule(null)
      setModuleForm({ code: '', libelle: '' })
      await reloadRefs()
    } catch (e: any) {
      console.error(e)
      alert(e?.response?.data?.message || e?.message || 'Erreur enregistrement module')
    }
  }

  const onDeleteModule = async (id: number) => {
    if (!confirm('Supprimer ce module ?')) return
    try {
      await apiClient.delete(`/api/v1/modules/${id}`)
      await reloadRefs()
      alert('Module supprimé ✅')
    } catch (e: any) {
      console.error(e)
      alert(e?.response?.data?.message || e?.message || 'Erreur suppression module')
    }
  }

  // --- MATIERE ---
  const openCreateMatiere = () => {
    setEditingMatiere(null)
    setMatiereForm({ libelle: '', moduleId: 0 })
    setShowMatiereModal(true)
  }

  const openEditMatiere = (x: Matiere) => {
    setEditingMatiere(x)
    const mid = x.moduleId ?? x.module?.id
    setMatiereForm({ libelle: x.libelle ?? '', moduleId: mid ? Number(mid) : 0 })
    setShowMatiereModal(true)
  }

  const submitMatiere = async () => {
    const libelle = matiereForm.libelle.trim()
    if (!libelle) return alert('Libellé matière requis')
    const moduleId = matiereForm.moduleId ? Number(matiereForm.moduleId) : null
    try {
      if (editingMatiere) {
        await apiClient.put(`/api/v1/matieres/${editingMatiere.id}`, { libelle, moduleId })
        alert('Matière modifiée ✅')
      } else {
        await createMatiere({ libelle, moduleId })
        alert('Matière ajoutée ✅')
      }
      setShowMatiereModal(false)
      setEditingMatiere(null)
      setMatiereForm({ libelle: '', moduleId: 0 })
      await reloadRefs()
    } catch (e: any) {
      console.error(e)
      alert(e?.response?.data?.message || e?.message || 'Erreur enregistrement matière')
    }
  }

  const onDeleteMatiere = async (id: number) => {
    if (!confirm('Supprimer cette matière ?')) return
    try {
      await apiClient.delete(`/api/v1/matieres/${id}`)
      await reloadRefs()
      alert('Matière supprimée ✅')
    } catch (e: any) {
      console.error(e)
      alert(e?.response?.data?.message || e?.message || 'Erreur suppression matière')
    }
  }

  // ===================== FILTERS =====================

  const filteredCours = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return cours
    return cours.filter((c) => {
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

  const filteredSemestres = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return semestres
    return semestres.filter((s) => {
      const label = (s.code || s.libelle || s.nom || '').toLowerCase()
      const desc = (s.description || '').toLowerCase()
      return label.includes(q) || desc.includes(q)
    })
  }, [semestres, search])

  const filteredModules = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return modules
    return modules.filter((m) => (`${m.code} ${m.libelle}`.toLowerCase().includes(q)))
  }, [modules, search])

  const filteredMatieres = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return matieres
    return matieres.filter((x) => {
      const lib = (x.libelle || '').toLowerCase()
      const mid = x.moduleId ?? x.module?.id
      const modLabel = mid ? (moduleLabelById.get(Number(mid)) ?? '').toLowerCase() : ''
      return lib.includes(q) || modLabel.includes(q)
    })
  }, [matieres, search, moduleLabelById])

  // ===================== UI =====================

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
            <p className="text-gray-600 mt-1">
              {filteredCours.length} cours • {filteredSemestres.length} semestres • {filteredModules.length} modules •{' '}
              {filteredMatieres.length} matières
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={openCreateSemestre}
              className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition flex items-center font-medium"
            >
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Ajouter semestre
            </button>

            <button
              onClick={openCreateModule}
              className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition flex items-center font-medium"
            >
              <Layers className="w-5 h-5 mr-2 text-indigo-600" />
              Ajouter module
            </button>

            <button
              onClick={openCreateMatiere}
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
              placeholder="Rechercher (cours / semestres / modules / matières)..."
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* ✅ LISTES RÉFÉRENTIELS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Semestres */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-800">Semestres</h2>
              </div>
              <span className="text-sm text-gray-500">{filteredSemestres.length}</span>
            </div>
            <div className="p-5 space-y-2 max-h-[320px] overflow-auto">
              {filteredSemestres.length ? (
                filteredSemestres.map((s) => (
                  <div key={s.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-gray-800">
                          {s.code || s.libelle || s.nom || `Semestre ${s.id}`}
                        </div>
                        {s.description ? (
                          <div className="text-sm text-gray-600">{s.description}</div>
                        ) : (
                          <div className="text-sm text-gray-400 italic">Aucune description</div>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditSemestre(s)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteSemestre(s.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* <div className="mt-2 text-xs text-gray-500">#{s.id}</div> */}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">Aucun semestre</div>
              )}
            </div>
          </div>

          {/* Modules */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-800">Modules</h2>
              </div>
              <span className="text-sm text-gray-500">{filteredModules.length}</span>
            </div>
            <div className="p-5 space-y-2 max-h-[320px] overflow-auto">
              {filteredModules.length ? (
                filteredModules.map((m) => (
                  <div key={m.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-gray-800">
                        {m.code} — {m.libelle}
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModule(m)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteModule(m.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* <div className="mt-2 text-xs text-gray-500">#{m.id}</div> */}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">Aucun module</div>
              )}
            </div>
          </div>

          {/* Matières */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-gray-800">Matières</h2>
              </div>
              <span className="text-sm text-gray-500">{filteredMatieres.length}</span>
            </div>
            <div className="p-5 space-y-2 max-h-[320px] overflow-auto">
              {filteredMatieres.length ? (
                filteredMatieres.map((x) => {
                  const mid = x.moduleId ?? x.module?.id
                  const moduleLabel = mid ? moduleLabelById.get(Number(mid)) : undefined
                  return (
                    <div key={x.id} className="rounded-lg border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-gray-800">{x.libelle}</div>
                          {moduleLabel ? (
                            <div className="text-sm text-gray-600">Module: {moduleLabel}</div>
                          ) : (
                            <div className="text-sm text-gray-400 italic">Module: —</div>
                          )}
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditMatiere(x)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteMatiere(x.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* <div className="mt-2 text-xs text-gray-500">#{x.id}</div> */}
                    </div>
                  )
                })
              ) : (
                <div className="text-gray-500 italic">Aucune matière</div>
              )}
            </div>
          </div>
        </div>

        {/* ==================== LISTE DES COURS ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCours.map((c) => {
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
          onClose={() => {
            setShowSemestreModal(false)
            setEditingSemestre(null)
          }}
          title={editingSemestre ? 'Modifier le semestre' : 'Ajouter un semestre'}
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
                onClick={() => {
                  setShowSemestreModal(false)
                  setEditingSemestre(null)
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={submitSemestre}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {editingSemestre ? 'Modifier' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </Modal>

        {/* ==================== Modal Module ==================== */}
        <Modal
          isOpen={showModuleModal}
          onClose={() => {
            setShowModuleModal(false)
            setEditingModule(null)
          }}
          title={editingModule ? 'Modifier le module' : 'Ajouter un module'}
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
                onClick={() => {
                  setShowModuleModal(false)
                  setEditingModule(null)
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={submitModule}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {editingModule ? 'Modifier' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </Modal>

        {/* ==================== Modal Matière ==================== */}
        <Modal
          isOpen={showMatiereModal}
          onClose={() => {
            setShowMatiereModal(false)
            setEditingMatiere(null)
          }}
          title={editingMatiere ? 'Modifier la matière' : 'Ajouter une matière'}
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
                onClick={() => {
                  setShowMatiereModal(false)
                  setEditingMatiere(null)
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={submitMatiere}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {editingMatiere ? 'Modifier' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
