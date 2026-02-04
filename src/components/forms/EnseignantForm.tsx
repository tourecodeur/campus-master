'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Save, X } from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * Phase 2 (DTO strict backend)
 * - Création : /api/auth/inscription -> { email, motDePasse, nomComplet, role: ENSEIGNANT }
 * - Modification : statut uniquement (activer/désactiver)
 */

export type EnseignantFormData =
  | {
      mode: 'create'
      prenom: string
      nom: string
      email: string
      motDePasse: string
    }
  | {
      mode: 'status'
      statut: 'actif' | 'inactif'
    }

type EnseignantInitialData = {
  id: number
  nom?: string
  prenom?: string
  email?: string
  statut?: 'actif' | 'inactif'
}

interface EnseignantFormProps {
  initialData?: EnseignantInitialData | null
  onSubmit: (data: EnseignantFormData) => void
  onCancel: () => void
}

export default function EnseignantForm({ initialData, onSubmit, onCancel }: EnseignantFormProps) {
  const mode: EnseignantFormData['mode'] = initialData ? 'status' : 'create'

  const defaultValues = useMemo(() => {
    if (mode === 'status') {
      return { mode: 'status', statut: initialData?.statut ?? 'actif' } as const
    }
    return { mode: 'create', prenom: '', nom: '', email: '', motDePasse: '' } as const
  }, [mode, initialData])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnseignantFormData>({
    defaultValues: defaultValues as any,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className='space-y-4'>
      {mode === 'create' ? (
        <>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Prénom *</label>
              <input
                {...register('prenom' as const, { required: 'Prénom requis' })}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              {errors && (errors as any).prenom && (
                <p className='text-red-500 text-xs mt-1'>{(errors as any).prenom.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Nom *</label>
              <input
                {...register('nom' as const, { required: 'Nom requis' })}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              {errors && (errors as any).nom && (
                <p className='text-red-500 text-xs mt-1'>{(errors as any).nom.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email *</label>
            <input
              type='email'
              {...register('email' as const, {
                required: 'Email requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide',
                },
              })}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            {errors && (errors as any).email && (
              <p className='text-red-500 text-xs mt-1'>{(errors as any).email.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Mot de passe *</label>
            <input
              type='password'
              {...register('motDePasse' as const, {
                required: 'Mot de passe requis',
                minLength: { value: 6, message: 'Minimum 6 caractères' },
              })}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            {errors && (errors as any).motDePasse && (
              <p className='text-red-500 text-xs mt-1'>{(errors as any).motDePasse.message}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className='rounded-lg border bg-gray-50 p-3 text-sm text-gray-700'>
            <div>
              <span className='font-medium'>Enseignant :</span> {initialData?.prenom} {initialData?.nom}
            </div>
            <div>
              <span className='font-medium'>Email :</span> {initialData?.email}
            </div>
            <div className='text-xs text-gray-500 mt-1'>
              Le backend ne permet pas de modifier les informations (nom/email) ici. Vous pouvez seulement activer/désactiver.
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Statut *</label>
            <select
              {...register('statut' as const, { required: true })}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='actif'>Actif</option>
              <option value='inactif'>Inactif</option>
            </select>
          </div>
        </>
      )}

      <div className='flex justify-end space-x-3 pt-4'>
        <Button type='button' onClick={onCancel} variant='outline'>
          <X className='w-4 h-4 mr-2' />
          Annuler
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          <Save className='w-4 h-4 mr-2' />
          {isSubmitting ? 'Enregistrement...' : mode === 'status' ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}
