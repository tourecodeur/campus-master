'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Search, Filter, Download, CheckCircle, XCircle, Clock, DollarSign, CreditCard } from 'lucide-react'

export default function ComptablePaiementsPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const payments = [
    { id: 1, student: 'Amadou Diallo', matricule: 'ETU001', type: 'Frais de scolarité', amount: 500000, dueDate: '2024-01-31', paidDate: '2024-01-15', status: 'payé', method: 'Virement' },
    { id: 2, student: 'Fatou Ndiaye', matricule: 'ETU002', type: 'Frais d\'inscription', amount: 100000, dueDate: '2024-02-15', paidDate: null, status: 'en attente', method: 'Mobile Money' },
    { id: 3, student: 'Moussa Sow', matricule: 'ETU003', type: 'Frais bibliothèque', amount: 50000, dueDate: '2024-01-20', paidDate: null, status: 'en retard', method: 'Espèces' },
    { id: 4, student: 'Aïcha Fall', matricule: 'ETU004', type: 'Frais de scolarité', amount: 500000, dueDate: '2024-01-31', paidDate: '2024-01-12', status: 'payé', method: 'Carte' },
    { id: 5, student: 'Ibrahima Ba', matricule: 'ETU005', type: 'Frais restauration', amount: 150000, dueDate: '2024-03-10', paidDate: null, status: 'à venir', method: null },
    { id: 6, student: 'Mariama Gueye', matricule: 'ETU006', type: 'Frais de scolarité', amount: 500000, dueDate: '2024-01-31', paidDate: '2024-01-10', status: 'payé', method: 'Virement' },
    { id: 7, student: 'Cheikh Diop', matricule: 'ETU007', type: 'Frais matériel', amount: 75000, dueDate: '2024-02-28', paidDate: null, status: 'à venir', method: null },
    { id: 8, student: 'Oumar Kane', matricule: 'ETU008', type: 'Frais bibliothèque', amount: 50000, dueDate: '2024-01-20', paidDate: null, status: 'en retard', method: 'Espèces' },
  ]

  const filteredPayments = payments.filter(payment => {
    const matchSearch = payment.student.toLowerCase().includes(search.toLowerCase()) ||
      payment.matricule.toLowerCase().includes(search.toLowerCase()) ||
      payment.type.toLowerCase().includes(search.toLowerCase())
    
    const matchStatus = filterStatus === 'all' || payment.status === filterStatus
    
    return matchSearch && matchStatus
  })

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'payé': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'en attente': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'en retard': return <XCircle className="w-4 h-4 text-red-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'payé': return 'bg-green-100 text-green-800'
      case 'en attente': return 'bg-yellow-100 text-yellow-800'
      case 'en retard': return 'bg-red-100 text-red-800'
      case 'à venir': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout role="comptable">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Paiements</h1>
          <p className="text-gray-600 mt-1">Suivi et validation des paiements étudiants</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, matricule ou type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="payé">Payé</option>
                  <option value="en attente">En attente</option>
                  <option value="en retard">En retard</option>
                  <option value="à venir">À venir</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Liste des paiements</h2>
                <p className="text-gray-600 text-sm mt-1">{filteredPayments.length} paiement(s) trouvé(s)</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center text-blue-600 hover:text-blue-700">
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
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Montant</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Échéance</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Méthode</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium">{payment.student}</p>
                        <p className="text-sm text-gray-600">{payment.matricule}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">{payment.type}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-bold">{payment.amount.toLocaleString()} FCFA</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{payment.dueDate}</td>
                    <td className="py-4 px-6">
                      {payment.method ? (
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                          {payment.method}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        {payment.status === 'en attente' && (
                          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                            Valider
                          </button>
                        )}
                        {payment.status === 'en retard' && (
                          <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                            Relancer
                          </button>
                        )}
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Détails
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Total sélectionné: <span className="font-bold text-gray-800">
                  {filteredPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} FCFA
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Annuler
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Valider sélection
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total payé ce mois</span>
                <span className="font-bold">1,850,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">En attente</span>
                <span className="font-bold text-yellow-600">325,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">En retard</span>
                <span className="font-bold text-red-600">100,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taux de recouvrement</span>
                <span className="font-bold text-green-600">85%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left">
                <h4 className="font-medium text-gray-800">Envoyer rappel</h4>
                <p className="text-sm text-gray-600 mt-1">Relancer les paiements en retard</p>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left">
                <h4 className="font-medium text-gray-800">Générer rapport</h4>
                <p className="text-sm text-gray-600 mt-1">Rapport financier mensuel</p>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left">
                <h4 className="font-medium text-gray-800">Exporter données</h4>
                <p className="text-sm text-gray-600 mt-1">Excel ou PDF des paiements</p>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left">
                <h4 className="font-medium text-gray-800">Configurer frais</h4>
                <p className="text-sm text-gray-600 mt-1">Modifier les tarifs et échéances</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}