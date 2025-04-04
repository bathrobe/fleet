'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/ui/select'
import { SynthesisMethod } from '../actions/synthesisMethods'

type SynthesisMethodSelectProps = {
  methods: SynthesisMethod[]
  selectedMethod: SynthesisMethod | null
  onMethodChange: (method: SynthesisMethod) => void
  loading?: boolean
}

export function SynthesisMethodSelect({
  methods,
  selectedMethod,
  onMethodChange,
  loading = false,
}: SynthesisMethodSelectProps) {
  const handleChange = (value: string) => {
    const method = methods.find((m) => m.id === value)
    if (method) {
      onMethodChange(method)
    }
  }

  return (
    <Select
      value={selectedMethod?.id}
      onValueChange={handleChange}
      disabled={loading || methods.length === 0}
    >
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select synthesis method" />
      </SelectTrigger>
      <SelectContent>
        {methods.map((method) => (
          <SelectItem key={method.id} value={method.id}>
            {method.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
