'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Award } from 'lucide-react'
import { getEtudiantMesNotes, type EtudiantNote } from '@/lib/api'

export default function EtudiantNotesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState<EtudiantNote[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const n = await getEtudiantMesNotes()
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

  return (
    <DashboardLayout role="etudiant">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Mes notes</h1>
        <p className="text-gray-600 mt-1">Notes reçues sur vos dépôts</p>

        {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">{error}</div>}

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">Chargement…</div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mt-6 mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Moyenne (notes reçues)</p>
                  <p className="text-2xl font-bold text-gray-800">{moyenne === null ? '—' : `${moyenne.toFixed(2)}/20`}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Détail</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Devoir</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Note</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Commentaire</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map(n => (
                      <tr key={n.depotId} className="border-b hover:bg-gray-50 transition">
                        <td className="py-4 px-6 font-medium">{n.devoirTitre || '—'}</td>
                        <td className="py-4 px-6 font-bold">{n.note}/20</td>
                        <td className="py-4 px-6 text-gray-700">{n.commentaire || ''}</td>
                      </tr>
                    ))}
                    {notes.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-600">Aucune note.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
