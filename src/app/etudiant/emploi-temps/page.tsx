'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react'

export default function EmploiTempsPage() {
  const [selectedDay, setSelectedDay] = useState('Lundi')
  const [currentWeek, setCurrentWeek] = useState(0)
  
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  
  const scheduleData = {
    'Lundi': [
      { id: 1, time: '08:00 - 10:00', course: 'Algorithmique', teacher: 'Dr. Diallo', room: 'A201', type: 'Cours' },
      { id: 2, time: '10:30 - 12:30', course: 'Base de données', teacher: 'Prof. Ndiaye', room: 'B102', type: 'TD' },
      { id: 3, time: '14:00 - 16:00', course: 'Mathématiques', teacher: 'Dr. Sow', room: 'C301', type: 'Cours' },
    ],
    'Mardi': [
      { id: 4, time: '09:00 - 11:00', course: 'Programmation Web', teacher: 'M. Diop', room: 'Lab Info', type: 'TP' },
      { id: 5, time: '13:00 - 15:00', course: 'Réseaux', teacher: 'Prof. Fall', room: 'D201', type: 'Cours' },
    ],
    'Mercredi': [
      { id: 6, time: '08:30 - 10:30', course: 'Anglais', teacher: 'Mme. Kane', room: 'E101', type: 'TD' },
      { id: 7, time: '11:00 - 13:00', course: 'Management', teacher: 'Dr. Ba', room: 'F102', type: 'Cours' },
    ],
    'Jeudi': [
      { id: 8, time: '10:00 - 12:00', course: 'Systèmes d\'exploitation', teacher: 'Prof. Diagne', room: 'Lab OS', type: 'TP' },
      { id: 9, time: '14:00 - 16:00', course: 'Projet Algorithmique', teacher: 'Dr. Diallo', room: 'A201', type: 'Projet' },
    ],
    'Vendredi': [
      { id: 10, time: '08:00 - 10:00', course: 'Base de données', teacher: 'Prof. Ndiaye', room: 'B102', type: 'TD' },
      { id: 11, time: '10:30 - 12:30', course: 'Séminaire', teacher: 'Dr. Gueye', room: 'Amphi A', type: 'Conférence' },
    ],
    'Samedi': [],
  }

  const todaySchedule = scheduleData[selectedDay as keyof typeof scheduleData] || []

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Cours': return 'bg-blue-100 text-blue-800'
      case 'TD': return 'bg-green-100 text-green-800'
      case 'TP': return 'bg-purple-100 text-purple-800'
      case 'Projet': return 'bg-yellow-100 text-yellow-800'
      case 'Conférence': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout role="etudiant">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Emploi du temps</h1>
          <p className="text-gray-600 mt-1">Vos horaires de cours et activités</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentWeek(currentWeek - 1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mx-4">Semaine du 15 Janvier 2024</h2>
              <button
                onClick={() => setCurrentWeek(currentWeek + 1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button className="flex items-center text-blue-600 hover:text-blue-700">
              <Calendar className="w-4 h-4 mr-1" />
              Exporter calendrier
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-3 rounded-lg font-medium transition ${
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
                <div key={session.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-gray-800 mr-4">{session.course}</h3>
                        <span className={`px-3 py-1 text-xs rounded-full ${getTypeColor(session.type)}`}>
                          {session.type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          {session.time}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2 text-green-500" />
                          {session.teacher}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                          {session.room}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Voir le cours
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                        Télécharger support
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">Durée: 2h</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">Aucun cours programmé</h3>
                <p className="text-gray-400">Profitez de cette journée pour réviser ou vous reposer</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Statistiques hebdomadaires</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Heures de cours</span>
                  <span className="font-semibold">24h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Cours magistraux</span>
                  <span className="font-semibold">12h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Travaux pratiques</span>
                  <span className="font-semibold">8h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Travaux dirigés</span>
                  <span className="font-semibold">4h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '17%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Prochains événements</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                  <h3 className="font-semibold">Examen - Mathématiques</h3>
                </div>
                <p className="text-sm text-gray-600 ml-6">25 Janvier 2024 • 08:00 - 10:00</p>
                <p className="text-sm text-gray-600 ml-6">Salle: Amphi B</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  <h3 className="font-semibold">Rendu projet Algorithmique</h3>
                </div>
                <p className="text-sm text-gray-600 ml-6">30 Janvier 2024 • 23:59</p>
                <p className="text-sm text-gray-600 ml-6">Format: PDF en ligne</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-purple-600 rounded-full mr-3"></div>
                  <h3 className="font-semibold">Séminaire d'orientation</h3>
                </div>
                <p className="text-sm text-gray-600 ml-6">2 Février 2024 • 10:00 - 12:00</p>
                <p className="text-sm text-gray-600 ml-6">Salle: Amphi A</p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-yellow-600 rounded-full mr-3"></div>
                  <h3 className="font-semibold">Réunion de promotion</h3>
                </div>
                <p className="text-sm text-gray-600 ml-6">5 Février 2024 • 14:00 - 15:00</p>
                <p className="text-sm text-gray-600 ml-6">Salle: F102</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}