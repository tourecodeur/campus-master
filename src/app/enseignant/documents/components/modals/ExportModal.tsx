// components/modals/ExportModal.tsx
import React from 'react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: number
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, courseId }) => {
  const handleExport = () => {
    console.log(`Exporting data for course ID: ${courseId}`)
    // Logic for exporting the data (could be CSV, PDF, etc.)
    // You can call a backend API or process the data on the frontend
  }

  if (!isOpen) return null

  return (
    <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Exporter les données</h2>
        <p>Voulez-vous exporter les données pour le cours avec l'ID : <strong>{courseId}</strong> ?</p>
        <div className="flex justify-between mt-6">
          <button onClick={handleExport} className="btn-primary">Exporter</button>
          <button onClick={onClose} className="btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
