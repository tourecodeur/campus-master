'use client'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { getEtudiants, deleteEtudiant, createEtudiant, updateEtudiant } from '@/lib/api'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import EtudiantForm from '@/components/forms/EtudiantForm'

interface Etudiant {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  statut: string;
}

export default function EtudiantsPage() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedEtudiant, setSelectedEtudiant] = useState<Etudiant | null>(null)

  useEffect(() => {
    loadEtudiants()
  }, [])

  const loadEtudiants = async () => {
    try {
      const data = await getEtudiants()
      setEtudiants(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      try {
        await deleteEtudiant(id)
        loadEtudiants()
      } catch (error) {
        console.error('Erreur:', error)
        alert('Erreur lors de la suppression')
      }
    }
  }

  const handleEdit = (etudiant: Etudiant) => {
    setSelectedEtudiant(etudiant)
    setShowModal(true)
  }

  const handleCreate = () => {
    setSelectedEtudiant(null)
    setShowModal(true)
  }

  const handleSubmit = async (data: any) => {
    try {
      if (selectedEtudiant) {
        await updateEtudiant(selectedEtudiant.id, data)
      } else {
        await createEtudiant(data)
      }
      setShowModal(false)
      loadEtudiants()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'enregistrement')
    }
  }

  const filteredEtudiants = etudiants.filter((e) => {
    const matchSearch = e.nom?.toLowerCase().includes(search.toLowerCase()) ||
      e.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      e.matricule?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase())

    return matchSearch
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
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Étudiants</h1>
            <p className="text-gray-600 mt-1">{filteredEtudiants.length} étudiant(s) trouvé(s)</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un étudiant
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom, matricule ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Matricule</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Nom & Prénom</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEtudiants.map((etudiant) => (
                  <tr key={etudiant.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6">{etudiant.matricule}</td>
                    <td className="py-4 px-6">{etudiant.nom} {etudiant.prenom}</td>
                    <td className="py-4 px-6">{etudiant.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        etudiant.statut === 'actif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {etudiant.statut}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(etudiant)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(etudiant.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
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

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedEtudiant ? 'Modifier l\'étudiant' : 'Ajouter un étudiant'}
        >
          <EtudiantForm
            initialData={selectedEtudiant}
            onSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}