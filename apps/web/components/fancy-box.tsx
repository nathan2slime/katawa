'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '~/lib/utils'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Separator } from '~/components/ui/separator'

const badgeStyle = (color: string) => ({
  borderColor: `${color}20`,
  backgroundColor: `${color}30`,
  color
})

export type Item = {
  value: string
  label: string
  color: string
}

type Props = {
  values: Item[]
  setInputValue: (value: string) => void
  selectedValues: Item[]
  setSelectedValues: (item: Item[], id: string, status: 'deleted' | 'created') => void
}

export function FancyBox({ values, selectedValues, setSelectedValues, setInputValue }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [openCombobox, setOpenCombobox] = React.useState(false)

  const toggleItem = (item: Item) => {
    const isInclude = !!selectedValues.find(e => e.value === item.value)

    const newList = isInclude ? selectedValues.filter(l => l.value !== item.value) : [...selectedValues, item]

    setSelectedValues(newList, item.value, isInclude ? 'deleted' : 'created')
    inputRef?.current?.focus()
  }

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur()
    setOpenCombobox(value)
  }

  return (
    <div className="max-w-full">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" aria-expanded={openCombobox} className="w-full justify-between text-foreground">
            <span className="truncate">
              {selectedValues.length === 0 && 'Select roles'}
              {selectedValues.length === 1 && selectedValues[0]?.label}
              {selectedValues.length === 2 && selectedValues.map(({ label }) => label).join(', ')}
              {selectedValues.length > 2 && `${selectedValues.length} roles selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2">
          <Input placeholder="Search items" onChange={e => setInputValue(e.target.value)} />

          <Separator className="my-2" />

          <div className="flex flex-col gap-1">
            {values.map(item => {
              const isActive = !!selectedValues.find(({ value }) => item.value === value)

              return (
                <div
                  key={`${item.value}list`}
                  className="flex text-sm hover:bg-secondary/80 rounded-lg cursor-pointer items-center gap-1 py-1 px-2"
                  onClick={() => toggleItem(item)}
                >
                  <Check className={cn('mr-2 h-4 w-4', isActive ? 'opacity-100' : 'opacity-0')} />
                  <div className="flex-1">{item.label}</div>
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
      <div className="relative flex gap-1 mt-2 overflow-y-auto">
        {selectedValues.map(({ label, value, color }) => (
          <Badge key={value} variant="outline" style={badgeStyle(color)}>
            {label}
          </Badge>
        ))}
      </div>
    </div>
  )
}
