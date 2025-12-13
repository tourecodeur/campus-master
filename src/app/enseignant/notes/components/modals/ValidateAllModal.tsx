'use client'

import { useState } from 'react'
import { X, CheckCircle, AlertTriangle, Users } from 'lucide-react'

interface ValidateAllModalProps {
  isOpen: boolean
  onClose: () => void
  onValidateAll: () => void
  courseName: string
  pendingCount: number
}

export default function ValidateAllModal({
  isOpen,
  onClose,
  onValidateAll,
  courseName,
  pendingCount
}: ValidateAllModalProps) {
  const [isValidating, setIsValidating] = useState(false)

  const handleValidate = async () => {
    setIsValidating(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    onValidateAll()
    onClose()
    setIsValidating(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
            Valider toutes les notes
          </h2>
          
          <p className="text-gray-600 text-center mb-4">
            Vous êtes sur le point de valider toutes les notes <span className="font-semibold">{pendingCount}</span> notes en attente pour le cours <span className="font-semibold">{courseName}</span>.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Attention</h4>
                <p className="text-sm text-yellow-700">
                  Une fois validées, les notes seront définitivement enregistrées dans le système académique et ne pourront plus être modifiées sans autorisation administrative.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Notes en attente :</span>
              <span className="font-medium">{pendingCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Statut actuel :</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Non validé
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              disabled={isValidating}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Validation...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Valider toutes les notes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}