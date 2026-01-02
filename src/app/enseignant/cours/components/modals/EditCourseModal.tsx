'use client'

import { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Save } from 'lucide-react'

export type CourseItem = {
  id: number
  titre?: string
  description?: string
}

export type EditCoursePayload = {
  id: number
  titre: string
  description?: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  course: CourseItem | null
  onSubmit: (payload: EditCoursePayload) => Promise<void> | void
}

export default function EditCourseModal({ isOpen, onClose, course, onSubmit }: Props) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && course) {
      setTitre(course.titre ?? '')
      setDescription(course.description ?? '')
      setLoading(false)
    }
  }, [isOpen, course])

  const canSubmit = useMemo(() => !!course?.id && titre.trim(), [course, titre])

  const handleSubmit = async () => {
    if (!course) return
    if (!canSubmit) return
    setLoading(true)
    try {
      await onSubmit({
        id: course.id,
        titre: titre.trim(),
        description: description.trim() || undefined,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le cours" size="lg">
      <div className="space-y-4">
        {!course && (
          <div className="p-3 rounded-lg bg-yellow-50 text-yellow-800 text-sm">
            Aucun cours sélectionné.
          </div>
        )}

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
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Sauvegarde...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
