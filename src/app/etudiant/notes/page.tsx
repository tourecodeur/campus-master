'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Award, TrendingUp, TrendingDown, Download, Filter, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function NotesPage() {
  const [selectedSemester, setSelectedSemester] = useState('S1')
  
  const semesters = [
    { id: 'S1', name: 'Semestre 1', moyenne: 14.5, credits: 17 },
    { id: 'S2', name: 'Semestre 2', moyenne: 15.2, credits: 16 },
    { id: 'S3', name: 'Semestre 3', moyenne: 13.8, credits: 18 },
    { id: 'S4', name: 'Semestre 4', moyenne: 16.1, credits: 19 },
  ]
  
  const notesData = [
    { matiere: 'Mathématiques', note: 16.5, moyenneClasse: 14.2, coefficient: 3, rang: '5/45' },
    { matiere: 'Algorithmique', note: 15.0, moyenneClasse: 13.8, coefficient: 4, rang: '8/45' },
    { matiere: 'Base de données', note: 17.0, moyenneClasse: 15.1, coefficient: 3, rang: '3/45' },
    { matiere: 'Développement Web', note: 14.5, moyenneClasse: 12.9, coefficient: 4, rang: '12/45' },
    { matiere: 'Réseaux', note: 13.0, moyenneClasse: 11.5, coefficient: 3, rang: '15/45' },
    { matiere: 'Anglais', note: 18.0, moyenneClasse: 15.8, coefficient: 2, rang: '2/45' },
  ]
  
  const graphData = [
    { mois: 'Sep', moyenne: 14.2 },
    { mois: 'Oct', moyenne: 14.8 },
    { mois: 'Nov', moyenne: 15.1 },
    { mois: 'Déc', moyenne: 14.5 },
    { mois: 'Jan', moyenne: 15.3 },
    { mois: 'Fév', moyenne: 15.8 },
  ]

  const selectedSemesterData = semesters.find(s => s.id === selectedSemester)

  return (
    <DashboardLayout role="etudiant">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mes Notes</h1>
          <p className="text-gray-600 mt-1">Suivi de vos performances académiques</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Moyenne générale</p>
                <p className="text-2xl font-bold text-gray-800">14.9/20</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +0.4 vs dernier semestre
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Crédits acquis</p>
                <p className="text-2xl font-bold text-gray-800">70/120</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              58% complété
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Rang général</p>
                <p className="text-2xl font-bold text-gray-800">6ème/45</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2 places
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Évolution de la moyenne</h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                  <option>Cette année</option>
                  <option>Année dernière</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis domain={[10, 20]} />
                <Tooltip />
                <Bar dataKey="moyenne" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Par semestre</h2>
            <div className="space-y-4">
              {semesters.map((semester) => (
                <div
                  key={semester.id}
                  onClick={() => setSelectedSemester(semester.id)}
                  className={`p-4 rounded-lg cursor-pointer transition ${
                    selectedSemester === semester.id
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{semester.name}</h3>
                      <p className="text-sm text-gray-600">{semester.credits} crédits</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800">{semester.moyenne}/20</p>
                      <p className={`text-sm flex items-center ${
                        semester.moyenne >= 15 ? 'text-green-600' : 
                        semester.moyenne >= 12 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {semester.moyenne >= 15 ? (
                          <><TrendingUp className="w-4 h-4 mr-1" /> Très bien</>
                        ) : semester.moyenne >= 12 ? (
                          <><TrendingUp className="w-4 h-4 mr-1" /> Assez bien</>
                        ) : (
                          <><TrendingDown className="w-4 h-4 mr-1" /> Passable</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Détail des notes - {selectedSemesterData?.name}</h2>
              <div className="flex items-center space-x-3">
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  <Download className="w-4 h-4 mr-1" />
                  Exporter relevé
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Matière</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Note</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Moyenne classe</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Coefficient</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Rang</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Appréciation</th>
                </tr>
              </thead>
              <tbody>
                {notesData.map((note, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-medium">{note.matiere}</td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${
                        note.note >= 16 ? 'text-green-600' :
                        note.note >= 14 ? 'text-blue-600' :
                        note.note >= 12 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {note.note}/20
                      </span>
                    </td>
                    <td className="py-4 px-6">{note.moyenneClasse}</td>
                    <td className="py-4 px-6">{note.coefficient}</td>
                    <td className="py-4 px-6">{note.rang}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        note.note >= 16 ? 'bg-green-100 text-green-800' :
                        note.note >= 14 ? 'bg-blue-100 text-blue-800' :
                        note.note >= 12 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {note.note >= 16 ? 'Très bien' :
                         note.note >= 14 ? 'Bien' :
                         note.note >= 12 ? 'Assez bien' : 'Passable'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Moyenne pondérée: <span className="font-bold text-gray-800">14.9/20</span></p>
                <p className="text-sm text-gray-600">Total crédits: <span className="font-bold text-gray-800">19</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Mention: <span className="font-bold text-green-600">Bien</span></p>
                <p className="text-sm text-gray-600">Rang: <span className="font-bold text-gray-800">6ème/45</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}