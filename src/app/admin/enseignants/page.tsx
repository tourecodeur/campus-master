'use client'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { getEnseignants } from '@/lib/api'
import { Plus, Search, Edit, Trash2, Mail, Phone, Book } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import EnseignantForm from '@/components/forms/EnseignantForm'

interface Enseignant {
  id: number;
  nom: string;
  prenom: string;
  titre: string;
  email: string;
  telephone: string;
  matiere: string;
  statut: string;
  coursCount: number;
}

export default function EnseignantsPage() {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedEnseignant, setSelectedEnseignant] = useState<Enseignant | null>(null)

  useEffect(() => {
    loadEnseignants()
  }, [])

  const loadEnseignants = async () => {
    try {
      const data = await getEnseignants()
      setEnseignants(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedEnseignant(null)
    setShowModal(true)
  }

  const handleEdit = (enseignant: Enseignant) => {
    setSelectedEnseignant(enseignant)
    setShowModal(true)
  }

  const handleSubmit = async (data: any) => {
    try {
      if (selectedEnseignant) {
        // await updateEnseignant(selectedEnseignant.id, data)
      } else {
        // await createEnseignant(data)
      }
      setShowModal(false)
      loadEnseignants()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'enregistrement')
    }
  }

  const filteredEnseignants = enseignants.filter((e) => {
    return e.nom?.toLowerCase().includes(search.toLowerCase()) ||
      e.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.matiere?.toLowerCase().includes(search.toLowerCase())
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
      <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Enseignants</h1>
            <p className="text-gray-600 mt-1">{filteredEnseignants.length} enseignant(s) trouvé(s)</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un enseignant
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, matière ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {filteredEnseignants.map((enseignant) => (
            <div key={enseignant.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {enseignant.nom.charAt(0)}{enseignant.prenom.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {enseignant.titre} {enseignant.nom} {enseignant.prenom}
                    </h3>
                    <p className="text-sm text-gray-600">{enseignant.matiere}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {enseignant.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {enseignant.telephone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Book className="w-4 h-4 mr-2 text-gray-400" />
                    {enseignant.coursCount} cours
                  </div>
                </div>

                <div className="flex justify-between mt-6 pt-4 border-t">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    enseignant.statut === 'actif' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {enseignant.statut}
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(enseignant)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal avec styles améliorés */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedEnseignant ? 'Modifier l\'enseignant' : 'Ajouter un enseignant'}
        size="lg" // Assurez-vous que votre composant Modal supporte cette prop
      >
        <div className="max-h-[70vh] overflow-y-auto pr-2"> {/* Scroll dans le modal */}
          <EnseignantForm
            initialData={selectedEnseignant}
            onSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
          />
        </div>
      </Modal>
    </DashboardLayout>
  )
}