'use client'
import { useForm } from 'react-hook-form'
import { Save, X } from 'lucide-react'
import Button from '@/components/ui/Button'

interface EtudiantFormData {
  nom: string
  prenom: string
  email: string
  telephone: string
  dateNaissance: string
  lieuNaissance: string
  nationalite: string
  niveau: string
  filiere: string
  adresse: string
}

interface EtudiantFormProps {
  initialData?: any
  onSubmit: (data: EtudiantFormData) => void
  onCancel: () => void
}

export default function EtudiantForm({ initialData, onSubmit, onCancel }: EtudiantFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EtudiantFormData>({
    defaultValues: initialData || {
      niveau: 'L1',
      filiere: 'Informatique',
      nationalite: 'Sénégalaise'
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input
            {...register('nom', { required: 'Nom requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
          <input
            {...register('prenom', { required: 'Prénom requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input
          type="email"
          {...register('email', { 
            required: 'Email requis',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email invalide'
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
        <input
          {...register('telephone', { required: 'Téléphone requis' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
          <input
            type="date"
            {...register('dateNaissance')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance</label>
          <input
            {...register('lieuNaissance')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
          <select
            {...register('nationalite')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Sénégalaise">Sénégalaise</option>
            <option value="Mauritanienne">Mauritanienne</option>
            <option value="Malienne">Malienne</option>
            <option value="Ivoirienne">Ivoirienne</option>
            <option value="Française">Française</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
          <select
            {...register('niveau')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="L1">Licence 1</option>
            <option value="L2">Licence 2</option>
            <option value="L3">Licence 3</option>
            <option value="M1">Master 1</option>
            <option value="M2">Master 2</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
        <select
          {...register('filiere')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Informatique">Informatique</option>
          <option value="Gestion">Gestion</option>
          <option value="Droit">Droit</option>
          <option value="Médecine">Médecine</option>
          <option value="Ingénierie">Ingénierie</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
        <textarea
          {...register('adresse')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
        >
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Enregistrement...' : initialData ? 'Modifier' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}