'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Button from '@/components/ui/Button'
import useAuthStore, { type UiRole } from '@/lib/store'
import { LogOut, Shield, User, KeyRound } from 'lucide-react'

export default function AdminParametresPage() {
  const role = useAuthStore((s) => s.role)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [loading, setLoading] = useState(false)

  const layoutRole: UiRole = role ?? 'etudiant'

  const handleLogout = () => {
    logout()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
    }
    window.location.href = '/login'
  }

  const handleChangePassword = async () => {
    // ⚠️ Endpoint non fourni dans ta doc
    // Si tu ajoutes un endpoint plus tard, branche-le ici.
    if (!currentPwd || !newPwd || !confirmPwd) return alert('Remplis tous les champs.')
    if (newPwd !== confirmPwd) return alert('Confirmation mot de passe incorrecte.')

    alert("Le backend ne fournit pas encore l'endpoint de changement de mot de passe. Ajoute-le côté API, puis je branche ici.")
  }

  return (
    <DashboardLayout role={layoutRole}>
      <div className="p-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Paramètres</h1>
        <p className="text-gray-600 mb-6">Profil & sécurité</p>

        {/* Profil */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Profil</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="border rounded-lg p-4">
              <div className="text-gray-500">Email</div>
              <div className="font-medium text-gray-900">{user?.email ?? '-'}</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-gray-500">Rôle</div>
              <div className="font-medium text-gray-900">{role ?? '-'}</div>
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Sécurité</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
              <input
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label>
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button onClick={handleChangePassword} disabled={loading}>
            <KeyRound className="w-4 h-4 mr-2" />
            Changer le mot de passe
          </Button>

          <p className="text-xs text-gray-500 mt-3">
            Note : branchement backend requis (endpoint “change password” non présent dans ta doc).
          </p>
        </div>

        {/* Déconnexion */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Session</h2>
              <p className="text-gray-600 text-sm">Se déconnecter de l’application</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
