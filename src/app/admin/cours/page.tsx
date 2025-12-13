'use client'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { getCours, createCours, updateCours, deleteCours } from '@/lib/api'
import { Plus, Search, BookOpen, Users, Clock, Calendar, Edit, Trash2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import CoursForm from '@/components/forms/CoursForm'

interface Cours {
  id: number;
  code: string;
  titre: string;
  niveau: string;
  enseignant: string;
  etudiantsInscrits: number;
  heures: number;
  semestre: string;
  credits: number;
  statut: string;
  description: string;
}

export default function CoursPage() {
  const [cours, setCours] = useState<Cours[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedCours, setSelectedCours] = useState<Cours | null>(null)

  useEffect(() => {
    loadCours()
  }, [])

  const loadCours = async () => {
    try {
      const data = await getCours()
      setCours(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedCours(null)
    setShowModal(true)
  }

  const handleEdit = (cours: Cours) => {
    setSelectedCours(cours)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      try {
        await deleteCours(id)
        loadCours()
      } catch (error) {
        console.error('Erreur:', error)
        alert('Erreur lors de la suppression')
      }
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (selectedCours) {
        await updateCours(selectedCours.id, data)
      } else {
        await createCours(data)
      }
      setShowModal(false)
      loadCours()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'enregistrement')
    }
  }

  const filteredCours = cours.filter((c) => {
    return c.titre?.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.enseignant?.toLowerCase().includes(search.toLowerCase())
  })

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Cours</h1>
            <p className="text-gray-600 mt-1">{filteredCours.length} cours trouvé(s)</p>
          </div>
          <button 
            onClick={handleCreate}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un cours
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par titre, code ou enseignant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCours.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{c.titre}</h3>
                    <p className="text-sm text-gray-600">{c.code} • {c.niveau}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(c)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(c.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{c.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                    {c.enseignant}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-green-500" />
                    {c.etudiantsInscrits} étudiants
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                    {c.heures} heures
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    {c.semestre}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    c.statut === 'actif' 
                      ? 'bg-green-100 text-green-800' 
                      : c.statut === 'en attente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {c.statut}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {c.credits} crédits
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedCours ? 'Modifier le cours' : 'Ajouter un cours'}
          size="lg"
        >
          <div className="max-h-[70vh] overflow-y-auto pr-2">
          <CoursForm
            initialData={selectedCours}
            onSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
          />
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}