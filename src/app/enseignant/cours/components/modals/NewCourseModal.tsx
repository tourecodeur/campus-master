'use client'

import { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Plus } from 'lucide-react'

export type NewCoursePayload = {
  titre: string
  description?: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: NewCoursePayload) => Promise<void> | void
}

export default function NewCourseModal({ isOpen, onClose, onSubmit }: Props) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTitre('')
      setDescription('')
      setLoading(false)
    }
  }, [isOpen])

  const canSubmit = useMemo(() => titre.trim().length > 0, [titre])

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    try {
      await onSubmit({ titre: titre.trim(), description: description.trim() || undefined })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouveau cours" size="lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
          <input value={titre} onChange={(e) => setTitre(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
            <Plus className="w-4 h-4 mr-2" />
            {loading ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
