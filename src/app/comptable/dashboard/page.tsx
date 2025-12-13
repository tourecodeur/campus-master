'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, Clock, AlertCircle, CreditCard } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ComptableDashboard() {
  const [stats, setStats] = useState({
    revenusMensuels: 8500000,
    depensesMensuelles: 5200000,
    paiementsEnAttente: 1250000,
    paiementsEnRetard: 450000
  })

  const revenueData = [
    { mois: 'Sep', montant: 7200000 },
    { mois: 'Oct', montant: 6800000 },
    { mois: 'Nov', montant: 8100000 },
    { mois: 'Déc', montant: 9200000 },
    { mois: 'Jan', montant: 8500000 },
  ]

  const paymentMethods = [
    { method: 'Virement', count: 45, amount: 3200000 },
    { method: 'Mobile Money', count: 38, amount: 2800000 },
    { method: 'Espèces', count: 22, amount: 1500000 },
    { method: 'Carte', count: 15, amount: 1000000 },
  ]

  const recentPayments = [
    { id: 1, student: 'Amadou Diallo', amount: 250000, date: '2024-01-15', status: 'payé', method: 'Virement' },
    { id: 2, student: 'Fatou Ndiaye', amount: 300000, date: '2024-01-14', status: 'payé', method: 'Mobile Money' },
    { id: 3, student: 'Moussa Sow', amount: 200000, date: '2024-01-13', status: 'en attente', method: 'Espèces' },
    { id: 4, student: 'Aïcha Fall', amount: 280000, date: '2024-01-12', status: 'payé', method: 'Carte' },
  ]

  return (
    <DashboardLayout role="comptable">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord Comptable</h1>
          <p className="text-gray-600 mt-1">Gestion financière et suivi des paiements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Revenus mensuels</p>
                <p className="text-2xl font-bold text-gray-800">{stats.revenusMensuels.toLocaleString()} FCFA</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.5% vs mois dernier
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Dépenses mensuelles</p>
                <p className="text-2xl font-bold text-gray-800">{stats.depensesMensuelles.toLocaleString()} FCFA</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-red-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +5.2% vs mois dernier
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-bold text-gray-800">{stats.paiementsEnAttente.toLocaleString()} FCFA</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-yellow-600">
              <Clock className="w-4 h-4 mr-1" />
              12 paiements
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">En retard</p>
                <p className="text-2xl font-bold text-gray-800">{stats.paiementsEnRetard.toLocaleString()} FCFA</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              8 paiements
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Évolution des revenus</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Montant']} />
                <Line type="monotone" dataKey="montant" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Méthodes de paiement</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentMethods}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Montant']} />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Paiements récents</h2>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{payment.student}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <CreditCard className="w-3 h-3 mr-1" />
                      {payment.method} • {payment.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{payment.amount.toLocaleString()} FCFA</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      payment.status === 'payé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Statistiques rapides</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Taux de recouvrement</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Paiements validés</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Retards de paiement</span>
                  <span className="font-semibold">12%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}