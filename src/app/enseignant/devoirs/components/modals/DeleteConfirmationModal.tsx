// components/modals/DeleteConfirmationModal.tsx
import React from 'react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemType: string
  itemName: string
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  itemName
}) => {
  if (!isOpen) return null

  return (
    <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer <strong>{itemType}</strong> : <span className="font-medium text-gray-700">{itemName}</span> ?</p>
        <div className="flex justify-between mt-6">
          <button onClick={onConfirm} className="btn-danger">Supprimer</button>
          <button onClick={onClose} className="btn-secondary">Annuler</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
