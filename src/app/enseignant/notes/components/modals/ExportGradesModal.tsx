'use client'

import { useState } from 'react'
import { X, Download, FileSpreadsheet, FileText } from 'lucide-react'

interface ExportGradesModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: 'excel' | 'pdf' | 'csv') => void
  courseName: string
  studentCount: number
}

export default function ExportGradesModal({
  isOpen,
  onClose,
  onExport,
  courseName,
  studentCount
}: ExportGradesModalProps) {
  const [format, setFormat] = useState<'excel' | 'pdf' | 'csv'>('excel')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    onExport(format)
    onClose()
    setIsExporting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Download className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Exporter les notes</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">Cours : {courseName}</h3>
              <span className="text-sm text-gray-600">{studentCount} étudiants</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Notes saisies :</span>
                  <span className="font-medium">6/8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Moyenne :</span>
                  <span className="font-medium">14.3/20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut :</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Partiellement validé
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Format d'export</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFormat('excel')}
                className={`p-4 border rounded-lg text-center transition ${
                  format === 'excel'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FileSpreadsheet className={`w-8 h-8 mx-auto mb-2 ${
                  format === 'excel' ? 'text-green-600' : 'text-gray-500'
                }`} />
                <span className={`font-medium ${
                  format === 'excel' ? 'text-green-700' : 'text-gray-700'
                }`}>
                  Excel
                </span>
              </button>

              <button
                onClick={() => setFormat('pdf')}
                className={`p-4 border rounded-lg text-center transition ${
                  format === 'pdf'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FileText className={`w-8 h-8 mx-auto mb-2 ${
                  format === 'pdf' ? 'text-red-600' : 'text-gray-500'
                }`} />
                <span className={`font-medium ${
                  format === 'pdf' ? 'text-red-700' : 'text-gray-700'
                }`}>
                  PDF
                </span>
              </button>

              <button
                onClick={() => setFormat('csv')}
                className={`p-4 border rounded-lg text-center transition ${
                  format === 'csv'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FileText className={`w-8 h-8 mx-auto mb-2 ${
                  format === 'csv' ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <span className={`font-medium ${
                  format === 'csv' ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  CSV
                </span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Options supplémentaires</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-700">Inclure les informations étudiantes</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-700">Inclure les statistiques</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-700">Inclure les notes manquantes</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Export...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter en {format.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}