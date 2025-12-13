// components/ui/AddButton.tsx
import { Plus } from 'lucide-react'

interface AddButtonProps {
  onClick: () => void
  label: string
  className?: string
}

export default function AddButton({ onClick, label, className = '' }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center font-medium shadow-md ${className}`}
    >
      <Plus className="w-5 h-5 mr-2" />
      {label}
    </button>
  )
}
