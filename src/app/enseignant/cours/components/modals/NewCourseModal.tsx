'use client'

import { useState } from 'react'
import { X, Plus, BookOpen, Users, Clock } from 'lucide-react'

interface NewCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onCourseCreated: (course: any) => void
}

export default function NewCourseModal({
  isOpen,
  onClose,
  onCourseCreated
}: NewCourseModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    niveau: 'L1',
    hours: 30,
    credits: 3,
    maxStudents: 40,
    schedule: '',
    room: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const niveaux = ['L1', 'L2', 'L3', 'M1', 'M2']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulation de création
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newCourse = {
      id: Date.now(), // ID temporaire
      ...formData,
      students: 0
    }
    
    console.log('New course created:', newCourse)
    onCourseCreated(newCourse)
    onClose()
    
    // Reset form
    setFormData({
      code: '',
      title: '',
      description: '',
      niveau: 'L1',
      hours: 30,
      credits: 3,
      maxStudents: 40,
      schedule: '',
      room: ''
    })
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center">
            <Plus className="w-6 h-6 mr-3 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Créer un nouveau cours</h2>
              <p className="text-sm text-gray-600 mt-1">Remplissez les informations du cours</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne de gauche */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code du cours *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: ALG101"
                />
                <p className="text-xs text-gray-500 mt-1">Format recommandé : XXX###</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intitulé du cours *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Algorithmique avancée"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {niveaux.map((niv) => (
                    <button
                      key={niv}
                      type="button"
                      onClick={() => setFormData({ ...formData, niveau: niv })}
                      className={`py-2 text-center rounded-lg border text-sm font-medium transition ${
                        formData.niveau === niv
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {niv}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description du cours *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Décrivez le contenu et les objectifs du cours..."
                />
              </div>
            </div>

            {/* Colonne de droite */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Volume horaire *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="120"
                      required
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">heures</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crédits ECTS *
                  </label>
                  <select
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map((credit) => (
                      <option key={credit} value={credit}>
                        {credit} crédit{credit > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  Capacité maximale *
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  required
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre d'étudiants maximum"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horaires (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Lundi 08:00-10:00, Jeudi 08:00-10:00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salle (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: A201"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                  <p className="text-sm text-blue-700">
                    Le cours sera créé avec un espace vide. Vous pourrez ensuite y ajouter des ressources, des annonces et gérer les étudiants.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer le cours
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}