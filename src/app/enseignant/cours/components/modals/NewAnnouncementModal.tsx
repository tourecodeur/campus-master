'use client'

import { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Plus } from 'lucide-react'

export type NewAnnouncementPayload = {
  titre: string
  contenu: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  coursId: number | null
  onSubmit: (payload: NewAnnouncementPayload) => Promise<void> | void
}

export default function NewAnnouncementModal({ isOpen, onClose, coursId, onSubmit }: Props) {
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTitre('')
      setContenu('')
      setLoading(false)
    }
  }, [isOpen])

  const canSubmit = useMemo(() => !!coursId && titre.trim() && contenu.trim(), [coursId, titre, contenu])

  const handleSubmit = async () => {
    if (!coursId) return
    if (!canSubmit) return
    setLoading(true)
    try {
      await onSubmit({ titre: titre.trim(), contenu: contenu.trim() })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouvelle annonce" size="lg">
      <div className="space-y-4">
        {!coursId && (
          <div className="p-3 rounded-lg bg-yellow-50 text-yellow-800 text-sm">
            Sélectionnez un cours avant de publier une annonce.
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
          <input value={titre} onChange={(e) => setTitre(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={5}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
            <Plus className="w-4 h-4 mr-2" />
            {loading ? 'Publication...' : 'Publier'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
