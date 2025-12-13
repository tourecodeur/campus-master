'use client'

import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemType: 'course' | 'resource' | 'announcement'
  itemName: string
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  itemName
}: DeleteConfirmationModalProps) {
  const getItemTypeText = () => {
    switch (itemType) {
      case 'course': return 'ce cours'
      case 'resource': return 'cette ressource'
      case 'announcement': return 'cette annonce'
      default: return 'cet élément'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
            Confirmer la suppression
          </h2>
          
          <p className="text-gray-600 text-center mb-6">
            Êtes-vous sûr de vouloir supprimer {getItemTypeText()} ?<br />
            <span className="font-medium">{itemName}</span>
          </p>
          
          <p className="text-sm text-gray-500 text-center mb-6">
            Cette action est irréversible. Toutes les données associées seront définitivement supprimées.
          </p>

          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}