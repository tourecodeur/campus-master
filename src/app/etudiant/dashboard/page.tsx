'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { BookOpen, Award, Bell } from 'lucide-react'
import { getEtudiantMesCours, getEtudiantMesNotes, type EtudiantCours, type EtudiantNote } from '@/lib/api'

export default function EtudiantDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cours, setCours] = useState<EtudiantCours[]>([])
  const [notes, setNotes] = useState<EtudiantNote[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const [c, n] = await Promise.all([getEtudiantMesCours(), getEtudiantMesNotes()])
        setCours(c)
        setNotes(n)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const moyenne = useMemo(() => {
    const vals = notes.map(n => n.note).filter(v => typeof v === 'number')
    if (!vals.length) return null
    return vals.reduce((a, b) => a + b, 0) / vals.length
  }, [notes])

  const lastNotes = useMemo(() => notes.slice().reverse().slice(0, 6), [notes])

  return (
    <DashboardLayout role="etudiant">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord Étudiant</h1>
          <p className="text-gray-600 mt-1">Bienvenue sur votre espace personnel</p>
          {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">{error}</div>}
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6">Chargement…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Cours inscrits</p>
                    <p className="text-2xl font-bold text-gray-800">{cours.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Moyenne (notes reçues)</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {moyenne === null ? '—' : `${moyenne.toFixed(2)}/20`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Notes disponibles</p>
                    <p className="text-2xl font-bold text-gray-800">{notes.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Dernières notes</h2>
              {lastNotes.length === 0 ? (
                <p className="text-gray-600">Aucune note disponible.</p>
              ) : (
                <div className="space-y-3">
                  {lastNotes.map((n) => (
                    <div key={n.depotId} className="p-3 bg-gray-50 rounded-lg flex justify-between">
                      <div className="text-gray-800 font-medium">{n.devoirTitre || 'Devoir'}</div>
                      <div className="font-bold">{n.note}/20</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
