'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Download, Search, FileText } from 'lucide-react'
import { getEtudiantMesSupports, type EtudiantSupport } from '@/lib/api'

export default function EtudiantDocumentsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [docs, setDocs] = useState<EtudiantSupport[]>([])
  const [q, setQ] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const d = await getEtudiantMesSupports()
        setDocs(d)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return docs
    return docs.filter(x =>
      (x.nomFichier || '').toLowerCase().includes(s) ||
      (x.type || '').toLowerCase().includes(s) ||
      String(x.coursId || '').includes(s)
    )
  }, [docs, q])

  return (
    <DashboardLayout role="etudiant">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
        <p className="text-gray-600 mt-1">Supports de cours disponibles</p>

        {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">{error}</div>}

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">Chargement…</div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un document…"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="text-gray-600">Aucun document.</div>
            ) : (
              <div className="space-y-3">
                {filtered.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-800">{d.nomFichier}</div>
                        <div className="text-xs text-gray-500">
                          Type: {d.type}
                        </div>
                      </div>
                    </div>
                    <a
                      href={d.urlFichier}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Ouvrir
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
