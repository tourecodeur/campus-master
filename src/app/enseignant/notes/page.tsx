'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Upload, Download, Filter, Search, CheckCircle, XCircle, Clock } from 'lucide-react'
import ValidateAllModal from './components/modals/ValidateAllModal'
import ValidateSingleModal from './components/modals/ValidateSingleModal'
import EditGradeModal from './components/modals/EditGradeModal'
import SaveAllModal from './components/modals/SaveAllModal'
import ImportGradesModal from './components/modals/ImportGradesModal'
import ExportGradesModal from './components/modals/ExportGradesModal'
import ExcelTemplateModal from './components/modals/ExcelTemplateModal'

export default function NotesPage() {
  const [selectedCourse, setSelectedCourse] = useState('ALG101')
  const [search, setSearch] = useState('')
  
  // États pour les modals
  const [showValidateAllModal, setShowValidateAllModal] = useState(false)
  const [showValidateSingleModal, setShowValidateSingleModal] = useState(false)
  const [showEditGradeModal, setShowEditGradeModal] = useState(false)
  const [showSaveAllModal, setShowSaveAllModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  // États pour les données sélectionnées
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [grades, setGrades] = useState([
    { id: 1, matricule: 'ETU001', nom: 'Diallo', prenom: 'Amadou', note: 16.5, statut: 'validé' },
    { id: 2, matricule: 'ETU002', nom: 'Ndiaye', prenom: 'Fatou', note: 14.0, statut: 'validé' },
    { id: 3, matricule: 'ETU003', nom: 'Sow', prenom: 'Moussa', note: null, statut: 'manquant' },
    { id: 4, matricule: 'ETU004', nom: 'Fall', prenom: 'Aïcha', note: 12.5, statut: 'en attente' },
    { id: 5, matricule: 'ETU005', nom: 'Ba', prenom: 'Ibrahima', note: 18.0, statut: 'validé' },
    { id: 6, matricule: 'ETU006', nom: 'Gueye', prenom: 'Mariama', note: 9.5, statut: 'en attente' },
    { id: 7, matricule: 'ETU007', nom: 'Diop', prenom: 'Cheikh', note: 15.5, statut: 'validé' },
    { id: 8, matricule: 'ETU008', nom: 'Kane', prenom: 'Oumar', note: null, statut: 'manquant' },
  ])

  const courses = [
    { id: 'ALG101', name: 'Algorithmique', niveau: 'L1', students: 45 },
    { id: 'BD202', name: 'Base de Données', niveau: 'L2', students: 40 },
    { id: 'MATH101', name: 'Mathématiques', niveau: 'L1', students: 48 },
  ]
  
  const students = [
    { id: 1, matricule: 'ETU001', nom: 'Diallo', prenom: 'Amadou', note: 16.5, statut: 'validé' },
    { id: 2, matricule: 'ETU002', nom: 'Ndiaye', prenom: 'Fatou', note: 14.0, statut: 'validé' },
    { id: 3, matricule: 'ETU003', nom: 'Sow', prenom: 'Moussa', note: null, statut: 'manquant' },
    { id: 4, matricule: 'ETU004', nom: 'Fall', prenom: 'Aïcha', note: 12.5, statut: 'en attente' },
    { id: 5, matricule: 'ETU005', nom: 'Ba', prenom: 'Ibrahima', note: 18.0, statut: 'validé' },
    { id: 6, matricule: 'ETU006', nom: 'Gueye', prenom: 'Mariama', note: 9.5, statut: 'en attente' },
    { id: 7, matricule: 'ETU007', nom: 'Diop', prenom: 'Cheikh', note: 15.5, statut: 'validé' },
    { id: 8, matricule: 'ETU008', nom: 'Kane', prenom: 'Oumar', note: null, statut: 'manquant' },
  ]

  const selectedCourseData = courses.find(c => c.id === selectedCourse)
  const filteredStudents = students.filter(s => 
    s.nom.toLowerCase().includes(search.toLowerCase()) ||
    s.prenom.toLowerCase().includes(search.toLowerCase()) ||
    s.matricule.toLowerCase().includes(search.toLowerCase())
  )

  const pendingCount = grades.filter(s => s.statut === 'en attente').length
  const modifiedCount = grades.filter(s => s.statut === 'en attente' && s.note !== null).length


  const getStatusIcon = (statut: string) => {
    switch(statut) {
      case 'validé': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'en attente': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'manquant': return <XCircle className="w-4 h-4 text-red-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

    // Handlers pour les actions
  const handleValidateAll = () => {
    console.log('Validating all grades')
    setGrades(grades.map(g => ({
      ...g,
      statut: g.note !== null ? 'validé' : g.statut
    })))
  }

  const handleValidateSingle = (studentId: number) => {
    console.log('Validating grade for student:', studentId)
    setGrades(grades.map(g => 
      g.id === studentId ? { ...g, statut: 'validé' } : g
    ))
  }

  const handleEditGrade = (studentId: number, newNote: number) => {
    console.log('Updating grade for student:', studentId, 'to:', newNote)
    setGrades(grades.map(g => 
      g.id === studentId ? { ...g, note: newNote, statut: 'en attente' } : g
    ))
  }

  const handleSaveAll = () => {
    console.log('Saving all grades')
    // Logique d'enregistrement
  }

  const handleImport = (file: File) => {
    console.log('Importing file:', file.name)
    // Logique d'import
  }

  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    console.log('Exporting in format:', format)
    // Logique d'export
  }

  const handleDownloadTemplate = () => {
    console.log('Downloading Excel template')
    // Logique de téléchargement
  }

  return (
    <DashboardLayout role="enseignant">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestion des Notes
          </h1>
          <p className="text-gray-600 mt-1">
            Saisie et validation des notes des étudiants
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Cours</h2>
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`p-4 rounded-lg cursor-pointer transition ${
                      selectedCourse === course.id
                        ? "bg-blue-50 border-l-4 border-blue-600"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800">
                      {course.name}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{course.id}</span>
                      <span>{course.students} étudiants</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="w-full flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Importer notes (Excel)
                </button>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="w-full flex items-center justify-center p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Exporter notes
                </button>
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="w-full flex items-center justify-center p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Modèle Excel
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedCourseData?.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedCourseData?.id} • {selectedCourseData?.niveau} •
                    {selectedCourseData?.students} étudiants
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowValidateAllModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Valider toutes
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un étudiant..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                        Matricule
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                        Nom & Prénom
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                        Note
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                        Statut
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-4 px-6">{student.matricule}</td>
                        <td className="py-4 px-6">
                          {student.nom} {student.prenom}
                        </td>
                        <td className="py-4 px-6">
                          {student.note !== null ? (
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={student.note}
                              onChange={(e) => {}}
                              className="w-20 border border-gray-300 rounded px-3 py-1 text-center"
                            />
                          ) : (
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              placeholder="0-20"
                              className="w-20 border border-gray-300 rounded px-3 py-1 text-center"
                            />
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {getStatusIcon(student.statut)}
                            <span
                              className={`ml-2 text-sm ${
                                student.statut === "validé"
                                  ? "text-green-600"
                                  : student.statut === "en attente"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {student.statut}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            {student.statut === "en attente" && (
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowValidateSingleModal(true);
                                }}
                                className="text-sm text-green-600 hover:text-green-700"
                              >
                                Valider
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowEditGradeModal(true);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Modifier
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Notes saisies: <span className="font-semibold">6/8</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Moyenne: <span className="font-semibold">14.3/20</span>
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                      Annuler
                    </button>
                    <button 
                      onClick={() => setShowSaveAllModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Enregistrer toutes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Statistiques du cours
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Moyenne générale</p>
                  <p className="text-2xl font-bold text-gray-800">14.3/20</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Taux de réussite</p>
                  <p className="text-2xl font-bold text-gray-800">83%</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Meilleure note</p>
                  <p className="text-2xl font-bold text-gray-800">18.0/20</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
            <ValidateAllModal
        isOpen={showValidateAllModal}
        onClose={() => setShowValidateAllModal(false)}
        onValidateAll={handleValidateAll}
        courseName={selectedCourseData?.name || ''}
        pendingCount={pendingCount}
      />

      <ValidateSingleModal
        isOpen={showValidateSingleModal}
        onClose={() => {
          setShowValidateSingleModal(false)
          setSelectedStudent(null)
        }}
        onValidate={() => selectedStudent && handleValidateSingle(selectedStudent.id)}
        student={selectedStudent || { matricule: '', nom: '', prenom: '', note: null }}
        courseName={selectedCourseData?.name || ''}
      />

      <EditGradeModal
        isOpen={showEditGradeModal}
        onClose={() => {
          setShowEditGradeModal(false)
          setSelectedStudent(null)
        }}
        onSave={(note) => selectedStudent && handleEditGrade(selectedStudent.id, note)}
        student={selectedStudent || { matricule: '', nom: '', prenom: '', note: null }}
        courseName={selectedCourseData?.name || ''}
      />

      <SaveAllModal
        isOpen={showSaveAllModal}
        onClose={() => setShowSaveAllModal(false)}
        onSaveAll={handleSaveAll}
        courseName={selectedCourseData?.name || ''}
        modifiedCount={modifiedCount}
        totalCount={grades.length}
      />

      <ImportGradesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        courseName={selectedCourseData?.name || ''}
      />

      <ExportGradesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        courseName={selectedCourseData?.name || ''}
        studentCount={grades.length}
      />

      <ExcelTemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onDownload={handleDownloadTemplate}
        courseName={selectedCourseData?.name || ''}
        courseCode={selectedCourseData?.id || ''}
        studentCount={grades.length}
      />

    </DashboardLayout>
  );
}