'use client'

import { useState } from 'react'
import { X, Calendar, Download, FileSpreadsheet, FileText, Smartphone } from 'lucide-react'

interface ExportCalendarModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: 'ical' | 'pdf' | 'excel' | 'print') => void
}

export default function ExportCalendarModal({
  isOpen,
  onClose,
  onExport
}: ExportCalendarModalProps) {
  const [format, setFormat] = useState<'ical' | 'pdf' | 'excel' | 'print'>('pdf')
  const [period, setPeriod] = useState<'week' | 'month' | 'semester'>('week')
  const [includeEvents, setIncludeEvents] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    onExport(format)
    onClose()
    setIsExporting(false)
  }

  if (!isOpen) return null

  const formats = [
    {
      id: 'pdf',
      label: 'PDF',
      description: 'Pour impression ou partage',
      icon: FileText,
      color: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      id: 'excel',
      label: 'Excel',
      description: 'Format tabulaire modifiable',
      icon: FileSpreadsheet,
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      id: 'ical',
      label: 'iCal',
      description: 'Import dans calendrier digital',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'print',
      label: 'Impression',
      description: 'Format optimisé pour impression',
      icon: Smartphone,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Exporter calendrier</h2>
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
            <h3 className="font-medium text-gray-800 mb-3">Période à exporter</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'week', label: 'Semaine' },
                { id: 'month', label: 'Mois' },
                { id: 'semester', label: 'Semestre' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id as any)}
                  className={`px-3 py-2 text-center rounded-lg border text-sm font-medium transition ${
                    period === p.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Format d'export</h3>
            <div className="space-y-3">
              {formats.map((formatItem) => {
                const Icon = formatItem.icon
                return (
                  <button
                    key={formatItem.id}
                    onClick={() => setFormat(formatItem.id as any)}
                    className={`w-full p-4 border rounded-lg text-left transition ${
                      format === formatItem.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${formatItem.color.split(' ')[0]} mr-3`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`font-medium ${format === formatItem.id ? 'text-blue-700' : 'text-gray-700'}`}>
                          {formatItem.label}
                        </h4>
                        <p className="text-sm text-gray-600">{formatItem.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Options</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeEvents}
                  onChange={(e) => setIncludeEvents(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Inclure les événements (réunions, séminaires)
                </span>
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
                  Exporter calendrier
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}