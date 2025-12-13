'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Plus, Calendar, Clock, MapPin, Edit, Trash2, Filter } from 'lucide-react'

export default function EmploiTempsPage() {
  const [selectedDay, setSelectedDay] = useState('Lundi')
  
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  
  const scheduleData = {
    'Lundi': [
      { id: 1, time: '08:00 - 10:00', course: 'Algorithmique', teacher: 'Dr. Diallo', room: 'A201', niveau: 'L1' },
      { id: 2, time: '10:30 - 12:30', course: 'Base de données', teacher: 'Prof. Ndiaye', room: 'B102', niveau: 'L2' },
      { id: 3, time: '14:00 - 16:00', course: 'Mathématiques', teacher: 'Dr. Sow', room: 'C301', niveau: 'L1' },
    ],
    'Mardi': [
      { id: 4, time: '09:00 - 11:00', course: 'Programmation Web', teacher: 'M. Diop', room: 'Lab Info', niveau: 'L3' },
      { id: 5, time: '13:00 - 15:00', course: 'Réseaux', teacher: 'Prof. Fall', room: 'D201', niveau: 'M1' },
    ],
    'Mercredi': [
      { id: 6, time: '08:30 - 10:30', course: 'Anglais', teacher: 'Mme. Kane', room: 'E101', niveau: 'L1' },
      { id: 7, time: '11:00 - 13:00', course: 'Management', teacher: 'Dr. Ba', room: 'F102', niveau: 'M2' },
    ],
    'Jeudi': [
      { id: 8, time: '10:00 - 12:00', course: 'Systèmes d\'exploitation', teacher: 'Prof. Diagne', room: 'Lab OS', niveau: 'L2' },
    ],
    'Vendredi': [
      { id: 9, time: '14:00 - 16:00', course: 'Projet', teacher: 'M. Mbaye', room: 'Projet Lab', niveau: 'M1' },
    ],
    'Samedi': [
      { id: 10, time: '09:00 - 12:00', course: 'Séminaire', teacher: 'Dr. Gueye', room: 'Amphi A', niveau: 'Tous' },
    ],
  }

  const todaySchedule = scheduleData[selectedDay as keyof typeof scheduleData] || []

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Emploi du temps</h1>
            <p className="text-gray-600 mt-1">Gestion des horaires de cours</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md">
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un cours
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 mr-4">{session.course}</h3>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {session.niveau}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          {session.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-green-500" />
                          {session.teacher}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                          {session.room}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun cours programmé pour ce jour</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Salles disponibles</h2>
            <div className="space-y-3">
              {['A201', 'B102', 'C301', 'Lab Info', 'D201', 'E101', 'F102', 'Lab OS', 'Amphi A'].map((room) => (
                <div key={room} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{room}</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Disponible
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Statistiques hebdomadaires</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Heures de cours</span>
                  <span className="text-sm font-medium">42h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Salles utilisées</span>
                  <span className="text-sm font-medium">9/12</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Enseignants actifs</span>
                  <span className="text-sm font-medium">15/18</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}