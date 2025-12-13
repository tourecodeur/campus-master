'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { DollarSign, CheckCircle, Clock, AlertCircle, Download, CreditCard, Smartphone, Banknote } from 'lucide-react'

export default function PaiementsPage() {
  const [selectedPayment, setSelectedPayment] = useState(1)
  
  const payments = [
    { id: 1, type: 'Frais de scolarité', amount: 500000, dueDate: '2024-01-31', status: 'payé', paidDate: '2024-01-15' },
    { id: 2, type: 'Frais d\'inscription', amount: 100000, dueDate: '2024-02-15', status: 'en attente' },
    { id: 3, type: 'Frais bibliothèque', amount: 50000, dueDate: '2024-01-20', status: 'en retard' },
    { id: 4, type: 'Frais restauration', amount: 150000, dueDate: '2024-03-10', status: 'à venir' },
    { id: 5, type: 'Frais matériel', amount: 75000, dueDate: '2024-02-28', status: 'à venir' },
  ]
  
  const paymentHistory = [
    { id: 1, type: 'Frais de scolarité', amount: 500000, date: '2024-01-15', method: 'Virement bancaire', reference: 'PAY001' },
    { id: 2, type: 'Frais d\'inscription', amount: 100000, date: '2023-09-05', method: 'Mobile Money', reference: 'PAY002' },
    { id: 3, type: 'Frais bibliothèque', amount: 50000, date: '2023-09-10', method: 'Espèces', reference: 'PAY003' },
  ]
  
  const paymentMethods = [
    { id: 1, name: 'Virement bancaire', icon: Banknote, description: 'Transfert vers le compte de l\'université' },
    { id: 2, name: 'Mobile Money', icon: Smartphone, description: 'Wave, Orange Money, Free Money' },
    { id: 3, name: 'Carte bancaire', icon: CreditCard, description: 'Visa, Mastercard' },
    { id: 4, name: 'Espèces', icon: DollarSign, description: 'Au service comptabilité' },
  ]

  const selectedPaymentData = payments.find(p => p.id === selectedPayment)

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'payé': return 'bg-green-100 text-green-800'
      case 'en attente': return 'bg-yellow-100 text-yellow-800'
      case 'en retard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'payé': return <CheckCircle className="w-4 h-4" />
      case 'en attente': return <Clock className="w-4 h-4" />
      case 'en retard': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <DashboardLayout role="etudiant">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mes Paiements</h1>
          <p className="text-gray-600 mt-1">Gestion de vos frais académiques</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Paiements effectués</p>
                <p className="text-2xl font-bold text-gray-800">650 000 FCFA</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">3 paiements</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Paiements en attente</p>
                <p className="text-2xl font-bold text-gray-800">100 000 FCFA</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">1 paiement</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Paiements en retard</p>
                <p className="text-2xl font-bold text-gray-800">50 000 FCFA</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">1 paiement</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Frais à payer</h2>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    onClick={() => setSelectedPayment(payment.id)}
                    className={`p-4 rounded-lg cursor-pointer transition ${
                      selectedPayment === payment.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{payment.type}</h3>
                        <p className="text-sm text-gray-600">Échéance: {payment.dueDate}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">{payment.amount.toLocaleString()} FCFA</span>
                      {payment.status === 'payé' && (
                        <span className="text-xs text-gray-500">Payé le {payment.paidDate}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Historique récent</h2>
              <div className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{payment.type}</h4>
                      <span className="text-sm text-green-600">{payment.amount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{payment.date}</span>
                      <span>{payment.method}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedPaymentData?.type}</h2>
                  <p className="text-gray-600 mt-1">
                    Échéance: {selectedPaymentData?.dueDate} • 
                    Statut: <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedPaymentData?.status || '')}`}>
                      {selectedPaymentData?.status}
                    </span>
                  </p>
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-700">
                  <Download className="w-4 h-4 mr-1" />
                  Facture
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Détails du paiement</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant</span>
                      <span className="font-bold text-xl">{selectedPaymentData?.amount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date d'échéance</span>
                      <span className="font-medium">{selectedPaymentData?.dueDate}</span>
                    </div>
                    {selectedPaymentData?.status === 'payé' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date de paiement</span>
                        <span className="font-medium">{selectedPaymentData?.paidDate}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reste à payer</span>
                      <span className="font-bold text-red-600">
                        {selectedPaymentData?.status === 'payé' ? '0 FCFA' : `${selectedPaymentData?.amount.toLocaleString()} FCFA`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Méthodes de paiement</h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center p-3 bg-white rounded-lg">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <method.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-xs text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedPaymentData?.status !== 'payé' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                    Effectuer le paiement
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Méthode de paiement</label>
                      <select className="w-full border border-gray-300 rounded-lg px-4 py-3">
                        <option>Sélectionnez une méthode</option>
                        {paymentMethods.map((method) => (
                          <option key={method.id} value={method.id}>{method.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                      <input
                        type="text"
                        value={selectedPaymentData?.amount.toLocaleString()}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payer maintenant
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Vous serez redirigé vers la plateforme de paiement sécurisée
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}