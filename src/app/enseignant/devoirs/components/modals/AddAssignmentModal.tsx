// components/modals/AddAssignmentModal.tsx
import React, { useState } from 'react'

interface AddAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAssignmentAdded: (assignment: any) => void
}

const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({ isOpen, onClose, onAssignmentAdded }) => {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('attente')

  const handleAddAssignment = () => {
    if (title && dueDate) {
      const newAssignment = { 
        id: Date.now(), 
        title, 
        status, 
        dueDate, 
        courseId: 1 
      }
      onAssignmentAdded(newAssignment)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ajouter un devoir</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du devoir"
          className="input mb-4 p-3 border rounded-md w-full"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input mb-4 p-3 border rounded-md w-full"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input mb-4 p-3 border rounded-md w-full"
        >
          <option value="attente">Attente</option>
          <option value="en retard">En Retard</option>
          <option value="rendu">Rendu</option>
          <option value="corrige">Corrigé</option>
        </select>
        <div className="flex justify-between">
          <button onClick={handleAddAssignment} className="btn-primary">Ajouter</button>
          <button onClick={onClose} className="btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  )
}

export default AddAssignmentModal
