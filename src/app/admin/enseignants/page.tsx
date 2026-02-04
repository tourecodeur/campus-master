'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import {
  getEnseignants,
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
} from '@/lib/api'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import EnseignantForm from '@/components/forms/EnseignantForm'

interface Enseignant {
  id: number
  nom: string
  prenom: string
  email: string
  statut: 'actif' | 'inactif' | string
}

export default function EnseignantsPage() {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<Enseignant | null>(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const data = await getEnseignants()
      // getEnseignants() retourne un DTO UI plus riche, mais on ne garde ici que le strict nécessaire
      setEnseignants(
        (data as any[]).map((e) => ({
          id: e.id,
          nom: e.nom ?? '',
          prenom: e.prenom ?? '',
          email: e.email ?? '',
          statut: e.statut ?? 'actif',
        }))
      )
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelected(null)
    setShowModal(true)
  }

  const handleEdit = (enseignant: Enseignant) => {
    setSelected(enseignant)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) return
    try {
      await deleteEnseignant(id)
      load()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (selected) {
        await updateEnseignant(selected.id, data)
      } else {
        await createEnseignant(data)
      }
      setShowModal(false)
      load()
    } catch (error) {
      console.error('Erreur:', error)
      // le backend renvoie un JSON standardisé; on affiche le message si dispo
      const msg = (error as any)?.response?.data?.message || (error as Error)?.message
      alert(msg || "Erreur lors de l'enregistrement")
    }
  }

  const filtered = enseignants.filter((e) => {
    const q = search.toLowerCase()
    return (
      e.nom?.toLowerCase().includes(q) ||
      e.prenom?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q)
    )
  })

  if (loading) {
    return (
      <DashboardLayout role='admin'>
        <div className='flex items-center justify-center h-screen'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600' />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role='admin'>
      <div className='p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Gestion des Enseignants</h1>
            <p className='text-gray-600 mt-1'>{filtered.length} enseignant(s) trouvé(s)</p>
          </div>
          <button
            onClick={handleCreate}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md'
          >
            <Plus className='w-5 h-5 mr-2' />
            Ajouter un enseignant
          </button>
        </div>

        <div className='bg-white rounded-xl shadow-md p-6 mb-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Rechercher par nom, prénom ou email...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Nom & Prénom</th>
                  <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Email</th>
                  <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Statut</th>
                  <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((enseignant) => (
                  <tr key={enseignant.id} className='border-b hover:bg-gray-50 transition'>
                    <td className='py-4 px-6'>
                      {enseignant.nom} {enseignant.prenom}
                    </td>
                    <td className='py-4 px-6'>{enseignant.email}</td>
                    <td className='py-4 px-6'>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          enseignant.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {enseignant.statut}
                      </span>
                    </td>
                    <td className='py-4 px-6'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => handleEdit(enseignant)}
                          className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition'
                          title='Modifier (statut)'
                        >
                          <Edit className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleDelete(enseignant.id)}
                          className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition'
                          title='Supprimer'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                        <button className='p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition' title='Voir détails'>
                          <Eye className='w-4 h-4' />
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
          title={selected ? "Modifier l'enseignant" : 'Ajouter un enseignant'}
        >
          <EnseignantForm initialData={selected} onSubmit={handleSubmit} onCancel={() => setShowModal(false)} />
        </Modal>
      </div>
    </DashboardLayout>
  )
}
