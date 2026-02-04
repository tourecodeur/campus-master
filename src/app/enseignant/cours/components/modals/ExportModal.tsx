'use client'

import { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Download } from 'lucide-react'

type ExportFormat = 'CSV' | 'JSON'

type Props = {
  isOpen: boolean
  onClose: () => void
  title?: string
  defaultFormat?: ExportFormat
  onExport: (format: ExportFormat) => Promise<void> | void
}

export default function ExportModal({ isOpen, onClose, title = 'Exporter', defaultFormat = 'CSV', onExport }: Props) {
  const [format, setFormat] = useState<ExportFormat>(defaultFormat)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormat(defaultFormat)
      setLoading(false)
    }
  }, [isOpen, defaultFormat])

  const handleExport = async () => {
    setLoading(true)
    try {
      await onExport(format)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const canExport = useMemo(() => !!format, [format])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="CSV">CSV</option>
            <option value="JSON">JSON</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleExport} disabled={!canExport || loading}>
            <Download className="w-4 h-4 mr-2" />
            {loading ? 'Export...' : 'Exporter'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
