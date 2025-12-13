'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { FileText, Download, Printer, Filter, Calendar, BarChart3, Users } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function RapportsPage() {
  const [selectedReport, setSelectedReport] = useState('inscriptions')
  
  const inscriptionData = [
    { mois: 'Jan', inscriptions: 45 },
    { mois: 'Fév', inscriptions: 52 },
    { mois: 'Mar', inscriptions: 68 },
    { mois: 'Avr', inscriptions: 72 },
    { mois: 'Mai', inscriptions: 65 },
    { mois: 'Juin', inscriptions: 58 },
  ]
  
  const performanceData = [
    { matiere: 'Mathématiques', moyenne: 14.5, tauxReussite: 85 },
    { matiere: 'Informatique', moyenne: 16.2, tauxReussite: 92 },
    { matiere: 'Anglais', moyenne: 13.8, tauxReussite: 78 },
    { matiere: 'Management', moyenne: 15.1, tauxReussite: 88 },
    { matiere: 'Droit', moyenne: 12.9, tauxReussite: 72 },
  ]
  
  const reports = [
    { id: 'inscriptions', title: 'Rapport d\'inscriptions', icon: Users, date: 'Janvier 2024', records: 250 },
    { id: 'financier', title: 'Rapport financier', icon: BarChart3, date: 'Décembre 2023', records: 128 },
    { id: 'academique', title: 'Rapport académique', icon: FileText, date: 'Novembre 2023', records: 89 },
    { id: 'presence', title: 'Rapport de présence', icon: Calendar, date: 'Octobre 2023', records: 156 },
  ]

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Rapports</h1>
          <p className="text-gray-600 mt-1">Analyse et statistiques détaillées</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  report.id === 'inscriptions' ? 'bg-blue-100' :
                  report.id === 'financier' ? 'bg-green-100' :
                  report.id === 'academique' ? 'bg-purple-100' : 'bg-yellow-100'
                }`}>
                  <report.icon className={`w-6 h-6 ${
                    report.id === 'inscriptions' ? 'text-blue-600' :
                    report.id === 'financier' ? 'text-green-600' :
                    report.id === 'academique' ? 'text-purple-600' : 'text-yellow-600'
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
              <h2 className="text-xl font-semibold">Évolution des inscriptions</h2>
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
              <AreaChart data={inscriptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="inscriptions" stroke="#3b82f6" fill="#93c5fd" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Performance par matière</h2>
            <div className="space-y-4">
              {performanceData.map((item) => (
                <div key={item.matiere} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.matiere}</span>
                    <div className="text-sm text-gray-600">
                      Moyenne: <span className="font-semibold">{item.moyenne}/20</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${item.tauxReussite}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Taux de réussite</span>
                    <span>{item.tauxReussite}%</span>
                  </div>
                </div>
              ))}
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
                  <option>Inscriptions</option>
                  <option>Financier</option>
                  <option>Académique</option>
                  <option>Présence</option>
                  <option>Performance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" className="border border-gray-300 rounded-lg px-4 py-3" />
                  <input type="date" className="border border-gray-300 rounded-lg px-4 py-3" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtres</label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="checkbox" id="filter-niveau" className="rounded" />
                    <label htmlFor="filter-niveau" className="ml-2 text-sm text-gray-700">Par niveau</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="filter-filiere" className="rounded" />
                    <label htmlFor="filter-filiere" className="ml-2 text-sm text-gray-700">Par filière</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="filter-statut" className="rounded" />
                    <label htmlFor="filter-statut" className="ml-2 text-sm text-gray-700">Par statut</label>
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