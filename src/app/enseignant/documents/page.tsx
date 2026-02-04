'use client'
import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Edit, Trash2, Eye, Calendar } from 'lucide-react'
import AddDocumentModal from './components/modals/AddDocumentModal'
import DeleteConfirmationModal from './components/modals/DeleteConfirmationModal'
import ViewDocumentModal from './components/modals/ViewDocumentModal'
import ExportModal from './components/modals/ExportModal'
import {
  getSupportsCours,
  deleteSupportCours,
  BackendSupportCours,
  enseignantGetMyCours,
} from '@/lib/api'

export default function EnseignantDocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'cours' | 'tp' | 'td' | 'video-cours'>('cours')
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)

  const [supports, setSupports] = useState<BackendSupportCours[]>([])
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewDocumentModal, setShowViewDocumentModal] = useState(false)

  const [itemToDelete, setItemToDelete] = useState<BackendSupportCours | null>(null)
  const [documentToView, setDocumentToView] = useState<BackendSupportCours | null>(null)

  /** 🔹 Chargement des cours et des supports depuis l'API backend */
  const load = async () => {
    try {
      const cours = await enseignantGetMyCours()  // Récupère les cours de l'enseignant
      setSelectedCourseId(cours[0]?.id ?? null)  // Sélectionne le premier cours

      const allSupports = await getSupportsCours()  // Récupère tous les supports associés à l'enseignant
      setSupports(allSupports)  // Met à jour les supports dans l'état
    } catch (e) {
      console.error('Erreur lors du chargement des documents:', e)
    }
  }

  useEffect(() => {
    load()  // Charge les cours et les supports au premier rendu
  }, [])

  /** 🔹 Filtrage des documents : afficher seulement ceux associés au cours sélectionné */
  const filteredDocuments = useMemo(() => {
    return supports.filter((s) => s.cours?.id === selectedCourseId)  // Filtre par cours
  }, [supports, selectedCourseId])

  /** 🔹 Fonction pour confirmer la suppression d'un document */
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return
    await deleteSupportCours(itemToDelete.id)  // Supprime le support via l'API
    setSupports((prev) => prev.filter((s) => s.id !== itemToDelete.id))  // Met à jour l'état en supprimant le document
    setShowDeleteModal(false)  // Ferme le modal de confirmation
    setItemToDelete(null)  // Réinitialise l'élément à supprimer
  }

  return (
    <DashboardLayout role="enseignant">
      <div className="p-6 space-y-6">
        {/* Sélecteur de catégorie (cours, TP, TD, vidéo) */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {['cours', 'tp', 'td', 'video-cours'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedCategory(t as any)}
                className={`py-2 px-4 rounded-lg ${
                  selectedCategory === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center text-blue-600"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Exporter
          </button>
        </div>

        {/* Tableau des documents */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left">Titre</th>
                <th className="p-4 text-left">URL</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500">
                    Aucun document.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{doc.nomFichier}</td>
                    <td className="p-4 truncate text-blue-600">
                      <a href={doc.urlFichier} target="_blank" rel="noopener noreferrer">{doc.urlFichier}</a>
                    </td>
                    <td className="p-4 flex gap-2">
                      {/* Vue du document */}
                      <button
                        onClick={() => {
                          setDocumentToView(doc)
                          setShowViewDocumentModal(true)
                        }}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Suppression du document */}
                      <button
                        onClick={() => {
                          setItemToDelete(doc)
                          setShowDeleteModal(true)
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddDocumentModal
        isOpen={showAddDocumentModal}
        onClose={() => setShowAddDocumentModal(false)}
        onDocumentAdded={load}  // Recharge les documents après ajout
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        courseId={selectedCourseId ?? 0}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        itemType="document"
        itemName={itemToDelete?.nomFichier ?? ''}
      />

      <ViewDocumentModal
        isOpen={showViewDocumentModal}
        onClose={() => setShowViewDocumentModal(false)}
        document={documentToView}
      />
    </DashboardLayout>
  )
}
