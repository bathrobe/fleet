'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/(frontend)/ui/select'
import { ideationMethods, IdeationMethod } from '@/app/(frontend)/lib/ideation-methods'

type IdeationMethodSelectProps = {
  selectedMethod: IdeationMethod
  onMethodChange: (method: IdeationMethod) => void
}

export function IdeationMethodSelect({
  selectedMethod,
  onMethodChange,
}: IdeationMethodSelectProps) {
  const handleChange = (value: string) => {
    const method = ideationMethods.find((m) => m.id === value)
    if (method) {
      onMethodChange(method)
    }
  }

  return (
    <Select value={selectedMethod.id} onValueChange={handleChange}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select method" />
      </SelectTrigger>
      <SelectContent>
        {ideationMethods.map((method) => (
          <SelectItem key={method.id} value={method.id}>
            {method.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
