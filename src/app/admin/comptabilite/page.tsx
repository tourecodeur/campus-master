'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { DollarSign, TrendingUp, TrendingDown, Download, Filter, Search, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function ComptabilitePage() {
  const [filterPeriod, setFilterPeriod] = useState('month')
  
  const revenueData = [
    { mois: 'Jan', revenus: 4200000, depenses: 2800000 },
    { mois: 'Fév', revenus: 3800000, depenses: 2500000 },
    { mois: 'Mar', revenus: 5200000, depenses: 3200000 },
    { mois: 'Avr', revenus: 4800000, depenses: 3000000 },
    { mois: 'Mai', revenus: 4500000, depenses: 2900000 },
    { mois: 'Juin', revenus: 5100000, depenses: 3100000 },
  ]
  
  const paymentCategories = [
    { name: 'Frais de scolarité', value: 65, color: '#3b82f6' },
    { name: 'Frais d\'inscription', value: 15, color: '#10b981' },
    { name: 'Bibliothèque', value: 8, color: '#8b5cf6' },
    { name: 'Restauration', value: 7, color: '#f59e0b' },
    { name: 'Autres', value: 5, color: '#ef4444' },
  ]
  
  const recentPayments = [
    { id: 1, student: 'Amadou Diallo', amount: 250000, date: '2024-01-15', status: 'payé', method: 'Virement' },
    { id: 2, student: 'Fatou Ndiaye', amount: 300000, date: '2024-01-14', status: 'payé', method: 'Mobile Money' },
    { id: 3, student: 'Moussa Sow', amount: 200000, date: '2024-01-13', status: 'en attente', method: 'Espèces' },
    { id: 4, student: 'Aïcha Fall', amount: 280000, date: '2024-01-12', status: 'payé', method: 'Carte' },
    { id: 5, student: 'Ibrahima Ba', amount: 320000, date: '2024-01-11', status: 'en retard', method: 'Virement' },
  ]

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenus, 0)
  const totalExpenses = revenueData.reduce((sum, item) => sum + item.depenses, 0)
  const netIncome = totalRevenue - totalExpenses

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Comptabilité</h1>
          <p className="text-gray-600 mt-1">Gestion financière et suivi des paiements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Revenus totaux</p>
                <p className="text-2xl font-bold text-gray-800">{totalRevenue.toLocaleString()} FCFA</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% vs mois dernier
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Dépenses totales</p>
                <p className="text-2xl font-bold text-gray-800">{totalExpenses.toLocaleString()} FCFA</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-red-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.2% vs mois dernier
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Bénéfice net</p>
                <p className="text-2xl font-bold text-gray-800">{netIncome.toLocaleString()} FCFA</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +18.3% vs mois dernier
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Revenus vs Dépenses</h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select 
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenus" fill="#3b82f6" name="Revenus" />
                <Bar dataKey="depenses" fill="#ef4444" name="Dépenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Répartition des revenus</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Paiements récents</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  <Download className="w-4 h-4 mr-1" />
                  Exporter
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Étudiant</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Montant</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Méthode</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6">{payment.student}</td>
                    <td className="py-4 px-6 font-medium">{payment.amount.toLocaleString()} FCFA</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {payment.date}
                      </div>
                    </td>
                    <td className="py-4 px-6">{payment.method}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        payment.status === 'payé' ? 'bg-green-100 text-green-800' :
                        payment.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Affichage de 1 à {recentPayments.length} de 128 paiements</span>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border rounded-lg hover:bg-white">Précédent</button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</span>
                <button className="px-3 py-1 border rounded-lg hover:bg-white">2</button>
                <button className="px-3 py-1 border rounded-lg hover:bg-white">3</button>
                <button className="px-3 py-1 border rounded-lg hover:bg-white">Suivant</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}