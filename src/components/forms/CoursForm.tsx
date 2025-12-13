'use client'
import { useForm } from 'react-hook-form'
import { Save, X } from 'lucide-react'
import Button from '@/components/ui/Button'

interface CoursFormData {
  titre: string
  code: string
  description: string
  enseignantId: string
  niveau: string
  semestre: string
  credits: number
  heures: number
  salle: string
  statut: string
}

interface CoursFormProps {
  initialData?: any
  onSubmit: (data: CoursFormData) => void
  onCancel: () => void
}

export default function CoursForm({ initialData, onSubmit, onCancel }: CoursFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CoursFormData>({
    defaultValues: initialData || {
      credits: 3,
      heures: 36,
      semestre: 'S1',
      niveau: 'L1',
      statut: 'actif'
    }
  })

  const enseignants = [
    { id: '1', nom: 'Dr. Diallo Amadou' },
    { id: '2', nom: 'Prof. Ndiaye Fatou' },
    { id: '3', nom: 'Dr. Sow Moussa' },
    { id: '4', nom: 'M. Diop Cheikh' },
    { id: '5', nom: 'Prof. Fall Aïcha' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
          <input
            {...register('code', { required: 'Code requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ALG101"
          />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
          <input
            {...register('titre', { required: 'Titre requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Algorithmique"
          />
          {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Description du cours..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant *</label>
          <select
            {...register('enseignantId', { required: 'Enseignant requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionnez un enseignant</option>
            {enseignants.map((enseignant) => (
              <option key={enseignant.id} value={enseignant.id}>
                {enseignant.nom}
              </option>
            ))}
          </select>
          {errors.enseignantId && <p className="text-red-500 text-xs mt-1">{errors.enseignantId.message}</p>}
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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
          <select
            {...register('semestre')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="S1">Semestre 1</option>
            <option value="S2">Semestre 2</option>
            <option value="S3">Semestre 3</option>
            <option value="S4">Semestre 4</option>
            <option value="S5">Semestre 5</option>
            <option value="S6">Semestre 6</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Crédits</label>
          <input
            type="number"
            min="1"
            max="6"
            {...register('credits', { 
              required: 'Crédits requis',
              min: { value: 1, message: 'Minimum 1 crédit' },
              max: { value: 6, message: 'Maximum 6 crédits' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.credits && <p className="text-red-500 text-xs mt-1">{errors.credits.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Heures</label>
          <input
            type="number"
            min="1"
            max="120"
            {...register('heures', { 
              required: 'Heures requises',
              min: { value: 1, message: 'Minimum 1 heure' },
              max: { value: 120, message: 'Maximum 120 heures' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.heures && <p className="text-red-500 text-xs mt-1">{errors.heures.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
          <input
            {...register('salle')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="A201, Lab Info, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            {...register('statut')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="en attente">En attente</option>
          </select>
        </div>
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
          {isSubmitting ? 'Enregistrement...' : initialData ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}