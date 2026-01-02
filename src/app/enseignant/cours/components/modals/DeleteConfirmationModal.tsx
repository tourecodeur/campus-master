'use client'

import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => Promise<void> | void
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  title = 'Confirmer la suppression',
  message = 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
  confirmLabel = 'Supprimer',
  loading = false,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-4">
        <p className="text-gray-700">{message}</p>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            <Trash2 className="w-4 h-4 mr-2" />
            {loading ? 'Suppression...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
