'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { BookOpen, Users, Clock, Calendar, Download, CheckCircle, PlayCircle, FileText } from 'lucide-react'

export default function EtudiantCoursPage() {
  const [selectedCourse, setSelectedCourse] = useState(1)
  
  const courses = [
    { id: 1, code: 'MATH101', title: 'Mathématiques Avancées', teacher: 'Dr. Sow', credits: 4, progress: 75 },
    { id: 2, code: 'INF202', title: 'Algorithmique', teacher: 'Dr. Diallo', credits: 3, progress: 60 },
    { id: 3, code: 'BD303', title: 'Base de Données', teacher: 'Prof. Ndiaye', credits: 3, progress: 90 },
    { id: 4, code: 'WEB404', title: 'Développement Web', teacher: 'M. Diop', credits: 4, progress: 45 },
    { id: 5, code: 'RS505', title: 'Réseaux Informatiques', teacher: 'Prof. Fall', credits: 3, progress: 30 },
  ]
  
  const courseDetails = {
    1: {
      description: 'Ce cours couvre les concepts avancés des mathématiques appliquées à l\'informatique.',
      schedule: 'Lundi 14:00-16:00, Mercredi 10:00-12:00',
      room: 'C301',
      resources: [
        { id: 1, name: 'Chapitre 1 - Algèbre linéaire', type: 'PDF', size: '2.4 MB' },
        { id: 2, name: 'Exercices corrigés', type: 'PDF', size: '1.8 MB' },
        { id: 3, name: 'Vidéo - Matrices', type: 'Video', size: '45 MB' },
        { id: 4, name: 'TP N°1', type: 'Document', size: '1.2 MB' },
      ],
      assignments: [
        { id: 1, title: 'Devoir maison N°1', dueDate: '25/01/2024', status: 'Soumis' },
        { id: 2, title: 'Projet de session', dueDate: '15/02/2024', status: 'En cours' },
        { id: 3, title: 'Quiz chapitre 2', dueDate: '30/01/2024', status: 'À faire' },
      ]
    },
    2: {
      description: 'Introduction aux algorithmes et structures de données.',
      schedule: 'Mardi 08:00-10:00, Jeudi 08:00-10:00',
      room: 'A201',
      resources: [],
      assignments: []
    }
  }

  const selectedCourseData = courseDetails[selectedCourse as keyof typeof courseDetails] || courseDetails[1]

  return (
    <DashboardLayout role="etudiant">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mes Cours</h1>
          <p className="text-gray-600 mt-1">Gestion de vos cours et ressources</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Tous mes cours</h2>
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
                        <p className="text-sm text-gray-600">{course.code} • {course.teacher}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{course.credits} crédits</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progression</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Statistiques</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cours suivis</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Crédits acquis</span>
                  <span className="font-semibold">17/30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Moyenne générale</span>
                  <span className="font-semibold text-green-600">14.5/20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Assiduité</span>
                  <span className="font-semibold">92%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {courses.find(c => c.id === selectedCourse)?.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {courses.find(c => c.id === selectedCourse)?.code} • 
                    {courses.find(c => c.id === selectedCourse)?.teacher}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4 mr-1" />
                    Syllabus
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Crédits</p>
                      <p className="font-semibold">
                        {courses.find(c => c.id === selectedCourse)?.credits}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Horaires</p>
                      <p className="font-semibold text-sm">{selectedCourseData.schedule}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Salle</p>
                      <p className="font-semibold">{selectedCourseData.room}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700">{selectedCourseData.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Ressources
                  </h3>
                  <div className="space-y-3">
                    {selectedCourseData.resources.length > 0 ? (
                      selectedCourseData.resources.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-3 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{resource.name}</p>
                              <p className="text-xs text-gray-500">{resource.type} • {resource.size}</p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Aucune ressource disponible</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Devoirs
                  </h3>
                  <div className="space-y-3">
                    {selectedCourseData.assignments.length > 0 ? (
                      selectedCourseData.assignments.map((assignment) => (
                        <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{assignment.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              assignment.status === 'Soumis' ? 'bg-green-100 text-green-800' :
                              assignment.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {assignment.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Date limite: {assignment.dueDate}</span>
                            <button className="text-blue-600 hover:text-blue-700 text-sm">
                              {assignment.status === 'À faire' ? 'Commencer' : 'Voir'}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Aucun devoir assigné</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}