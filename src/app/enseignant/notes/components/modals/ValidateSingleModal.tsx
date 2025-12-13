'use client'

import { useState } from 'react'
import { X, CheckCircle, User } from 'lucide-react'

interface ValidateSingleModalProps {
  isOpen: boolean
  onClose: () => void
  onValidate: () => void
  student: {
    matricule: string
    nom: string
    prenom: string
    note: number | null
  }
  courseName: string
}

export default function ValidateSingleModal({
  isOpen,
  onClose,
  onValidate,
  student,
  courseName
}: ValidateSingleModalProps) {
  const [isValidating, setIsValidating] = useState(false)

  const handleValidate = async () => {
    setIsValidating(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    onValidate()
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
          
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
            Valider la note
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <User className="w-4 h-4 text-gray-500 mr-2" />
              <div>
                <h3 className="font-medium text-gray-800">{student.nom} {student.prenom}</h3>
                <p className="text-sm text-gray-600">Matricule : {student.matricule}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Cours :</span>
                <span className="font-medium">{courseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Note :</span>
                <span className="font-medium text-lg">
                  {student.note !== null ? `${student.note}/20` : 'Non saisie'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut actuel :</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  En attente
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center mb-6">
            Confirmez-vous la validation de cette note ? Elle sera alors considérée comme définitive.
          </p>

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
                  Valider la note
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}