// components/modals/EditAssignmentModal.tsx
import React, { useState, useEffect } from 'react'

interface EditAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAssignmentUpdated: (assignment: any) => void
  assignment: any
}

const EditAssignmentModal: React.FC<EditAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssignmentUpdated,
  assignment
}) => {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('attente')

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title)
      setDueDate(assignment.dueDate)
      setStatus(assignment.status)
    }
  }, [assignment])

  const handleUpdateAssignment = () => {
    if (title && dueDate) {
      const updatedAssignment = { ...assignment, title, dueDate, status }
      onAssignmentUpdated(updatedAssignment)
      onClose()
    }
  }

  if (!isOpen || !assignment) return null

  return (
    <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Modifier le devoir</h2>
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
        <div className="flex justify-between mt-6">
          <button onClick={handleUpdateAssignment} className="btn-primary">Sauvegarder</button>
          <button onClick={onClose} className="btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  )
}

export default EditAssignmentModal
