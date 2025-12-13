'use client'

import { useState } from 'react'
import { X, Edit, User, Calculator } from 'lucide-react'

interface EditGradeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: number) => void
  student: {
    matricule: string
    nom: string
    prenom: string
    note: number | null
  }
  courseName: string
}

export default function EditGradeModal({
  isOpen,
  onClose,
  onSave,
  student,
  courseName
}: EditGradeModalProps) {
  const [note, setNote] = useState<string>(student.note?.toString() || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    const numericNote = parseFloat(note)
    if (isNaN(numericNote) || numericNote < 0 || numericNote > 20) {
      alert('Veuillez saisir une note valide entre 0 et 20')
      return
    }

    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    onSave(numericNote)
    onClose()
    setIsSaving(false)
  }

  const suggestedGrades = [0, 5, 10, 12, 14, 16, 18, 20]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Edit className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Modifier la note</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
              <User className="w-4 h-4 text-gray-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-800">{student.nom} {student.prenom}</h3>
                <p className="text-sm text-gray-600">Matricule : {student.matricule}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Cours :</span>
              <span className="font-medium">{courseName}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calculator className="w-4 h-4 mr-2 text-blue-600" />
              Nouvelle note (sur 20)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg"
                placeholder="Saisir une note..."
              />
              <span className="absolute right-3 top-3 text-gray-500">/20</span>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Notes suggérées :</p>
              <div className="flex flex-wrap gap-2">
                {suggestedGrades.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setNote(grade.toString())}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${
                      parseFloat(note) === grade
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-blue-600 text-xs">i</span>
              </div>
              <p className="text-sm text-blue-700">
                La note sera automatiquement mise en statut "en attente" après modification et devra être validée pour être définitive.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !note}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Enregistrer la note
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}