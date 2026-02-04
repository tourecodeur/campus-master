'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Upload, Search } from 'lucide-react'
import { deposerDevoirEtudiant, getEtudiantMesDevoirs, type EtudiantDevoir } from '@/lib/api'

function formatDate(ts?: string) {
  if (!ts) return '—'
  const d = new Date(ts)
  return Number.isNaN(d.getTime()) ? ts : d.toLocaleString()
}

export default function EtudiantDevoirsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [devoirs, setDevoirs] = useState<EtudiantDevoir[]>([])
  const [q, setQ] = useState('')
  const [urlFichier, setUrlFichier] = useState<Record<number, string>>({})
  const [submittingId, setSubmittingId] = useState<number | null>(null)

  const load = async () => {
    const d = await getEtudiantMesDevoirs()
    setDevoirs(d)
  }

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        await load()
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return devoirs
    return devoirs.filter(d =>
      (d.titre || '').toLowerCase().includes(s) ||
      (d.cours?.titre || '').toLowerCase().includes(s)
    )
  }, [devoirs, q])

  const handleDepot = async (devoirId: number) => {
    const url = (urlFichier[devoirId] || '').trim()
    if (!url) return alert('Veuillez coller un URL de fichier.')
    try {
      setSubmittingId(devoirId)
      await deposerDevoirEtudiant(devoirId, url)
      alert('Dépôt envoyé ✅')
      setUrlFichier(prev => ({ ...prev, [devoirId]: '' }))
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Erreur lors du dépôt")
    } finally {
      setSubmittingId(null)
    }
  }

  return (
    <DashboardLayout role="etudiant">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Mes devoirs</h1>
        <p className="text-gray-600 mt-1">Consignes, date limite et dépôt de fichiers</p>

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
                placeholder="Rechercher un devoir ou un cours…"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="text-gray-600">Aucun devoir.</div>
            ) : (
              <div className="space-y-4">
                {filtered.map(d => (
                  <div key={d.id} className="border rounded-xl p-4">
                    <div className="flex justify-between gap-3">
                      <div>
                        <div className="font-semibold text-gray-800">{d.titre}</div>
                        <div className="text-sm text-gray-600">{d.cours?.titre || '—'}</div>
                        <div className="text-xs text-gray-500">Date limite: {formatDate(d.dateLimite)}</div>
                      </div>
                    </div>

                    {d.consigne && (
                      <p className="text-gray-700 text-sm mt-3 whitespace-pre-wrap">{d.consigne}</p>
                    )}

                    <div className="mt-4 flex gap-2 items-center">
                      <input
                        value={urlFichier[d.id] || ''}
                        onChange={(e) => setUrlFichier(prev => ({ ...prev, [d.id]: e.target.value }))}
                        placeholder="Collez le lien du fichier (Drive, Dropbox, etc.)"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <button
                        onClick={() => handleDepot(d.id)}
                        disabled={submittingId === d.id}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 inline-flex items-center"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {submittingId === d.id ? 'Envoi…' : 'Déposer'}
                      </button>
                    </div>
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
