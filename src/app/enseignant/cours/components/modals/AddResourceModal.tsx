'use client'

import { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Upload, Link as LinkIcon } from 'lucide-react'

export type AddResourcePayload = {
  coursId: number
  nomFichier: string
  urlFichier: string
  type?: string
  version?: number
}

type Props = {
  isOpen: boolean
  onClose: () => void
  coursId: number | null
  onSubmit: (payload: AddResourcePayload) => Promise<void> | void
}

export default function AddResourceModal({ isOpen, onClose, coursId, onSubmit }: Props) {
  const [nomFichier, setNomFichier] = useState('')
  const [urlFichier, setUrlFichier] = useState('')
  const [type, setType] = useState('PDF')
  const [version, setVersion] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const canSubmit = useMemo(() => !!coursId && nomFichier.trim() && urlFichier.trim(), [coursId, nomFichier, urlFichier])

  useEffect(() => {
    if (isOpen) {
      setNomFichier('')
      setUrlFichier('')
      setType('PDF')
      setVersion(1)
      setLoading(false)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!coursId) return
    if (!canSubmit) return
    setLoading(true)
    try {
      await onSubmit({
        coursId,
        nomFichier: nomFichier.trim(),
        urlFichier: urlFichier.trim(),
        type,
        version,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une ressource" size="lg">
      <div className="space-y-4">
        {!coursId && (
          <div className="p-3 rounded-lg bg-yellow-50 text-yellow-800 text-sm">
            Sélectionnez d’abord un cours avant d’ajouter une ressource.
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du fichier *</label>
          <input
            value={nomFichier}
            onChange={(e) => setNomFichier(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Ex: Chapitre 1 - Réseaux.pdf"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL du fichier *</label>
          <div className="flex gap-2">
            <span className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 inline-flex items-center">
              <LinkIcon className="w-4 h-4" />
            </span>
            <input
              value={urlFichier}
              onChange={(e) => setUrlFichier(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="https://..."
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Le backend attend généralement <code>urlFichier</code> (ex: lien Google Drive, S3, etc.).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="PDF">PDF</option>
              <option value="DOC">DOC</option>
              <option value="PPT">PPT</option>
              <option value="VIDEO">VIDEO</option>
              <option value="AUTRE">AUTRE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input
              type="number"
              min={1}
              value={version}
              onChange={(e) => setVersion(Number(e.target.value || 1))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
            <Upload className="w-4 h-4 mr-2" />
            {loading ? 'Ajout...' : 'Ajouter'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
