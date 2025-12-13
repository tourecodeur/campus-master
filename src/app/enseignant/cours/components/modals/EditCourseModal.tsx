'use client'

import { useState, useEffect } from 'react'
import { X, Edit, BookOpen, Users, Clock } from 'lucide-react'

interface Course {
  id: number
  code: string
  title: string
  niveau: string
  students: number
  hours: number
  credits: number
}

interface EditCourseModalProps {
  isOpen: boolean
  onClose: () => void
  course: Course | null
  onCourseUpdated: (updatedCourse: Course) => void
}

export default function EditCourseModal({
  isOpen,
  onClose,
  course,
  onCourseUpdated
}: EditCourseModalProps) {
  const [formData, setFormData] = useState<Partial<Course>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const niveaux = ['L1', 'L2', 'L3', 'M1', 'M2']

  // Initialiser le formulaire avec les données du cours
  useEffect(() => {
    if (course) {
      setFormData({ ...course })
    }
  }, [course])

  // Vérifier les changements
  useEffect(() => {
    if (course) {
      const changed = Object.keys(formData).some(
        key => formData[key as keyof Course] !== course[key as keyof Course]
      )
      setHasChanges(changed)
    }
  }, [formData, course])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!course || !hasChanges) {
      onClose()
      return
    }

    setIsSubmitting(true)
    
    // Simulation de mise à jour
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const updatedCourse = {
      ...course,
      ...formData
    }
    
    console.log('Course updated:', updatedCourse)
    onCourseUpdated(updatedCourse)
    onClose()
    setIsSubmitting(false)
  }

  if (!isOpen || !course) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center">
            <Edit className="w-6 h-6 mr-3 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Modifier le cours
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {course.code} - {course.title}
              </p>
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
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: ALG101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intitulé du cours *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
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
                      value={formData.hours || 0}
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
                    value={formData.credits || 3}
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
                  Nombre d'étudiants
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={formData.students || 0}
                    onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    readOnly
                  />
                  <div className="absolute right-3 top-2 flex items-center">
                    <span className="text-gray-500 mr-2">étudiants</span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      Lecture seule
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Le nombre d'étudiants est synchronisé automatiquement
                </p>
              </div>
            </div>
          </div>

          {/* Section informations supplémentaires */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Autres informations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Statistiques du cours</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Ressources partagées :</span>
                    <span className="font-medium">12 fichiers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Annonces publiées :</span>
                    <span className="font-medium">3 annonces</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Date de création :</span>
                    <span className="font-medium">01/09/2024</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Actions disponibles</h4>
                <ul className="space-y-1 text-sm">
                  <li className="text-green-700">• Gérer les ressources pédagogiques</li>
                  <li className="text-green-700">• Publier des annonces</li>
                  <li className="text-green-700">• Consulter les statistiques</li>
                  <li className="text-green-700">• Exporter les données</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="text-sm text-gray-500">
              {hasChanges ? (
                <span className="text-blue-600 flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
                  Modifications non enregistrées
                </span>
              ) : (
                <span>Toutes les modifications sont enregistrées</span>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !hasChanges}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center"
              >
                {isSubmitting ? (
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
        </form>
      </div>
    </div>
  )
}