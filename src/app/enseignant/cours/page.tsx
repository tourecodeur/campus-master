'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import api, { enseignantCreateMyCours, enseignantGetMyCours } from '@/lib/api'
import {
  Plus,
  BookOpen,
  Edit,
  Trash2,
  CalendarDays,
  Layers,
  Tag,
  Link as LinkIcon,
  FileText,
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

/** ========= Types (minimaux, tolérants) ========= */
type BackendSemestre = { id: number; code?: string; libelle?: string }
type BackendModule = { id: number; libelle?: string }
type BackendMatiere = {
  id: number
  libelle?: string
  module?: { id?: number; libelle?: string } | null
  moduleId?: number | null
}
type BackendCours = {
  id: number
  titre: string
  description?: string
  semestre?: { id: number; code?: string; libelle?: string } | null
  matiere?: { id: number; libelle?: string; module?: { id?: number; libelle?: string } | null } | null
}

/** ✅ SupportCours (aligné backend: controller renvoie cours possiblement null) */
type BackendSupportCours = {
  id: number
  nomFichier?: string
  urlFichier?: string
  type?: string
  version?: number
  cours?: { id: number } | null
  coursId?: number | null
}

const is403 = (e: any) => e?.response?.status === 403
const safeArray = <T,>(x: any): T[] => (Array.isArray(x) ? x : [])

export default function EnseignantCoursPage() {
  /** ✅ évite l’erreur getSnapshot infinite loop */
  const user = useAuthStore((s: any) => s.user)

  const [loading, setLoading] = useState(true)
  const [cours, setCours] = useState<BackendCours[]>([])
  const [selectedCoursId, setSelectedCoursId] = useState<number | null>(null)

  /** ===== droits référentiels ===== */
  const [canManageRefs, setCanManageRefs] = useState(false)
  const [refsChecked, setRefsChecked] = useState(false)

  /** ===== droits supports ===== */
  const [canManageSupports, setCanManageSupports] = useState(false)
  const [supportsChecked, setSupportsChecked] = useState(false)

  /** ===== référentiels ===== */
  const [semestres, setSemestres] = useState<BackendSemestre[]>([])
  const [modules, setModules] = useState<BackendModule[]>([])
  const [matieres, setMatieres] = useState<BackendMatiere[]>([])

  /** ===== supports (BDD) ===== */
  const [supportsByCoursId, setSupportsByCoursId] = useState<Record<number, BackendSupportCours[]>>({})
  const [supportsLoading, setSupportsLoading] = useState(false)

  /** ===== créer cours ===== */
  const [showNewCours, setShowNewCours] = useState(false)
  const [newTitre, setNewTitre] = useState('')
  const [newDesc, setNewDesc] = useState('')

  /** ===== edit cours ===== */
  const [showEditCours, setShowEditCours] = useState(false)
  const [editTitre, setEditTitre] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editSemestreId, setEditSemestreId] = useState<number | ''>('')
  const [selectedModuleId, setSelectedModuleId] = useState<number | ''>('')
  const [selectedMatiereId, setSelectedMatiereId] = useState<number | ''>('')

  /** ===== ajouter support ===== */
  const [showAddSupport, setShowAddSupport] = useState(false)
  const [supportName, setSupportName] = useState('')
  const [supportUrl, setSupportUrl] = useState('')
  const [supportType, setSupportType] = useState('PDF')

  /** ===================== Référentiels CRUD UI ===================== */
  type RefTab = 'semestres' | 'modules' | 'matieres'
  const [refTab, setRefTab] = useState<RefTab>('semestres')

  // Semestre modal
  const [showSemModal, setShowSemModal] = useState(false)
  const [editingSem, setEditingSem] = useState<BackendSemestre | null>(null)
  const [semCode, setSemCode] = useState('')
  const [semLibelle, setSemLibelle] = useState('')

  // Module modal
  const [showModModal, setShowModModal] = useState(false)
  const [editingMod, setEditingMod] = useState<BackendModule | null>(null)
  const [modLibelle, setModLibelle] = useState('')

  // Matiere modal
  const [showMatModal, setShowMatModal] = useState(false)
  const [editingMat, setEditingMat] = useState<BackendMatiere | null>(null)
  const [matLibelle, setMatLibelle] = useState('')
  const [matModuleId, setMatModuleId] = useState<number | ''>('')

  const selectedCours = useMemo(
    () => cours.find((c) => c.id === selectedCoursId) ?? null,
    [cours, selectedCoursId]
  )

  /** ✅ supports du cours sélectionné */
  const supports = useMemo(() => {
    if (!selectedCoursId) return []
    return supportsByCoursId[selectedCoursId] ?? []
  }, [supportsByCoursId, selectedCoursId])

  /** Filtrer matières par module (UI) */
  const filteredMatieres = useMemo(() => {
    if (!selectedModuleId) return matieres
    return matieres.filter((m) => (m.module?.id ?? m.moduleId ?? null) === selectedModuleId)
  }, [matieres, selectedModuleId])

  /** ===================== LOADERS ===================== */
  const loadMyCours = async () => {
    setLoading(true)
    try {
      const data = await enseignantGetMyCours()
      const arr = safeArray<BackendCours>(data)
      setCours(arr)
      setSelectedCoursId(arr[0]?.id ?? null)
    } catch (e: any) {
      console.error('Erreur chargement cours enseignant:', e?.response?.data ?? e)
    } finally {
      setLoading(false)
    }
  }

  const checkRefsAccess = async () => {
    try {
      await api.get('/api/v1/semestres')
      setCanManageRefs(true)
    } catch (e: any) {
      if (is403(e)) setCanManageRefs(false)
      else {
        console.error('Erreur check refs access:', e?.response?.data ?? e)
        setCanManageRefs(false)
      }
    } finally {
      setRefsChecked(true)
    }
  }

  const checkSupportsAccess = async () => {
    try {
      await api.get('/api/v1/supports-cours')
      setCanManageSupports(true)
    } catch (e: any) {
      if (is403(e)) setCanManageSupports(false)
      else {
        console.error('Erreur check supports access:', e?.response?.data ?? e)
        setCanManageSupports(false)
      }
    } finally {
      setSupportsChecked(true)
    }
  }

  const loadRefs = async () => {
    if (!canManageRefs) return
    try {
      const [semsRes, modsRes, matsRes] = await Promise.allSettled([
        api.get('/api/v1/semestres'),
        api.get('/api/v1/modules'),
        api.get('/api/v1/matieres'),
      ])

      if (semsRes.status === 'fulfilled') setSemestres(safeArray<BackendSemestre>(semsRes.value.data))
      if (modsRes.status === 'fulfilled') setModules(safeArray<BackendModule>(modsRes.value.data))
      if (matsRes.status === 'fulfilled') setMatieres(safeArray<BackendMatiere>(matsRes.value.data))
    } catch (e: any) {
      console.error('Erreur chargement refs:', e?.response?.data ?? e)
    }
  }

  /** ✅ récupère TOUS les supports et groupe par coursId */
  const loadAllSupports = async () => {
    if (!canManageSupports) return
    setSupportsLoading(true)
    try {
      const res = await api.get('/api/v1/supports-cours')
      const all = safeArray<BackendSupportCours>(res.data)

      const grouped: Record<number, BackendSupportCours[]> = {}
      for (const s of all) {
        const cid = (s?.cours?.id ?? s?.coursId ?? null) as number | null
        if (!cid) continue
        if (!grouped[cid]) grouped[cid] = []
        grouped[cid].push(s)
      }
      setSupportsByCoursId(grouped)
    } catch (e: any) {
      console.error('Erreur chargement supports:', e?.response?.data ?? e)
      setSupportsByCoursId({})
    } finally {
      setSupportsLoading(false)
    }
  }

  /** ===================== COURS CRUD ===================== */
  const handleCreateCours = async () => {
    if (!newTitre.trim()) return alert('Titre requis')
    try {
      await enseignantCreateMyCours({
        titre: newTitre.trim(),
        description: newDesc.trim(),
      })
      setShowNewCours(false)
      setNewTitre('')
      setNewDesc('')
      await loadMyCours()
    } catch (e: any) {
      console.error('Erreur create cours:', e?.response?.data ?? e)
      alert(e?.response?.data?.message ?? 'Erreur lors de la création du cours')
    }
  }

  const openEdit = () => {
    if (!selectedCours) return
    setEditTitre(selectedCours.titre ?? '')
    setEditDesc(selectedCours.description ?? '')
    setEditSemestreId(selectedCours.semestre?.id ?? '')
    setSelectedMatiereId(selectedCours.matiere?.id ?? '')
    setSelectedModuleId(selectedCours.matiere?.module?.id ?? '')
    setShowEditCours(true)
  }

  const handleUpdateCours = async () => {
    if (!selectedCours) return
    if (!canManageRefs) {
      alert("Le backend n'autorise pas la modification des référentiels pour ROLE_ENSEIGNANT.")
      return
    }
    if (!editTitre.trim()) return alert('Titre requis')
    if (!editSemestreId) return alert('Semestre requis')

    try {
      const payload: any = {
        titre: editTitre.trim(),
        description: editDesc.trim(),
        semestreId: Number(editSemestreId),
        ...(selectedMatiereId ? { matiereId: Number(selectedMatiereId) } : {}),
      }
      if (user?.id) payload.enseignantId = Number(user.id)

      await api.put(`/api/v1/cours/${selectedCours.id}`, payload)

      setShowEditCours(false)
      await loadMyCours()
    } catch (e: any) {
      console.error('Erreur update cours:', e?.response?.data ?? e)
      alert(e?.response?.data?.message ?? 'Erreur lors de la mise à jour')
    }
  }

  /** ===================== SUPPORTS CRUD ===================== */
  const createSupport = async (coursId: number) => {
    if (!canManageSupports) return
    if (!supportName.trim() || !supportUrl.trim()) return alert('Nom + URL requis')

    try {
      await api.post('/api/v1/supports-cours', {
        coursId,
        nomFichier: supportName.trim(),
        urlFichier: supportUrl.trim(),
        type: supportType,
        version: 1,
      })

      setShowAddSupport(false)
      setSupportName('')
      setSupportUrl('')
      await loadAllSupports() // ✅ rafraîchir supports
    } catch (e: any) {
      console.error('Erreur create support:', e?.response?.data ?? e)
      alert(e?.response?.data?.message ?? "Erreur lors de l'ajout du support")
    }
  }

  const deleteSupport = async (id: number) => {
    if (!confirm('Supprimer ce support ?')) return
    try {
      await api.delete(`/api/v1/supports-cours/${id}`)
      await loadAllSupports() // ✅ rafraîchir supports
    } catch (e: any) {
      console.error('Erreur delete support:', e?.response?.data ?? e)
      alert(e?.response?.data?.message ?? 'Erreur lors de la suppression')
    }
  }

  /** ===================== REFERENTIELS CRUD ===================== */
  const openNewSem = () => {
    setEditingSem(null)
    setSemCode('')
    setSemLibelle('')
    setShowSemModal(true)
  }
  const openEditSem = (s: BackendSemestre) => {
    setEditingSem(s)
    setSemCode(s.code ?? '')
    setSemLibelle(s.libelle ?? '')
    setShowSemModal(true)
  }
  const saveSemestre = async () => {
    if (!canManageRefs) return
    if (!semCode.trim() && !semLibelle.trim()) return alert('Code ou libellé requis')

    try {
      const payload: any = { code: semCode.trim() || undefined, libelle: semLibelle.trim() || undefined }
      if (editingSem?.id) await api.put(`/api/v1/semestres/${editingSem.id}`, payload)
      else await api.post('/api/v1/semestres', payload)

      setShowSemModal(false)
      await loadRefs()
    } catch (e: any) {
      console.error('Erreur save semestre:', e?.response?.data ?? e)
      alert(e?.response?.data?.message ?? "Erreur lors de l'enregistrement")
    }
  }
  const deleteSemestre = async (id: number) => {
    if (!confirm('Supprimer ce semestre ?')) return
    try {
      await api.delete(`/api/v1/semestres/${id}`)
      await loadRefs()
    } catch (e: any) {
      console.error('Erreur delete semestre:', e?.response?.data ?? e)
      alert(e?.response?.data?.message ?? 'Erreur lors de la suppression')
    }
  }

  const openNewMod = () => {
    setEditingMod(null)
    setModLibelle('')
    setShowModModal(true)
  }
  const openEditMod = (m: BackendModule) => {
    setEditingMod(m)
    setModLibelle(m.libelle ?? '')
    setShowModModal(true)
  }
  const saveModule = async () => {
    if (!canManageRefs) return
    if (!modLibelle.trim()) return alert('Libellé requis')
    try {
      const payload: any = { libelle: modLibelle.trim() }
      if (editingMod?.id) await api.put(`/api/v1/modules/${editingMod.id}`, payload)
      else await api.post('/api/v1/modules', payload)

      setShowModModal(false)
      await loadRefs()
    } catch (e: any) {
      console.error('Erreur save module:', e?.response?.data ?? e)
      alert(e?.response?.data?.message ?? "Erreur lors de l'enregistrement")
    }
  }
  const deleteModule = async (id: number) => {
    if (!confirm('Supprimer ce module ?')) return
    try {
      await api.delete(`/api/v1/modules/${id}`)
      await loadRefs()
    } catch (e: any) {
      console.error('Erreur delete module:', e?.response?.data ?? e)
      alert(e?.response?.data?.message ?? 'Erreur lors de la suppression')
    }
  }

  const openNewMat = () => {
    setEditingMat(null)
    setMatLibelle('')
    setMatModuleId('')
    setShowMatModal(true)
  }
  const openEditMat = (m: BackendMatiere) => {
    setEditingMat(m)
    setMatLibelle(m.libelle ?? '')
    setMatModuleId((m.module?.id ?? m.moduleId ?? '') as any)
    setShowMatModal(true)
  }
  const saveMatiere = async () => {
    if (!canManageRefs) return
    if (!matLibelle.trim()) return alert('Libellé requis')
    if (!matModuleId) return alert('Module requis')

    try {
      const payload: any = { libelle: matLibelle.trim(), moduleId: Number(matModuleId) }
      if (editingMat?.id) await api.put(`/api/v1/matieres/${editingMat.id}`, payload)
      else await api.post('/api/v1/matieres', payload)

      setShowMatModal(false)
      await loadRefs()
    } catch (e: any) {
      console.error('Erreur save matiere:', e?.response?.data ?? e)
      alert(e?.response?.data?.message ?? "Erreur lors de l'enregistrement")
    }
  }
  const deleteMatiere = async (id: number) => {
    if (!confirm('Supprimer cette matière ?')) return
    try {
      await api.delete(`/api/v1/matieres/${id}`)
      await loadRefs()
    } catch (e: any) {
      console.error('Erreur delete matiere:', e?.response?.data ?? e)
      alert(e?.response?.data?.message ?? 'Erreur lors de la suppression')
    }
  }

  /** ===================== EFFECTS ===================== */
  useEffect(() => {
    loadMyCours()
    checkRefsAccess()
    checkSupportsAccess()
  }, [])

  useEffect(() => {
    if (refsChecked && canManageRefs) loadRefs()
  }, [refsChecked, canManageRefs])

  useEffect(() => {
    if (supportsChecked && canManageSupports) loadAllSupports()
    else setSupportsByCoursId({})
  }, [supportsChecked, canManageSupports])

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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mes Cours</h1>
          </div>

          <button
            onClick={() => setShowNewCours(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau cours
          </button>
        </div>

        {/* Référentiels */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Référentiels</h2>
              <p className="text-sm text-gray-600">Gérez semestres, modules et matières (si autorisé).</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${refTab === 'semestres' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}`}
                onClick={() => setRefTab('semestres')}
              >
                <CalendarDays className="w-4 h-4" /> Semestres
              </button>
              <button
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${refTab === 'modules' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}`}
                onClick={() => setRefTab('modules')}
              >
                <Layers className="w-4 h-4" /> Modules
              </button>
              <button
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${refTab === 'matieres' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}`}
                onClick={() => setRefTab('matieres')}
              >
                <Tag className="w-4 h-4" /> Matières
              </button>

              <Button
                onClick={() => {
                  if (!canManageRefs) return
                  if (refTab === 'semestres') openNewSem()
                  if (refTab === 'modules') openNewMod()
                  if (refTab === 'matieres') openNewMat()
                }}
                disabled={!canManageRefs}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>

          {!canManageRefs ? (
            <div className="mt-4 text-sm text-gray-500 italic">Non disponible : le backend répond 403 pour ROLE_ENSEIGNANT.</div>
          ) : (
            <div className="mt-4">
              {refTab === 'semestres' && (
                <div className="space-y-2">
                  {semestres.length === 0 ? (
                    <p className="text-sm text-gray-600">Aucun semestre.</p>
                  ) : (
                    semestres.map((s) => (
                      <div key={s.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-800 truncate">{s.libelle ?? s.code ?? `Semestre #${s.id}`}</div>
                          <div className="text-xs text-gray-600">Code: {s.code ?? '—'}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => openEditSem(s)}>
                            <Edit className="w-4 h-4 mr-2" /> Modifier
                          </Button>
                          <button
                            onClick={() => deleteSemestre(s.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {refTab === 'modules' && (
                <div className="space-y-2">
                  {modules.length === 0 ? (
                    <p className="text-sm text-gray-600">Aucun module.</p>
                  ) : (
                    modules.map((m) => (
                      <div key={m.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-800 truncate">{m.libelle ?? `Module #${m.id}`}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => openEditMod(m)}>
                            <Edit className="w-4 h-4 mr-2" /> Modifier
                          </Button>
                          <button
                            onClick={() => deleteModule(m.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {refTab === 'matieres' && (
                <div className="space-y-2">
                  {matieres.length === 0 ? (
                    <p className="text-sm text-gray-600">Aucune matière.</p>
                  ) : (
                    matieres.map((m) => (
                      <div key={m.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-800 truncate">{m.libelle ?? `Matière #${m.id}`}</div>
                          <div className="text-xs text-gray-600">
                            Module: {m.module?.libelle ?? (m.module?.id ?? m.moduleId ? `#${m.module?.id ?? m.moduleId}` : '—')}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => openEditMat(m)}>
                            <Edit className="w-4 h-4 mr-2" /> Modifier
                          </Button>
                          <button
                            onClick={() => deleteMatiere(m.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cours + détails */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Liste des cours</h2>

            {cours.length === 0 ? (
              <p className="text-sm text-gray-600">Aucun cours.</p>
            ) : (
              <div className="space-y-3">
                {cours.map((c) => {
                  const count = (supportsByCoursId[c.id] ?? []).length
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCoursId(c.id)}
                      className={`w-full text-left p-4 rounded-lg transition ${
                        selectedCoursId === c.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-semibold text-gray-800">{c.titre}</div>
                      <div className="text-xs text-gray-600">Supports: {count}</div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            {!selectedCours ? (
              <p className="text-sm text-gray-600">Sélectionnez un cours.</p>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedCours.titre}</h2>
                  </div>
                  <BookOpen className="w-7 h-7 text-blue-600" />
                </div>

                {selectedCours.description ? (
                  <p className="text-gray-700">{selectedCours.description}</p>
                ) : (
                  <p className="text-gray-500 italic">Pas de description.</p>
                )}

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500">Semestre : {selectedCours.semestre?.libelle ?? selectedCours.semestre?.code ?? '—'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500">Matière : {selectedCours.matiere?.libelle ?? '—'}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Module:{' '}
                      {selectedCours.matiere?.module?.libelle ??
                        (selectedCours.matiere?.module?.id ? `#${selectedCours.matiere?.module?.id}` : '—')}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="outline" onClick={openEdit} disabled={!canManageRefs}>
                    <Edit className="w-4 h-4 mr-2" /> Modifier le cours
                  </Button>

                  <Button onClick={() => setShowAddSupport(true)} disabled={!canManageSupports || !selectedCoursId}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un support
                  </Button>
                </div>

                {/* ✅ Supports (sans changer la mise en forme) */}
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Supports
                    </h3>
                    {supportsLoading && <span className="text-xs text-gray-500">Chargement…</span>}
                  </div>

                  {!canManageSupports ? (
                    <p className="text-sm text-gray-500 italic">
                      Supports désactivés : accès refusé (403) sur <code>/api/v1/supports-cours</code>.
                    </p>
                  ) : supports.length === 0 ? (
                    <p className="text-sm text-gray-600">Aucun support pour ce cours.</p>
                  ) : (
                    <div className="space-y-2">
                      {supports.map((s) => (
                        <div key={s.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="min-w-0">
                            <div className="font-medium text-gray-800 truncate">{s.nomFichier ?? `Support #${s.id}`}</div>
                            <div className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center gap-1">
                                <Tag className="w-3 h-3" /> {s.type ?? '—'}
                              </span>
                            </div>
                            {s.urlFichier && (
                              <a
                                href={s.urlFichier}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
                              >
                                <LinkIcon className="w-3 h-3" /> Ouvrir
                              </a>
                            )}
                          </div>

                          <button
                            onClick={() => deleteSupport(s.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            aria-label="Supprimer le support"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ===================== MODALS ===================== */}

        <Modal isOpen={showNewCours} onClose={() => setShowNewCours(false)} title="Créer un cours" size="lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                value={newTitre}
                onChange={(e) => setNewTitre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Ex: Algorithmique"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewCours(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateCours}>Créer</Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={showEditCours} onClose={() => setShowEditCours(false)} title="Modifier le cours" size="lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                value={editTitre}
                onChange={(e) => setEditTitre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semestre *</label>
                <select
                  value={editSemestreId}
                  onChange={(e) => setEditSemestreId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={!canManageRefs}
                >
                  <option value="">—</option>
                  {semestres.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.libelle ?? s.code ?? `Semestre #${s.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Module (filtre)</label>
                <select
                  value={selectedModuleId}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : ''
                    setSelectedModuleId(val as any)
                    setSelectedMatiereId('')
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={!canManageRefs}
                >
                  <option value="">Tous</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.libelle ?? `Module #${m.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                <select
                  value={selectedMatiereId}
                  onChange={(e) => setSelectedMatiereId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={!canManageRefs}
                >
                  <option value="">—</option>
                  {filteredMatieres.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.libelle ?? `Matière #${m.id}`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Si votre backend relie automatiquement matière→module, ce filtre aide juste l’UI.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditCours(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateCours} disabled={!canManageRefs}>
                Enregistrer
              </Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={showAddSupport} onClose={() => setShowAddSupport(false)} title="Ajouter un support" size="lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                value={supportName}
                onChange={(e) => setSupportName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Ex: Chapitre 1 - PDF"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
              <input
                value={supportUrl}
                onChange={(e) => setSupportUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={supportType}
                onChange={(e) => setSupportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="PDF">PDF</option>
                <option value="LIEN">Lien</option>
                <option value="DOC">DOC</option>
                <option value="VIDEO">Vidéo</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddSupport(false)}>
                Annuler
              </Button>
              <Button
                onClick={() => {
                  if (!selectedCoursId) return
                  createSupport(selectedCoursId)
                }}
                disabled={!canManageSupports || !selectedCoursId}
              >
                Ajouter
              </Button>
            </div>
          </div>
        </Modal>

        {/* Semestre modal */}
        <Modal
          isOpen={showSemModal}
          onClose={() => setShowSemModal(false)}
          title={editingSem ? 'Modifier semestre' : 'Nouveau semestre'}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input
                value={semCode}
                onChange={(e) => setSemCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Ex: S1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
              <input
                value={semLibelle}
                onChange={(e) => setSemLibelle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Ex: Semestre 1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSemModal(false)}>
                Annuler
              </Button>
              <Button onClick={saveSemestre} disabled={!canManageRefs}>
                Enregistrer
              </Button>
            </div>
          </div>
        </Modal>

        {/* Module modal */}
        <Modal
          isOpen={showModModal}
          onClose={() => setShowModModal(false)}
          title={editingMod ? 'Modifier module' : 'Nouveau module'}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
              <input
                value={modLibelle}
                onChange={(e) => setModLibelle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Ex: Informatique"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModModal(false)}>
                Annuler
              </Button>
              <Button onClick={saveModule} disabled={!canManageRefs}>
                Enregistrer
              </Button>
            </div>
          </div>
        </Modal>

        {/* Matière modal */}
        <Modal
          isOpen={showMatModal}
          onClose={() => setShowMatModal(false)}
          title={editingMat ? 'Modifier matière' : 'Nouvelle matière'}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
              <input
                value={matLibelle}
                onChange={(e) => setMatLibelle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Ex: Algorithmique"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module *</label>
              <select
                value={matModuleId}
                onChange={(e) => setMatModuleId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">—</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.libelle ?? `Module #${m.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowMatModal(false)}>
                Annuler
              </Button>
              <Button onClick={saveMatiere} disabled={!canManageRefs}>
                Enregistrer
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
