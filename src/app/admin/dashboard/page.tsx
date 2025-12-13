'use client'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { getStats } from '@/lib/api'
import { Users, GraduationCap, DollarSign, BookOpen, TrendingUp, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalRevenu: 0,
    totalCours: 0,
    nouveauxEtudiants: 0,
    tauxPresence: 0
  })
  const [loading, setLoading] = useState(true)

  const chartData = [
    { mois: 'Jan', inscriptions: 65, revenus: 400000 },
    { mois: 'Fév', inscriptions: 59, revenus: 380000 },
    { mois: 'Mar', inscriptions: 80, revenus: 520000 },
    { mois: 'Avr', inscriptions: 81, revenus: 540000 },
    { mois: 'Mai', inscriptions: 56, revenus: 360000 },
    { mois: 'Juin', inscriptions: 55, revenus: 350000 },
  ]

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await getStats()
      setStats(data)
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    { 
      title: 'Étudiants', 
      value: stats.totalEtudiants, 
      icon: Users, 
      color: 'bg-blue-500',
      trend: '+12%',
      trendUp: true 
    },
    { 
      title: 'Enseignants', 
      value: stats.totalEnseignants, 
      icon: GraduationCap, 
      color: 'bg-green-500',
      trend: '+5%',
      trendUp: true 
    },
    { 
      title: 'Revenus', 
      value: `${stats.totalRevenu.toLocaleString()} FCFA`, 
      icon: DollarSign, 
      color: 'bg-yellow-500',
      trend: '+18%',
      trendUp: true 
    },
    { 
      title: 'Cours', 
      value: stats.totalCours, 
      icon: BookOpen, 
      color: 'bg-purple-500',
      trend: '+3%',
      trendUp: true 
    },
  ]

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord Administrateur</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  {card.trend}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Évolution des inscriptions
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="inscriptions" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Revenus mensuels
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenus" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Activités récentes
            </h2>
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Nouvel étudiant inscrit</p>
                  <p className="text-xs text-gray-500">Il y a 5 minutes</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Paiement reçu</p>
                  <p className="text-xs text-gray-500">Il y a 15 minutes</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Cours ajouté</p>
                  <p className="text-xs text-gray-500">Il y a 1 heure</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-sm font-medium text-blue-900">Réunion planifiée</p>
                <p className="text-xs text-blue-700 mt-1">Demain à 10h00</p>
              </div>
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="text-sm font-medium text-yellow-900">Paiements en attente</p>
                <p className="text-xs text-yellow-700 mt-1">5 paiements à valider</p>
              </div>
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="text-sm font-medium text-green-900">Système à jour</p>
                <p className="text-xs text-green-700 mt-1">Dernière mise à jour: Aujourd'hui</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}