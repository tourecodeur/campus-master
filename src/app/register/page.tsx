'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { inscription, connexion, toUiRole } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react'

type Form = {
  nomComplet: string
  email: string
  motDePasse: string
  role: 'ETUDIANT' | 'ENSEIGNANT'
}

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    defaultValues: { role: 'ETUDIANT' }
  })

  const onSubmit = async (data: Form) => {
    try {
      setLoading(true)
      setError('')
      await inscription({
        email: data.email,
        motDePasse: data.motDePasse,
        nomComplet: data.nomComplet,
        role: data.role,
      })
      // auto-login
      const auth = await connexion(data.email, data.motDePasse)
      const uiRole = toUiRole(auth.role)
      setAuth(auth.token, uiRole, { id: 0, email: data.email, role: uiRole, backendRole: auth.role })
      router.push(`/${uiRole}/dashboard`)
    } catch (e: any) {
      setError(e?.response?.data?.message || "Impossible de s'inscrire")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <UserPlus className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Inscription</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Nom complet</label>
            <div className="mt-1 relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                {...register('nomComplet', { required: 'Nom complet requis' })}
                placeholder="Ex: Awa Diop"
              />
            </div>
            {errors.nomComplet && <p className="text-xs text-red-600 mt-1">{errors.nomComplet.message}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="mt-1 relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                {...register('email', { required: 'Email requis' })}
                placeholder="vous@campus.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600">Mot de passe</label>
            <div className="mt-1 relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                {...register('motDePasse', { required: 'Mot de passe requis', minLength: { value: 6, message: 'Minimum 6 caractères' } })}
                placeholder="••••••••"
              />
            </div>
            {errors.motDePasse && <p className="text-xs text-red-600 mt-1">{errors.motDePasse.message}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600">Rôle</label>
            <select className="mt-1 w-full px-4 py-3 border rounded-lg" {...register('role')}>
              <option value="ETUDIANT">Étudiant</option>
              <option value="ENSEIGNANT">Enseignant</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">ADMIN se crée côté backend / base de données.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Création...' : "S'inscrire"}
          </button>

          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full py-3 rounded-lg border font-semibold hover:bg-gray-50"
          >
            J'ai déjà un compte
          </button>
        </form>
      </div>
    </div>
  )
}
