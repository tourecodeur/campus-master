'use client'

import { useState } from 'react'
import { X, Save, AlertTriangle, CheckCircle } from 'lucide-react'

interface SaveAllModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveAll: () => void
  courseName: string
  modifiedCount: number
  totalCount: number
}

export default function SaveAllModal({
  isOpen,
  onClose,
  onSaveAll,
  courseName,
  modifiedCount,
  totalCount
}: SaveAllModalProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveAll = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    onSaveAll()
    onClose()
    setIsSaving(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
            <Save className="w-6 h-6 text-blue-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
            Enregistrer toutes les modifications
          </h2>
          
          <p className="text-gray-600 text-center mb-4">
            Vous avez modifié <span className="font-semibold">{modifiedCount}</span> notes sur <span className="font-semibold">{totalCount}</span> pour le cours <span className="font-semibold">{courseName}</span>.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Note importante</h4>
                <p className="text-sm text-yellow-700">
                  Cette action enregistrera toutes les modifications mais ne validera pas les notes. Les notes resteront en statut "en attente" jusqu'à validation manuelle.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Notes modifiées :</span>
                <span className="font-medium">{modifiedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Notes manquantes :</span>
                <span className="font-medium">{totalCount - modifiedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Statut après enregistrement :</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  En attente
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSaving || modifiedCount === 0}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer toutes les modifications
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}