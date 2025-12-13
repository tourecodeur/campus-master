'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import NewTimeSlotModal from './modals/NewTimeSlotModal'
import ExportCalendarModal from './modals/ExportCalendarModal'
import ViewAttendanceModal from './modals/ViewAttendanceModal'
import DownloadListModal from './modals/DownloadListModal'
import EditSessionModal from './modals/EditSessionModal'
import TakeAttendanceModal from './modals/TakeAttendanceModal'

export default function EnseignantEmploiTempsPage() {
  const [selectedDay, setSelectedDay] = useState('Lundi')
  const [currentWeek, setCurrentWeek] = useState(0)
  
    // États pour les modals
  const [showNewTimeSlotModal, setShowNewTimeSlotModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showViewAttendanceModal, setShowViewAttendanceModal] = useState(false)
  const [showDownloadListModal, setShowDownloadListModal] = useState(false)
  const [showEditSessionModal, setShowEditSessionModal] = useState(false)
  const [showTakeAttendanceModal, setShowTakeAttendanceModal] = useState(false)
  
  const [selectedSession, setSelectedSession] = useState<any>(null)

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  
  const [scheduleData, setScheduleData] = useState({
    'Lundi': [
      { id: 1, time: '08:00 - 10:00', course: 'Algorithmique', room: 'A201', students: 45, type: 'Cours' },
      { id: 2, time: '14:00 - 16:00', course: 'Mathématiques', room: 'C301', students: 48, type: 'Cours' },
    ],
    'Mardi': [
      { id: 3, time: '10:30 - 12:30', course: 'Base de données', room: 'B102', students: 40, type: 'TD' },
    ],
    'Mercredi': [
      { id: 4, time: '08:30 - 10:30', course: 'Algorithmique (TP)', room: 'Lab Info', students: 22, type: 'TP' },
    ],
    'Jeudi': [
      { id: 5, time: '08:00 - 10:00', course: 'Algorithmique', room: 'A201', students: 45, type: 'Cours' },
      { id: 6, time: '14:00 - 16:00', course: 'Projet Algorithmique', room: 'A201', students: 45, type: 'Projet' },
    ],
    'Vendredi': [
      { id: 7, time: '08:00 - 10:00', course: 'Base de données', room: 'B102', students: 40, type: 'TD' },
    ],
    'Samedi': [],
  })


  const todaySchedule = scheduleData[selectedDay as keyof typeof scheduleData] || []

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Cours': return 'bg-blue-100 text-blue-800'
      case 'TD': return 'bg-green-100 text-green-800'
      case 'TP': return 'bg-purple-100 text-purple-800'
      case 'Projet': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

   // Fonction pour ouvrir les modals avec une session
  const openModalWithSession = (session: any, setModal: (value: boolean) => void) => {
    if (!session) {
      console.error('Aucune session sélectionnée')
      return
    }
    setSelectedSession(session)
    setModal(true)
  }


    // Handlers
  const handleNewTimeSlot = (newSlot: any) => {
    const daySchedule = [...scheduleData[selectedDay as keyof typeof scheduleData]]
    daySchedule.push({ ...newSlot, day: selectedDay })
    
    setScheduleData({
      ...scheduleData,
      [selectedDay]: daySchedule
    })
  }

  const handleExportCalendar = (format: any) => {
    console.log('Exporting calendar in format:', format)
    // Logique d'export
  }

  const handleDownloadList = (format: any, listType: any) => {
    console.log('Downloading list:', format, listType)
    // Logique de téléchargement
  }

  const handleEditSession = (updatedSession: any) => {
    const daySchedule = scheduleData[selectedDay as keyof typeof scheduleData]
    const updatedDaySchedule = daySchedule.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    )
    
    setScheduleData({
      ...scheduleData,
      [selectedDay]: updatedDaySchedule
    })
  }

  const handleDeleteSession = () => {
    if (selectedSession) {
      const daySchedule = scheduleData[selectedDay as keyof typeof scheduleData]
      const updatedDaySchedule = daySchedule.filter(session => session.id !== selectedSession.id)
      
      setScheduleData({
        ...scheduleData,
        [selectedDay]: updatedDaySchedule
      })
    }
  }

  const handleSaveAttendance = (attendance: any) => {
    console.log('Saving attendance:', attendance)
    // Logique d'enregistrement des présences
  }

  return (
    <DashboardLayout role="enseignant">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mon Emploi du Temps</h1>
            <p className="text-gray-600 mt-1">Gestion de vos horaires d'enseignement</p>
          </div>
          <button 
            onClick={() => setShowNewTimeSlotModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau créneau
          </button>
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
            <button 
              onClick={() => setShowExportModal(true)}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
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
                          <MapPin className="w-4 h-4 mr-2 text-green-500" />
                          {session.room}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-purple-500" />
                          {session.students} étudiants
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => {
                        setSelectedSession(session)
                        setShowViewAttendanceModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Voir les présences
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedSession(session)
                        setShowDownloadListModal(true)
                      }}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                    >
                      Télécharger liste
                    </button>
                    </div>
                    <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => {
                        setSelectedSession(session)
                        setShowEditSessionModal(true)
                      }}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedSession(session)
                        setShowTakeAttendanceModal(true)
                      }}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Présences
                    </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">Aucun cours programmé</h3>
                <p className="text-gray-400">Journée de préparation ou de recherche</p>
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
                  <span className="text-gray-700">Heures d'enseignement</span>
                  <span className="font-semibold">16h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Charge normale: 20h/semaine</p>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Étudiants totaux</span>
                  <span className="font-semibold">85</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Salles utilisées</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
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
                  <h3 className="font-semibold">Réunion département</h3>
                </div>
                <p className="text-sm text-gray-600 ml-6">22 Janvier 2024 • 10:00 - 12:00</p>
                <p className="text-sm text-gray-600 ml-6">Salle: Salle des professeurs</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  <h3 className="font-semibold">Correction copies</h3>
                </div>
                <p className="text-sm text-gray-600 ml-6">25 Janvier 2024 • 14:00 - 17:00</p>
                <p className="text-sm text-gray-600 ml-6">Deadline: 28/01/2024</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-purple-600 rounded-full mr-3"></div>
                  <h3 className="font-semibold">Séminaire pédagogique</h3>
                </div>
                <p className="text-sm text-gray-600 ml-6">30 Janvier 2024 • 09:00 - 11:00</p>
                <p className="text-sm text-gray-600 ml-6">Salle: Amphi B</p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-yellow-600 rounded-full mr-3"></div>
                  <h3 className="font-semibold">Rendu notes Algorithmique</h3>
                </div>
                <p className="text-sm text-gray-600 ml-6">1 Février 2024 • 23:59</p>
                <p className="text-sm text-gray-600 ml-6">Plateforme en ligne</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {/* Modals */}
      <NewTimeSlotModal
        isOpen={showNewTimeSlotModal}
        onClose={() => setShowNewTimeSlotModal(false)}
        onSave={handleNewTimeSlot}
        days={days}
      />

      <ExportCalendarModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportCalendar}
      />

      <ViewAttendanceModal
        isOpen={showViewAttendanceModal}
        onClose={() => {
          setShowViewAttendanceModal(false)
          setSelectedSession(null)
        }}
        session={selectedSession}
      />

      <DownloadListModal
        isOpen={showDownloadListModal}
        onClose={() => {
          setShowDownloadListModal(false)
          setSelectedSession(null)
        }}
        onDownload={handleDownloadList}
        session={selectedSession}
      />

      <EditSessionModal
        isOpen={showEditSessionModal}
        onClose={() => {
          setShowEditSessionModal(false)
          setSelectedSession(null)
        }}
        onSave={handleEditSession}
        onDelete={handleDeleteSession}
        session={selectedSession}
      />

      <TakeAttendanceModal
        isOpen={showTakeAttendanceModal}
        onClose={() => {
          setShowTakeAttendanceModal(false)
          setSelectedSession(null)
        }}
        onSave={handleSaveAttendance}
        session={selectedSession}
      />
    </DashboardLayout>
  )
}