// components/modals/AddDocumentModal.tsx
import React, { useState } from 'react'

interface AddDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onDocumentAdded: (document: any) => void
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ isOpen, onClose, onDocumentAdded }) => {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('actif') // Default status to 'actif'
  const [type, setType] = useState('cours') // Default type to 'cours'

  const handleAddDocument = () => {
    if (title && dueDate) {
      const newDocument = { 
        id: Date.now(), 
        title, 
        status, 
        dueDate, 
        type 
      }
      onDocumentAdded(newDocument)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ajouter un document</h2>
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
        <div className="flex justify-between">
          <button onClick={handleAddDocument} className="btn-primary">Ajouter</button>
          <button onClick={onClose} className="btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  )
}

export default AddDocumentModal
