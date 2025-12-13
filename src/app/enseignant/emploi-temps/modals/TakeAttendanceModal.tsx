'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, XCircle, Clock, Users, QrCode, Smartphone } from 'lucide-react'

interface TakeAttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (attendance: any) => void
  session: any
}

export default function TakeAttendanceModal({
  isOpen,
  onClose,
  onSave,
  session
}: TakeAttendanceModalProps) {
  const [attendanceMode, setAttendanceMode] = useState<'manual' | 'qr' | 'code'>('manual')
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [attendanceCode, setAttendanceCode] = useState(generateCode())
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveTimer, setAutoSaveTimer] = useState(60)

  // Générer des données d'étudiants factices
  useEffect(() => {
    if (session) {
      const students = Array.from({ length: session.students || 40 }, (_, i) => ({
        id: i + 1,
        matricule: `ETU${String(i + 1).padStart(3, '0')}`,
        name: `Étudiant ${i + 1}`,
        status: 'pending',
        time: null
      }))
      setAttendanceData(students)
    }
  }, [session])

  // Timer pour l'auto-sauvegarde
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isOpen && autoSaveTimer > 0) {
      interval = setInterval(() => {
        setAutoSaveTimer(prev => {
          if (prev <= 1) {
            handleAutoSave()
            return 60
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isOpen, autoSaveTimer])

  function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleAutoSave = () => {
    console.log('Auto-sauvegarde des présences')
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const attendanceSummary = {
      session,
      attendanceData,
      presentCount: attendanceData.filter(s => s.status === 'present').length,
      absentCount: attendanceData.filter(s => s.status === 'absent').length,
      timestamp: new Date().toISOString()
    }
    
    onSave(attendanceSummary)
    onClose()
    setIsSaving(false)
  }

  const handleMarkAll = (status: 'present' | 'absent') => {
    setAttendanceData(prev => prev.map(student => ({
      ...student,
      status,
      time: status === 'present' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
    })))
  }

  const handleMarkStudent = (studentId: number, status: 'present' | 'absent') => {
    setAttendanceData(prev => prev.map(student => 
      student.id === studentId ? {
        ...student,
        status,
        time: status === 'present' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
      } : student
    ))
  }

  if (!isOpen || !session) return null

  const presentCount = attendanceData.filter(s => s.status === 'present').length
  const absentCount = attendanceData.filter(s => s.status === 'absent').length
  const pendingCount = attendanceData.filter(s => s.status === 'pending').length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Prise de présences</h2>
            <p className="text-gray-600 text-sm mt-1">
              {session.course} • {session.time} • {session.room}
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
          {/* Mode de prise de présence */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Mode de prise de présence</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'manual', label: 'Manuelle', icon: Users, description: 'Marquer manuellement' },
                { id: 'qr', label: 'QR Code', icon: QrCode, description: 'Scan par étudiants' },
                { id: 'code', label: 'Code', icon: Smartphone, description: 'Code à saisir' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setAttendanceMode(mode.id as any)}
                  className={`p-4 border rounded-lg text-center transition ${
                    attendanceMode === mode.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <mode.icon className={`w-6 h-6 mx-auto mb-2 ${
                    attendanceMode === mode.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className={`font-medium ${
                    attendanceMode === mode.id ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {mode.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{mode.description}</p>
                </button>
              ))}
            </div>

            {/* Code d'appel pour le mode code */}
            {attendanceMode === 'code' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 mb-1">Code d'appel actuel</p>
                    <p className="text-2xl font-bold text-blue-700 font-mono">{attendanceCode}</p>
                  </div>
                  <button
                    onClick={() => setAttendanceCode(generateCode())}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Régénérer
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Les étudiants doivent saisir ce code dans leur application mobile
                </p>
              </div>
            )}

            {/* QR Code pour le mode QR */}
            {attendanceMode === 'qr' && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg text-center">
                <QrCode className="w-32 h-32 mx-auto text-green-600" />
                <p className="text-sm text-green-600 mt-2">
                  Scannez avec l'application mobile
                </p>
                <p className="text-xs text-green-600">
                  Valide jusqu'à {new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-blue-700">{attendanceData.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-1">Présents</p>
                  <p className="text-2xl font-bold text-green-700">{presentCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
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
                  <p className="text-sm text-yellow-600 mb-1">En attente</p>
                  <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex space-x-3 mb-6">
            <button
              onClick={() => handleMarkAll('present')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Marquer tous présents
            </button>
            <button
              onClick={() => handleMarkAll('absent')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Marquer tous absents
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Réinitialiser
            </button>
          </div>

          {/* Liste des étudiants */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Liste des étudiants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {attendanceData.map((student) => (
                <div
                  key={student.id}
                  className={`p-3 border rounded-lg flex items-center justify-between ${
                    student.status === 'present' ? 'border-green-200 bg-green-50' :
                    student.status === 'absent' ? 'border-red-200 bg-red-50' :
                    'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.matricule}</p>
                    {student.time && (
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {student.time}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleMarkStudent(student.id, 'present')}
                      className={`p-1.5 rounded ${student.status === 'present' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}
                      title="Présent"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMarkStudent(student.id, 'absent')}
                      className={`p-1.5 rounded ${student.status === 'absent' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
                      title="Absent"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timer d'auto-sauvegarde et actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-600">
              <p>Auto-sauvegarde dans : <span className="font-medium">{autoSaveTimer}s</span></p>
              <p className="text-xs text-gray-500">Dernière modification : {new Date().toLocaleTimeString()}</p>
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
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les présences'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}