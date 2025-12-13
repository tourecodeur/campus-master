'use client'

import { useState } from 'react'
import { X, Download, FileText, Users, Calendar } from 'lucide-react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: number
  courseName: string
}

export default function ExportModal({
  isOpen,
  onClose,
  courseId,
  courseName
}: ExportModalProps) {
  const [exportType, setExportType] = useState<'students' | 'grades' | 'attendance' | 'resources'>('students')
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('csv')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    
    // Simulation d'export
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Exporting:', { exportType, format, courseId })
    
    // Simulation de téléchargement
    const blob = new Blob(['Exported data'], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${courseName}_${exportType}_${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    setIsExporting(false)
    onClose()
  }

  if (!isOpen) return null

  const exportOptions = [
    {
      id: 'students',
      label: 'Liste des étudiants',
      description: 'Noms, emails, groupes',
      icon: Users
    },
    {
      id: 'grades',
      label: 'Notes et évaluations',
      description: 'Notes, moyennes, statistiques',
      icon: FileText
    },
    {
      id: 'attendance',
      label: 'Présences',
      description: 'Feuille de présence par date',
      icon: Calendar
    },
    {
      id: 'resources',
      label: 'Ressources pédagogiques',
      description: 'Liste des fichiers partagés',
      icon: Download
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Download className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Exporter les données</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Type d'export</h3>
            <div className="grid grid-cols-2 gap-3">
              {exportOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => setExportType(option.id as any)}
                    className={`p-3 border rounded-lg text-left transition ${
                      exportType === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <Icon className={`w-4 h-4 mr-2 ${
                        exportType === option.id ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                      <span className={`font-medium text-sm ${
                        exportType === option.id ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Format d'export</h3>
            <div className="flex space-x-3">
              {(['csv', 'excel', 'pdf'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`px-4 py-2 border rounded-lg uppercase text-sm font-medium ${
                    format === fmt
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Cours sélectionné :</span>
              <span className="font-medium">{courseName}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}