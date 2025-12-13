'use client'

import { useState } from 'react'
import { X, Plus, Calendar, Clock, MapPin, Users, BookOpen } from 'lucide-react'

interface NewTimeSlotModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (newSlot: any) => void
  days: string[]
}

export default function NewTimeSlotModal({
  isOpen,
  onClose,
  onSave,
  days
}: NewTimeSlotModalProps) {
  const [formData, setFormData] = useState({
    day: 'Lundi',
    startTime: '08:00',
    endTime: '10:00',
    course: '',
    room: '',
    type: 'Cours',
    maxStudents: 40,
    description: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  const types = [
    { id: 'Cours', label: 'Cours magistral', color: 'bg-blue-100 text-blue-800' },
    { id: 'TD', label: 'Travaux dirigés', color: 'bg-green-100 text-green-800' },
    { id: 'TP', label: 'Travaux pratiques', color: 'bg-purple-100 text-purple-800' },
    { id: 'Projet', label: 'Projet', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'Réunion', label: 'Réunion', color: 'bg-red-100 text-red-800' }
  ]

  const handleSave = async () => {
    if (!formData.course || !formData.room) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newSlot = {
      id: Date.now(),
      time: `${formData.startTime} - ${formData.endTime}`,
      course: formData.course,
      room: formData.room,
      students: 0,
      type: formData.type,
      maxStudents: formData.maxStudents,
      description: formData.description
    }
    
    onSave(newSlot)
    onClose()
    
    // Reset form
    setFormData({
      day: 'Lundi',
      startTime: '08:00',
      endTime: '10:00',
      course: '',
      room: '',
      type: 'Cours',
      maxStudents: 40,
      description: ''
    })
    setIsSaving(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Plus className="w-6 h-6 mr-3 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Nouveau créneau horaire</h2>
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
            {/* Colonne de gauche */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  Jour *
                </label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Horaire *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Heure de début</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Heure de fin</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                  Type de séance *
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
            </div>

            {/* Colonne de droite */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cours / Intitulé *
                </label>
                <input
                  type="text"
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Algorithmique avancée"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  Salle *
                </label>
                <input
                  type="text"
                  required
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: A201, Lab Info, Amphi B"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  Capacité maximale
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500">étudiants</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Notes, objectifs, matériel requis..."
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <p>Créneau horaire : {formData.day} • {formData.startTime} - {formData.endTime}</p>
                <p className="mt-1">Durée : {calculateDuration(formData.startTime, formData.endTime)} heures</p>
              </div>

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
                      Création...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer le créneau
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function calculateDuration(start: string, end: string): string {
  const [startHour, startMinute] = start.split(':').map(Number)
  const [endHour, endMinute] = end.split(':').map(Number)
  
  const startTotal = startHour * 60 + startMinute
  const endTotal = endHour * 60 + endMinute
  
  const durationMinutes = endTotal - startTotal
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  
  return minutes > 0 ? `${hours}h${minutes}` : `${hours}h`
}