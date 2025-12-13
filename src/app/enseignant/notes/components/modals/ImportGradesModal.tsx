'use client'

import { useState } from 'react'
import { X, Upload, FileSpreadsheet, AlertTriangle, CheckCircle } from 'lucide-react'

interface ImportGradesModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (file: File) => void
  courseName: string
}

export default function ImportGradesModal({
  isOpen,
  onClose,
  onImport,
  courseName
}: ImportGradesModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('merge')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      
      // Vérifier l'extension
      const validExtensions = ['.xlsx', '.xls', '.csv']
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
      
      if (!validExtensions.includes(fileExtension)) {
        alert('Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV')
        return
      }
      
      setFile(selectedFile)
    }
  }

  const handleImport = async () => {
    if (!file) {
      alert('Veuillez sélectionner un fichier')
      return
    }

    setIsUploading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    onImport(file)
    onClose()
    setFile(null)
    setIsUploading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Importer des notes</h2>
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
              <div className="flex items-center text-sm text-gray-600">
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                Format supporté : .xlsx, .xls, .csv
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="font-medium text-gray-800">Cliquez pour sélectionner un fichier</p>
                    <p className="text-sm text-gray-600 mt-1">
                      ou glissez-déposez votre fichier ici
                    </p>
                  </div>
                )}
              </label>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => document.getElementById('file-upload')?.click()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {file ? 'Changer de fichier' : 'Parcourir...'}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Options d'importation</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setImportMode('merge')}
                className={`p-4 border rounded-lg text-left transition ${
                  importMode === 'merge'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className={`w-4 h-4 border rounded-full mr-2 flex items-center justify-center ${
                    importMode === 'merge'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {importMode === 'merge' && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">Fusionner</span>
                </div>
                <p className="text-sm text-gray-600">
                  Ajoute les nouvelles notes sans écraser les existantes
                </p>
              </button>

              <button
                onClick={() => setImportMode('replace')}
                className={`p-4 border rounded-lg text-left transition ${
                  importMode === 'replace'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className={`w-4 h-4 border rounded-full mr-2 flex items-center justify-center ${
                    importMode === 'replace'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {importMode === 'replace' && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">Remplacer</span>
                </div>
                <p className="text-sm text-gray-600">
                  Remplace toutes les notes par celles du fichier
                </p>
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Format requis</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Colonne A : Matricule de l'étudiant</li>
                  <li>• Colonne B : Note (entre 0 et 20)</li>
                  <li>• La première ligne doit contenir les en-têtes</li>
                  <li>• Les matricules doivent correspondre à ceux du système</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleImport}
              disabled={isUploading || !file}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Importation...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Importer les notes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}