
'use client'

import { useState, useEffect } from 'react' // Ajouter useEffect
import { X, Edit, Calendar, Clock, MapPin, Users, BookOpen, Trash2 } from 'lucide-react'

interface EditSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (updatedSession: any) => void
  onDelete: () => void
  session: any
}

export default function EditSessionModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  session
}: EditSessionModalProps) {
  const [formData, setFormData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const types = [
    { id: 'Cours', label: 'Cours magistral', color: 'bg-blue-100 text-blue-800' },
    { id: 'TD', label: 'Travaux dirigés', color: 'bg-green-100 text-green-800' },
    { id: 'TP', label: 'Travaux pratiques', color: 'bg-purple-100 text-purple-800' },
    { id: 'Projet', label: 'Projet', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'Réunion', label: 'Réunion', color: 'bg-red-100 text-red-800' }
  ]

  // Mettre à jour formData quand session change
  useEffect(() => {
    if (session) {
      setFormData({ ...session })
    } else {
      setFormData(null)
    }
  }, [session])

  const handleSave = async () => {
    if (!formData) return
    
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    onSave(formData)
    onClose()
    setIsSaving(false)
  }

  const handleDelete = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 400))
    onDelete()
    onClose()
    setIsSaving(false)
  }

  if (!isOpen || !session || !formData) return null // Ajouter la vérification pour formData

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Edit className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Modifier la séance</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                  Intitulé *
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Horaire *
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 08:00 - 10:00"
                />
                <p className="text-xs text-gray-500 mt-1">Format : HH:MM - HH:MM</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  Salle *
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  Type de séance
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {types.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.id })}
                      className={`px-3 py-2.5 text-center rounded-lg border text-sm font-medium transition ${
                        formData.type === type.id
                          ? `${type.color.split(' ')[0]} ${type.color.split(' ')[1]} border-blue-500`
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  Nombre d'étudiants
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={formData.students}
                    onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500">étudiants</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Notes supplémentaires..."
                />
              </div>
            </div>
          </div>

          {/* Confirmation de suppression */}
          {showDeleteConfirm && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-red-600 text-xs">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Confirmer la suppression</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Êtes-vous sûr de vouloir supprimer cette séance ? Cette action est irréversible.
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isSaving}
                      className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Supprimer définitivement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSaving}
              className="flex items-center text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Supprimer la séance
            </button>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
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
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}