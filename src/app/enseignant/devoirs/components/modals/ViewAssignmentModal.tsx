// components/modals/ViewAssignmentModal.tsx
import React from 'react'

interface ViewAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  assignment: any
}

const ViewAssignmentModal: React.FC<ViewAssignmentModalProps> = ({ isOpen, onClose, assignment }) => {
  if (!isOpen || !assignment) return null

  return (
    <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Détails du devoir</h2>

        <div className="mb-4">
          <p><strong>Titre :</strong> {assignment.title}</p>
          <p><strong>Date de rendu :</strong> {assignment.dueDate}</p>
          <p><strong>Statut :</strong> 
            <span className={`px-3 py-1 text-xs rounded-full ${assignment.status === 'attente' ? 'bg-blue-100 text-blue-800' : assignment.status === 'en retard' ? 'bg-yellow-100 text-yellow-800' : assignment.status === 'rendu' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {assignment.status}
            </span>
          </p>
        </div>

        {/* Ajouter d'autres détails si nécessaire */}
        <div className="mb-4">
          <p><strong>Course ID :</strong> {assignment.courseId}</p>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  )
}

export default ViewAssignmentModal
