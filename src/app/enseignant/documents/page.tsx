'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { BookOpen, Plus, Edit, Trash2, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import AddDocumentModal from './components/modals/AddDocumentModal'
import DeleteConfirmationModal from './components/modals/DeleteConfirmationModal'
import EditDocumentModal from './components/modals/EditDocumentModal'
import ViewDocumentModal from './components/modals/ViewDocumentModal'
import ExportModal from './components/modals/ExportModal'

export default function EnseignantDocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('cours')
  const [selectedCourse, setSelectedCourse] = useState(1)
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditDocumentModal, setShowEditDocumentModal] = useState(false)
  const [showViewDocumentModal, setShowViewDocumentModal] = useState(false)
  const [documentToEdit, setDocumentToEdit] = useState<any>(null)
  const [documentToView, setDocumentToView] = useState<any>(null)
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'document' | 'resource'
    id: number
    name: string
  } | null>(null)

  const [documents, setDocuments] = useState([
    { id: 1, title: 'Cours sur React', type: 'cours', status: 'actif', dueDate: '2024-02-15' },
    { id: 2, title: 'TP - Algorithmique', type: 'tp', status: 'actif', dueDate: '2024-02-20' },
    { id: 3, title: 'TD - Mathématiques', type: 'td', status: 'actif', dueDate: '2024-02-25' },
    { id: 4, title: 'Vidéo Cours - Node.js', type: 'video-cours', status: 'actif', dueDate: '2024-03-01' },
  ])

  const filteredDocuments = documents.filter((document) => document.type === selectedCategory)

  const handleDeleteClick = (type: 'document' | 'resource', id: number, name: string) => {
    setItemToDelete({ type, id, name })
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    if (itemToDelete && itemToDelete.type === 'document') {
      setDocuments(documents.filter((document) => document.id !== itemToDelete.id))
    }
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  const handleAddDocument = (newDocument: any) => {
    setDocuments([...documents, newDocument])
    console.log('Document ajouté:', newDocument)
  }

  const handleEditDocumentClick = (documentId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const document = documents.find((d) => d.id === documentId)
    if (document) {
      setDocumentToEdit(document) // Définit l'objet à éditer
      setShowEditDocumentModal(true) // Affiche le modal
    }
  }

  const handleDocumentUpdated = (updatedDocument: any) => {
    setDocuments(documents.map((document) =>
      document.id === updatedDocument.id ? updatedDocument : document
    ))
    console.log('Document modifié:', updatedDocument)
  }

  const handleViewDocumentClick = (documentId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const document = documents.find((d) => d.id === documentId)
    if (document) {
      setDocumentToView(document)
      setShowViewDocumentModal(true)
    }
  }

  return (
    <DashboardLayout role="enseignant">
      <div className="p-6 space-y-6">
        {/* Navigation entre les catégories de documents */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedCategory('cours')}
              className={`py-2 px-4 mx-2 rounded-lg transition ${selectedCategory === 'cours' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Cours
            </button>
            <button
              onClick={() => setSelectedCategory('tp')}
              className={`py-2 px-4 mx-2 rounded-lg transition ${selectedCategory === 'tp' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              TP
            </button>
            <button
              onClick={() => setSelectedCategory('td')}
              className={`py-2 px-4 mx-2 rounded-lg transition ${selectedCategory === 'td' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              TD
            </button>
            <button
              onClick={() => setSelectedCategory('video-cours')}
              className={`py-2 px-4 mx-2 rounded-lg transition ${selectedCategory === 'video-cours' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Vidéo Cours
            </button>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Exporter calendrier
          </button>
        </div>

        {/* Tableau des documents */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Titre</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Date de publication</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6">{document.title}</td>
                    <td className="py-4 px-6">{document.dueDate}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs rounded-full ${document.status === 'actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {document.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => handleEditDocumentClick(document.id, e)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick('document', document.id, document.title)
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleViewDocumentClick(document.id, e)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddDocumentModal
        isOpen={showAddDocumentModal}
        onClose={() => setShowAddDocumentModal(false)}
        onDocumentAdded={handleAddDocument}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        courseId={selectedCourse}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        itemType="document"
        itemName={itemToDelete?.name || ''}
      />
      <EditDocumentModal
        isOpen={showEditDocumentModal}
        onClose={() => setShowEditDocumentModal(false)}
        onDocumentUpdated={handleDocumentUpdated}
        document={documentToEdit}
      />
      <ViewDocumentModal
        isOpen={showViewDocumentModal}
        onClose={() => setShowViewDocumentModal(false)}
        document={documentToView}
      />
    </DashboardLayout>
  )
}
