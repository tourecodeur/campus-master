// components/modals/EditDocumentModal.tsx
import React, { useState, useEffect } from 'react'

interface EditDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onDocumentUpdated: (document: any) => void
  document: any
}

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  isOpen,
  onClose,
  onDocumentUpdated,
  document
}) => {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')

  useEffect(() => {
    if (document) {
      setTitle(document.title)
      setDueDate(document.dueDate)
      setStatus(document.status)
      setType(document.type)
    }
  }, [document])

  const handleUpdateDocument = () => {
    if (title && dueDate && status && type) {
      const updatedDocument = { ...document, title, dueDate, status, type }
      onDocumentUpdated(updatedDocument)
      onClose()
    }
  }

  if (!isOpen || !document) return null

  return (
    <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Modifier le document</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du document"
          className="input mb-4 p-3 border rounded-md w-full"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input mb-4 p-3 border rounded-md w-full"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input mb-4 p-3 border rounded-md w-full"
        >
          <option value="cours">Cours</option>
          <option value="tp">TP</option>
          <option value="td">TD</option>
          <option value="video-cours">Vidéo Cours</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input mb-4 p-3 border rounded-md w-full"
        >
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
        <div className="flex justify-between mt-6">
          <button onClick={handleUpdateDocument} className="btn-primary">Sauvegarder</button>
          <button onClick={onClose} className="btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  )
}

export default EditDocumentModal
