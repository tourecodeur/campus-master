'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { BookOpen, Users, Clock, Calendar, Plus, Edit, Trash2, Upload, Download } from 'lucide-react'
import AddResourceModal from './components/modals/AddResourceModal'
import DeleteConfirmationModal from './components/modals/DeleteConfirmationModal'
import NewAnnouncementModal from './components/modals/NewAnnouncementModal'
import ExportModal from './components/modals/ExportModal'
import NewCourseModal from './components/modals/NewCourseModal'
import EditCourseModal from './components/modals/EditCourseModal'
import EditResourceModal from './components/modals/EditResourceModal' // Nouveau import

export default function EnseignantCoursPage() {
  const [selectedCourse, setSelectedCourse] = useState(1)
  const [showAddResourceModal, setShowAddResourceModal] = useState(false)
  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showNewCourseModal, setShowNewCourseModal] = useState(false)
  const [showEditCourseModal, setShowEditCourseModal] = useState(false)
  const [showEditResourceModal, setShowEditResourceModal] = useState(false) // Nouvel état
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'course' | 'resource' | 'announcement'
    id: number
    name: string
  } | null>(null)
  
  const [courseToEdit, setCourseToEdit] = useState<any>(null)
  const [resourceToEdit, setResourceToEdit] = useState<any>(null) // Nouvel état
  const [courses, setCourses] = useState([
    { id: 1, code: 'ALG101', title: 'Algorithmique', niveau: 'L1', students: 45, hours: 48, credits: 4 },
    { id: 2, code: 'BD202', title: 'Base de Données', niveau: 'L2', students: 40, hours: 42, credits: 3 },
    { id: 3, code: 'MATH101', title: 'Mathématiques', niveau: 'L1', students: 48, hours: 60, credits: 4 },
    { id: 4, code: 'WEB303', title: 'Développement Web', niveau: 'L3', students: 35, hours: 36, credits: 3 },
  ])

  // Ajouter un état pour les ressources (initialement avec les données statiques)
  const [courseDetails, setCourseDetails] = useState({
    1: {
      description: 'Introduction aux algorithmes et structures de données fondamentales.',
      schedule: 'Lundi 08:00-10:00, Jeudi 08:00-10:00',
      room: 'A201',
      resources: [
        { id: 1, name: 'Syllabus du cours', type: 'PDF', size: '1.2 MB', downloads: 45 },
        { id: 2, name: 'TP N°1 - Tableaux', type: 'Document', size: '0.8 MB', downloads: 42 },
        { id: 3, name: 'Support chapitre 1', type: 'PPT', size: '3.5 MB', downloads: 48 },
      ],
      announcements: [
        { id: 1, title: 'Devoir N°1 publié', date: '15/01/2024', content: 'Le devoir N°1 est disponible sur la plateforme.' },
        { id: 2, title: 'Annulation cours', date: '10/01/2024', content: 'Le cours du 12 janvier est annulé.' },
      ]
    },
    2: {
      description: 'Concepts fondamentaux des bases de données relationnelles.',
      schedule: 'Mardi 10:30-12:30, Vendredi 08:00-10:00',
      room: 'B102',
      resources: [],
      announcements: []
    }
  })

  const selectedCourseData = courseDetails[selectedCourse as keyof typeof courseDetails] || courseDetails[1]
  const currentCourse = courses.find(c => c.id === selectedCourse)

  // Fonction pour éditer une ressource
  const handleEditResourceClick = (resourceId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const resource = selectedCourseData.resources.find((r: any) => r.id === resourceId)
    if (resource) {
      setResourceToEdit(resource)
      setShowEditResourceModal(true)
    }
  }

  // Fonction pour sauvegarder une ressource modifiée
  const handleResourceUpdated = (updatedResource: any) => {
    const updatedCourseDetails = { ...courseDetails }
    const courseKey = selectedCourse as keyof typeof courseDetails
    
    const updatedResources = updatedCourseDetails[courseKey].resources.map((resource: any) =>
      resource.id === updatedResource.id ? updatedResource : resource
    )
    
    setCourseDetails({
      ...courseDetails,
      [courseKey]: {
        ...updatedCourseDetails[courseKey],
        resources: updatedResources
      }
    })
    
    console.log('Resource updated successfully:', updatedResource)
  }

  // Fonction pour éditer un cours
  const handleEditCourseClick = (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const course = courses.find(c => c.id === courseId)
    if (course) {
      setCourseToEdit(course)
      setShowEditCourseModal(true)
    }
  }

  const handleCourseUpdated = (updatedCourse: any) => {
    setCourses(courses.map(c => 
      c.id === updatedCourse.id ? updatedCourse : c
    ))
    
    if (selectedCourse === updatedCourse.id) {
      setSelectedCourse(updatedCourse.id)
    }
    
    console.log('Course updated successfully:', updatedCourse)
  }

  const handleDeleteClick = (type: 'course' | 'resource' | 'announcement', id: number, name: string) => {
    setItemToDelete({ type, id, name })
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'resource') {
        // Supprimer la ressource
        const updatedCourseDetails = { ...courseDetails }
        const courseKey = selectedCourse as keyof typeof courseDetails
        
        const updatedResources = updatedCourseDetails[courseKey].resources.filter(
          (resource: any) => resource.id !== itemToDelete.id
        )
        
        setCourseDetails({
          ...courseDetails,
          [courseKey]: {
            ...updatedCourseDetails[courseKey],
            resources: updatedResources
          }
        })
      } else if (itemToDelete.type === 'course') {
        // Supprimer le cours
        setCourses(courses.filter(course => course.id !== itemToDelete.id))
        
        // Si le cours supprimé était sélectionné, sélectionner le premier cours disponible
        if (selectedCourse === itemToDelete.id && courses.length > 0) {
          setSelectedCourse(courses[0].id)
        }
      }
      console.log(`Deleting ${itemToDelete.type} with id ${itemToDelete.id}`)
    }
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  const handleResourceAdded = () => {
    console.log('Resource added, refresh data here')
    // Pour l'instant, nous rafraîchissons juste les données
  }

  const handleAnnouncementCreated = () => {
    console.log('Announcement created, refresh data here')
    // Pour l'instant, nous rafraîchissons juste les données
  }

  const handleCourseCreated = (newCourse: any) => {
    setCourses([...courses, newCourse])
    setSelectedCourse(newCourse.id)
    console.log('New course created:', newCourse)
  }

  return (
    <DashboardLayout role="enseignant">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mes Cours</h1>
            <p className="text-gray-600 mt-1">Gestion de vos cours et ressources pédagogiques</p>
          </div>
          <button 
            onClick={() => setShowNewCourseModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau cours
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Liste des cours</h2>
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`p-4 rounded-lg cursor-pointer transition ${
                      selectedCourse === course.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.code} • {course.niveau}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => handleEditCourseClick(course.id, e)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Modifier le cours"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick('course', course.id, course.title)
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="text-center">
                        <Users className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                        <span className="text-sm font-medium">{course.students}</span>
                      </div>
                      <div className="text-center">
                        <Clock className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                        <span className="text-sm font-medium">{course.hours}h</span>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium">{course.credits} crédits</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Statistiques globales</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total étudiants</span>
                  <span className="font-semibold">168</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Heures d'enseignement</span>
                  <span className="font-semibold">186h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ressources partagées</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Moyenne satisfaction</span>
                  <span className="font-semibold text-green-600">4.5/5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentCourse?.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {currentCourse?.code} • {currentCourse?.niveau}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setShowAddResourceModal(true)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Ajouter ressource
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Exporter liste
                  </button>
                </div>
              </div>

              {/* ... (rest of the existing UI code) ... */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                      Ressources pédagogiques
                    </h3>
                    <span className="text-sm text-gray-600">
                      {selectedCourseData.resources.length} fichiers
                    </span>
                  </div>
                  <div className="space-y-3">
                    {selectedCourseData.resources.length > 0 ? (
                      selectedCourseData.resources.map((resource: any) => (
                        <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-3 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{resource.name}</p>
                              <p className="text-xs text-gray-500">
                                {resource.type} • {resource.size} • {resource.downloads} téléchargements
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={(e) => handleEditResourceClick(resource.id, e)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Modifier la ressource"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick('resource', resource.id, resource.name)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Aucune ressource disponible</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Annonces</h3>
                    <button 
                      onClick={() => setShowNewAnnouncementModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Nouvelle annonce
                    </button>
                  </div>
                  <div className="space-y-3">
                    {selectedCourseData.announcements.length > 0 ? (
                      selectedCourseData.announcements.map((announcement: any) => (
                        <div key={announcement.id} className="p-3 bg-yellow-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{announcement.title}</h4>
                            <span className="text-xs text-gray-500">{announcement.date}</span>
                          </div>
                          <p className="text-sm text-gray-600">{announcement.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Aucune annonce récente</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddResourceModal
        isOpen={showAddResourceModal}
        onClose={() => setShowAddResourceModal(false)}
        courseId={selectedCourse}
        onResourceAdded={handleResourceAdded}
      />

      <NewAnnouncementModal
        isOpen={showNewAnnouncementModal}
        onClose={() => setShowNewAnnouncementModal(false)}
        courseId={selectedCourse}
        onAnnouncementCreated={handleAnnouncementCreated}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        courseId={selectedCourse}
        courseName={currentCourse?.title || ''}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setItemToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        itemType={itemToDelete?.type || 'course'}
        itemName={itemToDelete?.name || ''}
      />
      
      <NewCourseModal
        isOpen={showNewCourseModal}
        onClose={() => setShowNewCourseModal(false)}
        onCourseCreated={handleCourseCreated}
      />
      
      <EditCourseModal
        isOpen={showEditCourseModal}
        onClose={() => {
          setShowEditCourseModal(false)
          setCourseToEdit(null)
        }}
        course={courseToEdit}
        onCourseUpdated={handleCourseUpdated}
      />

      <EditResourceModal
        isOpen={showEditResourceModal}
        onClose={() => {
          setShowEditResourceModal(false)
          setResourceToEdit(null)
        }}
        onSave={handleResourceUpdated}
        resource={resourceToEdit}
        courseName={currentCourse?.title || ''}
      />
    </DashboardLayout>
  )
}