'use client'

import { useState, useEffect } from 'react'
import { X, Edit, FileText, Upload, Download } from 'lucide-react'

interface EditResourceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (updatedResource: any) => void
  resource: any
  courseName: string
}

export default function EditResourceModal({
  isOpen,
  onClose,
  onSave,
  resource,
  courseName
}: EditResourceModalProps) {
  const [formData, setFormData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newFile, setNewFile] = useState<File | null>(null)

  useEffect(() => {
    if (resource) {
      setFormData({ ...resource })
    } else {
      setFormData(null)
    }
  }, [resource])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0])
      // Mettre à jour le nom de la ressource avec le nom du fichier
      setFormData({ ...formData, name: e.target.files[0].name })
    }
  }

  const handleSave = async () => {
    if (!formData || !resource) return
    
    setIsSaving(true)
    
    const updatedResource = {
      ...resource,
      ...formData,
      ...(newFile && { file: newFile })
    }
    
    await new Promise(resolve => setTimeout(resolve, 600))
    onSave(updatedResource)
    onClose()
    setIsSaving(false)
  }

  if (!isOpen || !resource || !formData) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Edit className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Modifier la ressource</h2>
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
              <FileText className="w-4 h-4 text-gray-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-800">Ressource pour {courseName}</h3>
                <p className="text-sm text-gray-600">Fichier actuel : {resource.name}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la ressource *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Support de cours Chapitre 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de fichier
              </label>
              <select
                value={formData.type || 'PDF'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PDF">PDF</option>
                <option value="Document">Document Word</option>
                <option value="PPT">Présentation</option>
                <option value="Video">Vidéo</option>
                <option value="Lien">Lien externe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléverser un nouveau fichier (optionnel)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload-edit"
                />
                <label htmlFor="file-upload-edit" className="cursor-pointer">
                  {newFile ? (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-green-500 mb-2" />
                      <p className="text-sm text-gray-800 font-medium">{newFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(newFile.size / 1024).toFixed(2)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Cliquez pour remplacer le fichier</p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, PPT, MP4 (Max 50MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Le fichier actuel compte {resource.downloads || 0} téléchargements
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optionnel)
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Description de la ressource..."
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <p>Format : {resource.type}</p>
                <p>Taille : {resource.size}</p>
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
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}