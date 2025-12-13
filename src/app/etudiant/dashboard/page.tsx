'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { BookOpen, Calendar, Award, DollarSign, TrendingUp, Clock, Bell, FileText } from 'lucide-react'

export default function EtudiantDashboard() {
  const [stats, setStats] = useState({
    coursInscrits: 6,
    moyenneGenerale: 14.5,
    paiementsEnAttente: 2,
    prochainCours: 'Algorithmique - 08:00'
  })

  const recentActivities = [
    { id: 1, type: 'note', course: 'Mathématiques', note: 16.5, date: 'Aujourd\'hui' },
    { id: 2, type: 'paiement', description: 'Frais de scolarité', amount: 250000, date: 'Hier' },
    { id: 3, type: 'cours', course: 'Base de données', status: 'Terminé', date: '15 Jan' },
    { id: 4, type: 'annonce', title: 'Réunion étudiants', description: 'Salle A201', date: '14 Jan' },
  ]

  const upcomingCourses = [
    { id: 1, course: 'Algorithmique', time: '08:00 - 10:00', room: 'A201', teacher: 'Dr. Diallo' },
    { id: 2, course: 'Base de données', time: '10:30 - 12:30', room: 'B102', teacher: 'Prof. Ndiaye' },
    { id: 3, course: 'Mathématiques', time: '14:00 - 16:00', room: 'C301', teacher: 'Dr. Sow' },
  ]

  return (
    <DashboardLayout role="etudiant">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord Étudiant</h1>
          <p className="text-gray-600 mt-1">Bienvenue sur votre espace personnel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Cours inscrits</p>
                <p className="text-2xl font-bold text-gray-800">{stats.coursInscrits}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              Actif dans tous
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Moyenne générale</p>
                <p className="text-2xl font-bold text-gray-800">{stats.moyenneGenerale}/20</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +0.5 vs dernier semestre
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Paiements en attente</p>
                <p className="text-2xl font-bold text-gray-800">{stats.paiementsEnAttente}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-red-600">
              <Clock className="w-4 h-4 mr-1" />
              Délai: 15 jours
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Prochain cours</p>
                <p className="text-lg font-bold text-gray-800">{stats.prochainCours}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <Clock className="w-4 h-4 mr-1" />
              Dans 2 heures
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-600" />
              Activités récentes
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                    activity.type === 'note' ? 'bg-green-500' :
                    activity.type === 'paiement' ? 'bg-blue-500' :
                    activity.type === 'cours' ? 'bg-purple-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">
                        {activity.type === 'note' ? `Note: ${activity.course}` :
                         activity.type === 'paiement' ? activity.description :
                         activity.type === 'cours' ? activity.course : activity.title}
                      </p>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.type === 'note' ? `Note: ${activity.note}/20` :
                       activity.type === 'paiement' ? `${activity.amount.toLocaleString()} FCFA` :
                       activity.type === 'cours' ? `Statut: ${activity.status}` : activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Cours à venir
            </h2>
            <div className="space-y-4">
              {upcomingCourses.map((course) => (
                <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{course.course}</h3>
                    <span className="text-sm font-medium text-blue-600">{course.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-4">👨‍🏫 {course.teacher}</span>
                    <span>📍 {course.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Mes notes récentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Matière</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Note</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Moyenne classe</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Rang</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6">Mathématiques</td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-green-600">16.5/20</span>
                  </td>
                  <td className="py-4 px-6">14.2</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">5ème</span>
                  </td>
                  <td className="py-4 px-6">15/01/2024</td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6">Algorithmique</td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-blue-600">15.0/20</span>
                  </td>
                  <td className="py-4 px-6">13.8</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">8ème</span>
                  </td>
                  <td className="py-4 px-6">12/01/2024</td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6">Base de données</td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-purple-600">17.0/20</span>
                  </td>
                  <td className="py-4 px-6">15.1</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">3ème</span>
                  </td>
                  <td className="py-4 px-6">10/01/2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}