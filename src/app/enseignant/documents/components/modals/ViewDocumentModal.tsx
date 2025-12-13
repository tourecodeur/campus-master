// components/modals/ViewDocumentModal.tsx
import React from 'react'

interface ViewDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  document: any
}

const ViewDocumentModal: React.FC<ViewDocumentModalProps> = ({ isOpen, onClose, document }) => {
  if (!isOpen || !document) return null

  return (
    <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Détails du document</h2>
        <div className="mb-4">
          <p><strong>Titre :</strong> {document.title}</p>
          <p><strong>Date de publication :</strong> {document.dueDate}</p>
          <p><strong>Statut :</strong> {document.status}</p>
          <p><strong>Type :</strong> {document.type}</p>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  )
}

export default ViewDocumentModal
