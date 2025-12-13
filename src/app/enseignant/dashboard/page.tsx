'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { BookOpen, Users, Clock, Award, TrendingUp, Calendar, Bell, FileText } from 'lucide-react'

export default function EnseignantDashboard() {
  const [stats, setStats] = useState({
    coursEnseignes: 4,
    totalEtudiants: 85,
    heuresEnseignement: 16,
    moyenneGenerale: 14.2
  })

  const recentActivities = [
    { id: 1, type: 'note', course: 'Algorithmique', action: 'Notes publiées', date: 'Aujourd\'hui' },
    { id: 2, type: 'devoir', course: 'Base de données', action: 'Devoir assigné', date: 'Hier' },
    { id: 3, type: 'cours', course: 'Mathématiques', action: 'Cours ajouté', date: '15 Jan' },
    { id: 4, type: 'reunion', title: 'Réunion département', description: 'Salle des professeurs', date: '14 Jan' },
  ]

  const upcomingCourses = [
    { id: 1, course: 'Algorithmique', time: '08:00 - 10:00', room: 'A201', students: 45 },
    { id: 2, course: 'Base de données', time: '10:30 - 12:30', room: 'B102', students: 40 },
    { id: 3, course: 'Mathématiques', time: '14:00 - 16:00', room: 'C301', students: 48 },
  ]

  return (
    <DashboardLayout role="enseignant">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord Enseignant</h1>
          <p className="text-gray-600 mt-1">Bienvenue sur votre espace d'enseignement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Cours enseignés</p>
                <p className="text-2xl font-bold text-gray-800">{stats.coursEnseignes}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +1 ce semestre
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Étudiants</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalEtudiants}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12 cette année
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Heures/semaine</p>
                <p className="text-2xl font-bold text-gray-800">{stats.heuresEnseignement}h</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <Clock className="w-4 h-4 mr-1" />
              Charge normale
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Moyenne générale</p>
                <p className="text-2xl font-bold text-gray-800">{stats.moyenneGenerale}/20</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +0.3 vs dernier semestre
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
                    activity.type === 'devoir' ? 'bg-blue-500' :
                    activity.type === 'cours' ? 'bg-purple-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">
                        {activity.type === 'note' ? `Notes publiées - ${activity.course}` :
                         activity.type === 'devoir' ? `Devoir assigné - ${activity.course}` :
                         activity.type === 'cours' ? `Cours ajouté - ${activity.course}` : activity.title}
                      </p>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.type === 'reunion' ? activity.description : activity.action}
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
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>📍 {course.room}</span>
                    <span>👥 {course.students} étudiants</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Devoirs à corriger</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Cours</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Devoir</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Date limite</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Soumissions</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">À corriger</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6">Algorithmique</td>
                  <td className="py-4 px-6">Devoir N°1 - Structures</td>
                  <td className="py-4 px-6">20/01/2024</td>
                  <td className="py-4 px-6">42/45</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">12</span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Corriger
                    </button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6">Base de données</td>
                  <td className="py-4 px-6">Projet SQL</td>
                  <td className="py-4 px-6">15/01/2024</td>
                  <td className="py-4 px-6">38/40</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">5</span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Corriger
                    </button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6">Mathématiques</td>
                  <td className="py-4 px-6">Exercices Algèbre</td>
                  <td className="py-4 px-6">18/01/2024</td>
                  <td className="py-4 px-6">45/48</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">3</span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Corriger
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}