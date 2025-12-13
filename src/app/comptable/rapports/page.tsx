'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { FileText, Download, Printer, Filter, Calendar, BarChart3, DollarSign } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function RapportsComptablePage() {
  const [selectedReport, setSelectedReport] = useState('financier')
  
  const revenueData = [
    { mois: 'Sep', revenus: 7200000, depenses: 4800000 },
    { mois: 'Oct', revenus: 6800000, depenses: 5200000 },
    { mois: 'Nov', revenus: 8100000, depenses: 4900000 },
    { mois: 'Déc', revenus: 9200000, depenses: 5800000 },
    { mois: 'Jan', revenus: 8500000, depenses: 5200000 },
  ]
  
  const paymentCategories = [
    { name: 'Frais de scolarité', value: 65, color: '#3b82f6' },
    { name: 'Frais d\'inscription', value: 15, color: '#10b981' },
    { name: 'Bibliothèque', value: 8, color: '#8b5cf6' },
    { name: 'Restauration', value: 7, color: '#f59e0b' },
    { name: 'Autres', value: 5, color: '#ef4444' },
  ]
  
  const reports = [
    { id: 'financier', title: 'Rapport financier mensuel', icon: DollarSign, date: 'Janvier 2024', records: 128 },
    { id: 'recouvrement', title: 'Rapport de recouvrement', icon: BarChart3, date: 'Décembre 2023', records: 89 },
    { id: 'etudiants', title: 'Rapport par étudiant', icon: FileText, date: 'Novembre 2023', records: 250 },
    { id: 'depenses', title: 'Analyse des dépenses', icon: Calendar, date: 'Octobre 2023', records: 156 },
  ]

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenus, 0)
  const totalExpenses = revenueData.reduce((sum, item) => sum + item.depenses, 0)
  const netIncome = totalRevenue - totalExpenses

  return (
    <DashboardLayout role="comptable">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Rapports Financiers</h1>
          <p className="text-gray-600 mt-1">Analyse et synthèse financière</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  report.id === 'financier' ? 'bg-blue-100' :
                  report.id === 'recouvrement' ? 'bg-green-100' :
                  report.id === 'etudiants' ? 'bg-purple-100' : 'bg-yellow-100'
                }`}>
                  <report.icon className={`w-6 h-6 ${
                    report.id === 'financier' ? 'text-blue-600' :
                    report.id === 'recouvrement' ? 'text-green-600' :
                    report.id === 'etudiants' ? 'text-purple-600' : 'text-yellow-600'
                  }`} />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">{report.title}</h3>
                  <p className="text-sm text-gray-500">{report.date}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{report.records} enregistrements</span>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Revenus vs Dépenses</h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                  <option>6 derniers mois</option>
                  <option>Cette année</option>
                  <option>Année dernière</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Montant']} />
                <Bar dataKey="revenus" fill="#10b981" name="Revenus" />
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
                <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Synthèse financière</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Revenus totaux</h3>
              <p className="text-3xl font-bold text-gray-800 mb-2">{totalRevenue.toLocaleString()} FCFA</p>
              <div className="flex items-center text-green-600">
                <span className="text-sm">+12.5% vs période précédente</span>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Dépenses totales</h3>
              <p className="text-3xl font-bold text-gray-800 mb-2">{totalExpenses.toLocaleString()} FCFA</p>
              <div className="flex items-center text-red-600">
                <span className="text-sm">+5.2% vs période précédente</span>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Bénéfice net</h3>
              <p className="text-3xl font-bold text-gray-800 mb-2">{netIncome.toLocaleString()} FCFA</p>
              <div className="flex items-center text-blue-600">
                <span className="text-sm">+18.3% vs période précédente</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Générer un nouveau rapport</h2>
            <button className="flex items-center text-blue-600 hover:text-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Modèle personnalisé
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de rapport</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3">
                  <option>Sélectionnez un type</option>
                  <option>Financier mensuel</option>
                  <option>Analyse de recouvrement</option>
                  <option>Rapport par étudiant</option>
                  <option>Analyse des dépenses</option>
                  <option>Rapport annuel</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">De</label>
                    <input type="date" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">À</label>
                    <input type="date" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options d'export</label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="checkbox" id="export-pdf" className="rounded" defaultChecked />
                    <label htmlFor="export-pdf" className="ml-2 text-sm text-gray-700">PDF</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="export-excel" className="rounded" defaultChecked />
                    <label htmlFor="export-excel" className="ml-2 text-sm text-gray-700">Excel</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="include-charts" className="rounded" defaultChecked />
                    <label htmlFor="include-charts" className="ml-2 text-sm text-gray-700">Inclure les graphiques</label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Générer le rapport
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}