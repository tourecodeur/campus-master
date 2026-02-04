'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { FileText, Download, Users, BookOpen, GraduationCap, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { getUtilisateurs, getCours } from '@/lib/api'

type Utilisateur = {
  id: number
  email: string
  nomComplet: string
  role: 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT'
  actif: boolean
  dateInscription?: string
}

type Cours = {
  id: number
  titre: string
  description?: string
  enseignantId: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function RapportsPage() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([])
  const [cours, setCours] = useState<Cours[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersData, coursData] = await Promise.all([
        getUtilisateurs(),
        getCours()
      ])
      setUtilisateurs(usersData)
      setCours(coursData)
    } catch (err: any) {
      console.error('Erreur chargement données:', err)
      setError('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  // Statistiques calculées depuis les données backend
  const totalEtudiants = utilisateurs.filter(u => u.role === 'ETUDIANT').length
  const totalEnseignants = utilisateurs.filter(u => u.role === 'ENSEIGNANT').length
  const totalCours = cours.length
  const utilisateursActifs = utilisateurs.filter(u => u.actif).length
  const utilisateursInactifs = utilisateurs.filter(u => !u.actif).length

  // Données pour le graphique de répartition des utilisateurs
  const repartitionData = [
    { name: 'Étudiants', value: totalEtudiants },
    { name: 'Enseignants', value: totalEnseignants },
    { name: 'Administrateurs', value: utilisateurs.filter(u => u.role === 'ADMIN').length },
  ].filter(item => item.value > 0)

  // Données pour le graphique de statut
  const statutData = [
    { name: 'Actifs', value: utilisateursActifs },
    { name: 'Inactifs', value: utilisateursInactifs },
  ]

  // Cours par enseignant
  const coursParEnseignant = utilisateurs
    .filter(u => u.role === 'ENSEIGNANT')
    .map(enseignant => ({
      nom: enseignant.nomComplet,
      cours: cours.filter(c => c.enseignantId === enseignant.id).length
    }))
    .sort((a, b) => b.cours - a.cours)
    .slice(0, 5)

  const exportToCSV = (type: 'utilisateurs' | 'cours') => {
    let csvContent = ''
    
    if (type === 'utilisateurs') {
      csvContent = 'ID,Email,Nom Complet,Rôle,Statut,Date Inscription\n'
      utilisateurs.forEach(u => {
        csvContent += `${u.id},"${u.email}","${u.nomComplet}",${u.role},${u.actif ? 'Actif' : 'Inactif'},"${u.dateInscription || 'N/A'}"\n`
      })
    } else {
      csvContent = 'ID,Titre,Description,Enseignant ID\n'
      cours.forEach(c => {
        csvContent += `${c.id},"${c.titre}","${c.description || ''}",${c.enseignantId}\n`
      })
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `rapport_${type}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Rapports et Statistiques</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de l'établissement</p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <button 
                onClick={() => exportToCSV('utilisateurs')}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{totalEtudiants}</h3>
            <p className="text-sm text-gray-600">Étudiants inscrits</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{totalEnseignants}</h3>
            <p className="text-sm text-gray-600">Enseignants actifs</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <button 
                onClick={() => exportToCSV('cours')}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{totalCours}</h3>
            <p className="text-sm text-gray-600">Cours disponibles</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{utilisateurs.length}</h3>
            <p className="text-sm text-gray-600">Total utilisateurs</p>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Répartition des utilisateurs */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Répartition des utilisateurs</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={repartitionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {repartitionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Statut des utilisateurs */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Statut des utilisateurs</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statutData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cours par enseignant */}
        {coursParEnseignant.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Top 5 - Cours par enseignant</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursParEnseignant}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nom" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cours" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Liste des utilisateurs récents */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Utilisateurs récents</h2>
            <button 
              onClick={() => exportToCSV('utilisateurs')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter tout
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rôle</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.slice(0, 10).map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.nomComplet}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ETUDIANT' ? 'bg-blue-100 text-blue-700' :
                        user.role === 'ENSEIGNANT' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {user.dateInscription ? new Date(user.dateInscription).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}