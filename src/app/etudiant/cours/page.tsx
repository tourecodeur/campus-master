'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { BookOpen } from 'lucide-react'
import { getEtudiantMesCours, type EtudiantCours } from '@/lib/api'

export default function EtudiantCoursPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cours, setCours] = useState<EtudiantCours[]>([])
  const [selectedCoursId, setSelectedCoursId] = useState<number | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const c = await getEtudiantMesCours()
        setCours(c)
        setSelectedCoursId(null) // ✅ pas de sélection statique
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const selected = useMemo(() => cours.find(c => c.id === selectedCoursId) || null, [cours, selectedCoursId])

  return (
    <DashboardLayout role="etudiant">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Mes cours</h1>
        <p className="text-gray-600 mt-1">Liste et détails des cours</p>
        {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">{error}</div>}

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">Chargement…</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Cours</h2>
              <div className="space-y-3">
                {cours.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCoursId(c.id)}
                    className={`p-4 rounded-lg cursor-pointer transition ${
                      selectedCoursId === c.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">{c.titre || '—'}</div>
                    <div className="text-sm text-gray-600">{c.enseignant || ''}</div>
                    <div className="text-xs text-gray-500">{c.module || ''} {c.matiere ? `• ${c.matiere}` : ''}</div>
                  </div>
                ))}
                {cours.length === 0 && <div className="text-sm text-gray-600">Aucun cours.</div>}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              {!selected ? (
                <div className="text-gray-500 py-12 text-center">Sélectionnez un cours pour voir les détails.</div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{selected.titre || '—'}</div>
                      <div className="text-gray-600">{selected.enseignant || ''}</div>
                    </div>
                  </div>

                  {selected.description && (
                    <>
                      <h3 className="text-lg font-semibold mt-4">Description</h3>
                      <p className="text-gray-700 mt-1">{selected.description}</p>
                    </>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-500">Module</div>
                      <div className="font-semibold">{selected.module || '—'}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-500">Matière</div>
                      <div className="font-semibold">{selected.matiere || '—'}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-500">Semestre</div>
                      <div className="font-semibold">{selected.semestre || '—'}</div>
                    </div>
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
