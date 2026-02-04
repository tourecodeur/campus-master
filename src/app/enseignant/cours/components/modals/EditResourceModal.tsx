'use client'

import { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Save } from 'lucide-react'

export type EditResourcePayload = {
  id: number
  nomFichier: string
  urlFichier: string
  type?: string
  version?: number
}

export type ResourceItem = {
  id: number
  nomFichier?: string
  urlFichier?: string
  type?: string
  version?: number
}

type Props = {
  isOpen: boolean
  onClose: () => void
  resource: ResourceItem | null
  onSubmit: (payload: EditResourcePayload) => Promise<void> | void
}

export default function EditResourceModal({ isOpen, onClose, resource, onSubmit }: Props) {
  const [nomFichier, setNomFichier] = useState('')
  const [urlFichier, setUrlFichier] = useState('')
  const [type, setType] = useState('PDF')
  const [version, setVersion] = useState<number>(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && resource) {
      setNomFichier(resource.nomFichier ?? '')
      setUrlFichier(resource.urlFichier ?? '')
      setType(resource.type ?? 'PDF')
      setVersion(resource.version ?? 1)
      setLoading(false)
    }
  }, [isOpen, resource])

  const canSubmit = useMemo(
    () => !!resource?.id && nomFichier.trim() && urlFichier.trim(),
    [resource, nomFichier, urlFichier]
  )

  const handleSubmit = async () => {
    if (!resource) return
    if (!canSubmit) return
    setLoading(true)
    try {
      await onSubmit({
        id: resource.id,
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
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier la ressource" size="lg">
      <div className="space-y-4">
        {!resource && (
          <div className="p-3 rounded-lg bg-yellow-50 text-yellow-800 text-sm">
            Aucune ressource sélectionnée.
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du fichier *</label>
          <input
            value={nomFichier}
            onChange={(e) => setNomFichier(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL du fichier *</label>
          <input
            value={urlFichier}
            onChange={(e) => setUrlFichier(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
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
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Sauvegarde...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
