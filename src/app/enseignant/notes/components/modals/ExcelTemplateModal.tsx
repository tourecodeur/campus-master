'use client'

import { useState } from 'react'
import { X, Download, FileSpreadsheet, Copy, Users } from 'lucide-react'

interface ExcelTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onDownload: () => void
  courseName: string
  courseCode: string
  studentCount: number
}

export default function ExcelTemplateModal({
  isOpen,
  onClose,
  onDownload,
  courseName,
  courseCode,
  studentCount
}: ExcelTemplateModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [copied, setCopied] = useState(false)

  const exampleData = [
    { matricule: 'ETU001', nom: 'Diallo', prenom: 'Amadou', note: '' },
    { matricule: 'ETU002', nom: 'Ndiaye', prenom: 'Fatou', note: '' },
    { matricule: 'ETU003', nom: 'Sow', prenom: 'Moussa', note: '' },
  ]

  const handleDownload = async () => {
    setIsDownloading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    onDownload()
    onClose()
    setIsDownloading(false)
  }

  const copyInstructions = () => {
    const instructions = `Instructions pour remplir le modèle Excel :
    
1. Conservez les en-têtes de colonne : Matricule, Note
2. Les notes doivent être entre 0 et 20
3. Utilisez un point décimal pour les notes décimales (ex: 15.5)
4. Laissez vide pour les notes manquantes
5. N'ajoutez pas de colonnes supplémentaires
6. Sauvegardez en format .xlsx ou .xls`
    
    navigator.clipboard.writeText(instructions)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <FileSpreadsheet className="w-5 h-5 mr-2 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Modèle Excel pour import</h2>
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
              <div>
                <h3 className="font-medium text-gray-800">{courseName}</h3>
                <p className="text-sm text-gray-600">{courseCode} • {studentCount} étudiants</p>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-600">Format préparé pour {studentCount} étudiants</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                Ce modèle Excel contient déjà la liste de tous les étudiants du cours avec leurs matricules. Il vous suffit de remplir la colonne "Note".
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Prévisualisation du modèle</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700 border-b">Matricule</th>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700 border-b">Nom</th>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700 border-b">Prénom</th>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700 border-b">Note (0-20)</th>
                  </tr>
                </thead>
                <tbody>
                  {exampleData.map((student, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-2 px-4 border-b">{student.matricule}</td>
                      <td className="py-2 px-4 border-b">{student.nom}</td>
                      <td className="py-2 px-4 border-b">{student.prenom}</td>
                      <td className="py-2 px-4 border-b">
                        <span className="text-gray-400">À remplir</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100">
                    <td colSpan={4} className="py-2 px-4 text-center text-sm text-gray-600 italic">
                      ... {studentCount - 3} autres étudiants ...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">Instructions détaillées</h3>
              <button
                onClick={copyInstructions}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Copy className="w-4 h-4 mr-1" />
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-4">
                <li>Téléchargez le modèle Excel ci-dessous</li>
                <li>Ouvrez le fichier avec Microsoft Excel ou équivalent</li>
                <li>Remplissez la colonne "Note" avec les notes (0-20)</li>
                <li>Les notes décimales utilisent un point (ex: 15.5)</li>
                <li>Laissez vide pour les notes manquantes</li>
                <li>Ne modifiez pas les colonnes "Matricule", "Nom", "Prénom"</li>
                <li>Enregistrez le fichier (format .xlsx ou .xls)</li>
                <li>Revenez sur la plateforme pour importer le fichier</li>
              </ol>
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
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Préparation...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le modèle Excel
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}