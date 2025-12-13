'use client'

import { useState } from 'react'
import { X, Users, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react'

interface ViewAttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  session: any
}

export default function ViewAttendanceModal({
  isOpen,
  onClose,
  session
}: ViewAttendanceModalProps) {
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'present' | 'absent'>('all')
  
  const attendanceData = [
    { id: 1, name: 'Diallo Amadou', matricule: 'ETU001', status: 'present', time: '08:05' },
    { id: 2, name: 'Ndiaye Fatou', matricule: 'ETU002', status: 'present', time: '08:00' },
    { id: 3, name: 'Sow Moussa', matricule: 'ETU003', status: 'absent', time: '-' },
    { id: 4, name: 'Fall Aïcha', matricule: 'ETU004', status: 'late', time: '08:15' },
    { id: 5, name: 'Ba Ibrahima', matricule: 'ETU005', status: 'present', time: '08:02' },
    { id: 6, name: 'Gueye Mariama', matricule: 'ETU006', status: 'present', time: '08:00' },
    { id: 7, name: 'Diop Cheikh', matricule: 'ETU007', status: 'absent', time: '-' },
    { id: 8, name: 'Kane Oumar', matricule: 'ETU008', status: 'present', time: '08:03' },
  ]

  const filteredAttendance = attendanceData.filter(student => {
    if (attendanceFilter === 'all') return true
    if (attendanceFilter === 'present') return student.status === 'present' || student.status === 'late'
    return student.status === 'absent'
  })

  const presentCount = attendanceData.filter(s => s.status === 'present' || s.status === 'late').length
  const absentCount = attendanceData.filter(s => s.status === 'absent').length
  const lateCount = attendanceData.filter(s => s.status === 'late').length

  if (!isOpen || !session) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Présences - {session.course}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {session.day} • {session.time} • {session.room}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-1">Présents</p>
                  <p className="text-2xl font-bold text-green-700">{presentCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xs text-green-600 mt-2">
                {Math.round((presentCount / attendanceData.length) * 100)}% de présence
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 mb-1">Absents</p>
                  <p className="text-2xl font-bold text-red-700">{absentCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 mb-1">Retards</p>
                  <p className="text-2xl font-bold text-yellow-700">{lateCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-blue-700">{attendanceData.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">Liste des étudiants</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setAttendanceFilter('all')}
                  className={`px-3 py-1.5 text-sm rounded-lg border ${
                    attendanceFilter === 'all'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tous ({attendanceData.length})
                </button>
                <button
                  onClick={() => setAttendanceFilter('present')}
                  className={`px-3 py-1.5 text-sm rounded-lg border ${
                    attendanceFilter === 'present'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Présents ({presentCount})
                </button>
                <button
                  onClick={() => setAttendanceFilter('absent')}
                  className={`px-3 py-1.5 text-sm rounded-lg border ${
                    attendanceFilter === 'absent'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Absents ({absentCount})
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Matricule</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nom & Prénom</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Heure d'arrivée</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAttendance.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">{student.matricule}</td>
                      <td className="py-3 px-4">{student.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : student.status === 'late'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status === 'present' && 'Présent'}
                          {student.status === 'late' && 'Retard'}
                          {student.status === 'absent' && 'Absent'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-gray-400" />
                          {student.time}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select className="text-sm border border-gray-300 rounded px-2 py-1">
                          <option value="">Sélectionner</option>
                          <option value="0">0 - Absence non justifiée</option>
                          <option value="0.5">0.5 - Retard</option>
                          <option value="1">1 - Présence</option>
                          <option value="2">2 - Participation active</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-600">
              <p>Dernière mise à jour : {new Date().toLocaleDateString()} • Auto-sauvegarde activée</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Fermer
              </button>
              <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Enregistrer les notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}