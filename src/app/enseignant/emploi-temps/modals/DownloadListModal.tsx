'use client'

import { useState } from 'react'
import { X, Download, FileSpreadsheet, FileText, Users, Calendar } from 'lucide-react'

interface DownloadListModalProps {
  isOpen: boolean
  onClose: () => void
  onDownload: (format: 'excel' | 'pdf' | 'csv', listType: 'attendance' | 'students' | 'grades') => void
  session: any
}

export default function DownloadListModal({
  isOpen,
  onClose,
  onDownload,
  session
}: DownloadListModalProps) {
  const [format, setFormat] = useState<'excel' | 'pdf' | 'csv'>('excel')
  const [listType, setListType] = useState<'attendance' | 'students' | 'grades'>('attendance')
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    onDownload(format, listType)
    onClose()
    setIsDownloading(false)
  }

  if (!isOpen || !session) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Download className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Télécharger liste</h2>
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
            <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-800">{session.course}</h3>
                <p className="text-sm text-gray-600">
                  {session.day} • {session.time} • {session.room}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Type de liste</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'attendance', label: 'Présences', icon: Users },
                { id: 'students', label: 'Étudiants', icon: Users },
                { id: 'grades', label: 'Notes', icon: FileText }
              ].map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setListType(type.id as any)}
                    className={`p-3 border rounded-lg text-center transition ${
                      listType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${
                      listType === type.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      listType === type.id ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {type.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Format</h3>
            <div className="flex space-x-3">
              {[
                { id: 'excel', label: 'Excel', icon: FileSpreadsheet },
                { id: 'pdf', label: 'PDF', icon: FileText },
                { id: 'csv', label: 'CSV', icon: FileText }
              ].map((fmt) => {
                const Icon = fmt.icon
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setFormat(fmt.id as any)}
                    className={`flex-1 p-3 border rounded-lg text-center transition ${
                      format === fmt.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${
                      format === fmt.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      format === fmt.id ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {fmt.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Options</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Inclure les en-têtes</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Inclure la date du cours</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-700">Inclure les statistiques</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isDownloading}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Téléchargement...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}