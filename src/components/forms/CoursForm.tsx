'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getSemestres, getEnseignants } from '@/lib/api'

type Semestre = { id: number; libelle?: string; nom?: string; code?: string }
type Enseignant = {
  id: number
  nomComplet?: string
  email?: string
  nom?: string
  prenom?: string
}

export interface CoursFormData {
  titre: string
  description?: string
  semestreId: number
  enseignantId: number
}

interface CoursFormProps {
  initialData?: any
  onSubmit: (data: CoursFormData) => void
  onCancel: () => void
}

export default function CoursForm({ initialData, onSubmit, onCancel }: CoursFormProps) {
  const [semestres, setSemestres] = useState<Semestre[]>([])
  const [enseignants, setEnseignants] = useState<Enseignant[]>([])
  const [loadingRefs, setLoadingRefs] = useState(true)

  const defaultValues = useMemo(() => {
    const semestreId = Number(initialData?.semestreId ?? initialData?.semestre?.id ?? 0)
    const enseignantId = Number(initialData?.enseignantId ?? initialData?.enseignant?.id ?? 0)
    return {
      titre: initialData?.titre ?? '',
      description: initialData?.description ?? '',
      semestreId: Number.isFinite(semestreId) ? semestreId : 0,
      enseignantId: Number.isFinite(enseignantId) ? enseignantId : 0,
    } as CoursFormData
  }, [initialData])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CoursFormData>({ defaultValues })

  useEffect(() => {
    setValue('titre', defaultValues.titre)
    setValue('description', defaultValues.description ?? '')
    setValue('semestreId', defaultValues.semestreId)
    setValue('enseignantId', defaultValues.enseignantId)
  }, [defaultValues, setValue])

  useEffect(() => {
    ;(async () => {
      try {
        setLoadingRefs(true)
        const [s, e] = await Promise.all([getSemestres(), getEnseignants()])
        setSemestres((s ?? []) as any)
        setEnseignants((e ?? []) as any)
      } catch (err) {
        console.error('Erreur chargement semestres/enseignants:', err)
      } finally {
        setLoadingRefs(false)
      }
    })()
  }, [])

  const semestreLabel = (s: Semestre) => s.libelle || s.nom || s.code || `Semestre #${s.id}`
  const enseignantLabel = (u: Enseignant) =>
    u.nomComplet || `${u.prenom ?? ''} ${u.nom ?? ''}`.trim() || u.email || `Enseignant #${u.id}`

  const onValid = (data: CoursFormData) => {
    const payload: CoursFormData = {
      titre: String(data.titre ?? '').trim(),
      description: String(data.description ?? '').trim(),
      semestreId: Number(data.semestreId),
      enseignantId: Number(data.enseignantId),
    }

    if (!payload.titre) return alert('Titre requis')
    if (!payload.semestreId) return alert('Semestre requis')
    if (!payload.enseignantId) return alert('Enseignant requis')

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
        <input
          {...register('titre', { required: 'Titre requis' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Réseaux"
        />
        {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Intro TCP/IP..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semestre *</label>
          <select
            {...register('semestreId', {
              required: 'Semestre requis',
              valueAsNumber: true,
              validate: (v) => (!!v ? true : 'Semestre requis'),
            })}
            disabled={loadingRefs}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value={0}>Sélectionnez un semestre</option>
            {semestres.map((s) => (
              <option key={s.id} value={s.id}>
                {semestreLabel(s)}
              </option>
            ))}
          </select>
          {errors.semestreId && <p className="text-red-500 text-xs mt-1">{errors.semestreId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant *</label>
          <select
            {...register('enseignantId', {
              required: 'Enseignant requis',
              valueAsNumber: true,
              validate: (v) => (!!v ? true : 'Enseignant requis'),
            })}
            disabled={loadingRefs}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value={0}>Sélectionnez un enseignant</option>
            {enseignants.map((u) => (
              <option key={u.id} value={u.id}>
                {enseignantLabel(u)}
              </option>
            ))}
          </select>
          {errors.enseignantId && <p className="text-red-500 text-xs mt-1">{errors.enseignantId.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" onClick={onCancel} variant="outline">
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting || loadingRefs}>
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Enregistrement...' : initialData ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}
