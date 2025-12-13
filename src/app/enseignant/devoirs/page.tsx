'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { BookOpen, Plus, Edit, Trash2, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import AddAssignmentModal from './components/modals/AddAssignmentModal'
import DeleteConfirmationModal from './components/modals/DeleteConfirmationModal'
import ExportModal from './components/modals/ExportModal'
import EditAssignmentModal from './components/modals/EditAssignmentModal'
import ViewAssignmentModal from './components/modals/ViewAssignmentModal'

export default function EnseignantDevoirsPage() {
    const [selectedCourse, setSelectedCourse] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('attente')
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditAssignmentModal, setShowEditAssignmentModal] = useState(false)
  const [assignmentToEdit, setAssignmentToEdit] = useState<any>(null)
  const [assignmentToView, setAssignmentToView] = useState<any>(null)
  const [showViewAssignmentModal, setShowViewAssignmentModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'assignment' | 'resource' | 'announcement'
    id: number
    name: string
  } | null>(null)

  const [assignments, setAssignments] = useState([
  { id: 1, title: 'Devoir N°1', status: 'attente', dueDate: '2024-01-30', courseId: 1 },
  { id: 2, title: 'Devoir N°2', status: 'en retard', dueDate: '2024-01-15', courseId: 1 },
  { id: 3, title: 'Devoir N°3', status: 'rendu', dueDate: '2024-01-20', courseId: 2 },
  { id: 4, title: 'Devoir N°4', status: 'corrige', dueDate: '2024-01-10', courseId: 2 },
  { id: 5, title: 'Devoir N°5', status: 'attente', dueDate: '2024-02-05', courseId: 1 },
  { id: 6, title: 'Devoir N°6', status: 'en retard', dueDate: '2024-02-12', courseId: 2 },
  { id: 7, title: 'Devoir N°7', status: 'rendu', dueDate: '2024-02-08', courseId: 1 },
  { id: 8, title: 'Devoir N°8', status: 'corrige', dueDate: '2024-01-25', courseId: 2 },
  { id: 9, title: 'Devoir N°9', status: 'attente', dueDate: '2024-02-15', courseId: 1 },
  { id: 10, title: 'Devoir N°10', status: 'en retard', dueDate: '2024-02-18', courseId: 2 },
  { id: 11, title: 'Devoir N°11', status: 'rendu', dueDate: '2024-02-10', courseId: 1 },
  { id: 12, title: 'Devoir N°12', status: 'corrige', dueDate: '2024-02-20', courseId: 2 },
  ])

  const filteredAssignments = assignments.filter((assignment) => assignment.status === selectedCategory)

  const handleDeleteClick = (type: 'assignment' | 'resource' | 'announcement', id: number, name: string) => {
    setItemToDelete({ type, id, name })
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    if (itemToDelete && itemToDelete.type === 'assignment') {
      setAssignments(assignments.filter((assignment) => assignment.id !== itemToDelete.id))
    }
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  const handleAddAssignment = (newAssignment: any) => {
    setAssignments([...assignments, newAssignment])
    console.log('Devoir ajouté:', newAssignment)
  }

  const handleEditAssignmentClick = (assignmentId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const assignment = assignments.find((a) => a.id === assignmentId)
    if (assignment) {
      setAssignmentToEdit(assignment) // Définit l'objet à éditer
      setShowEditAssignmentModal(true) // Affiche le modal
    }
  }

  const handleAssignmentUpdated = (updatedAssignment: any) => {
    setAssignments(assignments.map((assignment) =>
      assignment.id === updatedAssignment.id ? updatedAssignment : assignment
    ))
    console.log('Devoir modifié:', updatedAssignment)
  }
  const handleViewAssignmentClick = (assignmentId: number, e: React.MouseEvent) => {
  e.stopPropagation()
  const assignment = assignments.find((a) => a.id === assignmentId)
  if (assignment) {
    setAssignmentToView(assignment)
    setShowViewAssignmentModal(true)
  }
}
  return (
    <DashboardLayout role="enseignant">
      <div className="p-6 space-y-6">
        {/* Navigation entre les catégories de devoirs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedCategory('attente')}
              className={`py-2 px-4 mx-2 rounded-lg transition ${selectedCategory === 'attente' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              En Attente
            </button>
            <button
              onClick={() => setSelectedCategory('en retard')}
              className={`py-2 px-4 mx-2 rounded-lg transition ${selectedCategory === 'en retard' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              En Retard
            </button>
            <button
              onClick={() => setSelectedCategory('rendu')}
              className={`py-2 px-4 mx-2 rounded-lg transition ${selectedCategory === 'rendu' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Rendu
            </button>
            <button
              onClick={() => setSelectedCategory('corrige')}
              className={`py-2 px-4 mx-2 rounded-lg transition ${selectedCategory === 'corrige' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Corrigé
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

        {/* Tableau des devoirs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Titre</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Date de rendu</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6">{assignment.title}</td>
                    <td className="py-4 px-6">{assignment.dueDate}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs rounded-full ${assignment.status === 'attente' ? 'bg-blue-100 text-blue-800' : assignment.status === 'en retard' ? 'bg-yellow-100 text-yellow-800' : assignment.status === 'rendu' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => handleEditAssignmentClick(assignment.id, e)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick('assignment', assignment.id, assignment.title)
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      <button
                        onClick={(e) => handleViewAssignmentClick(assignment.id, e)}
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
      <AddAssignmentModal
        isOpen={showAddAssignmentModal}
        onClose={() => setShowAddAssignmentModal(false)}
        onAssignmentAdded={handleAddAssignment}
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
        itemType="assignment"
        itemName={itemToDelete?.name || ''}
      />

      <EditAssignmentModal
        isOpen={showEditAssignmentModal}
        onClose={() => setShowEditAssignmentModal(false)}
        onAssignmentUpdated={handleAssignmentUpdated}
        assignment={assignmentToEdit}
      />
    <ViewAssignmentModal
      isOpen={showViewAssignmentModal}
      onClose={() => setShowViewAssignmentModal(false)}
      assignment={assignmentToView}
    />

    </DashboardLayout>
  )
}
