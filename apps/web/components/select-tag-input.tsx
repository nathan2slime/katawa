'use client'

import { XIcon } from 'lucide-react'
import * as React from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'

import { cn } from '~/lib/utils'

type Option = {
  label: string
  value: string
}

type SelectTagInputProps = Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> & {
  value: string[]
  onChange: React.Dispatch<React.SetStateAction<string[]>>
  options: Option[]
}

const SelectTagInput = React.forwardRef<HTMLInputElement, SelectTagInputProps>(({ className, value, onChange, options, ...props }, ref) => {
  const [pendingDataPoint, setPendingDataPoint] = React.useState('')
  const [isDropdownOpen, setDropdownOpen] = React.useState(false)

  const addPendingDataPoint = (newOption?: Option) => {
    if (newOption) {
      if (!value.includes(newOption.value)) {
        onChange([...value, newOption.value])
      }
    } else if (pendingDataPoint) {
      const matchedOption = options.find(option => option.label.toLowerCase() === pendingDataPoint.trim().toLowerCase())
      if (matchedOption && !value.includes(matchedOption.value)) {
        onChange([...value, matchedOption.value])
      }
    }
    setPendingDataPoint('')
    setDropdownOpen(false)
  }

  const getLabelByValue = (val: string) => {
    const matchedOption = options.find(option => option.value === val)

    return matchedOption ? matchedOption.label : val
  }

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'focus-visible:outline-none focus-visible:ring focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background min-h-10 flex w-full flex-wrap gap-2 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {value.map(val => (
          <Badge key={val} variant="secondary">
            {getLabelByValue(val)}
            <Button variant="ghost" size="icon" className="ml-2 h-3 w-3" onClick={() => onChange(value.filter(i => i !== val))}>
              <XIcon className="w-3" />
            </Button>
          </Badge>
        ))}
        <input
          className={cn('flex-1 outline-none bg-transparent placeholder:text-muted-foreground')}
          value={pendingDataPoint}
          onChange={e => {
            setPendingDataPoint(e.target.value)
            setDropdownOpen(true)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              addPendingDataPoint()
            } else if (e.key === 'Backspace' && pendingDataPoint.length === 0 && value.length > 0) {
              e.preventDefault()
              onChange(value.slice(0, -1))
            }
          }}
          onBlur={() => setDropdownOpen(false)}
          {...props}
          ref={ref}
        />
      </div>
      {isDropdownOpen && pendingDataPoint && (
        <ul className="absolute z-10 left-0 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover py-1 text-base  ring-1 ring-ring focus:outline-none sm:text-sm">
          {options.filter(option => option.label.toLowerCase().includes(pendingDataPoint.toLowerCase()) && !value.includes(option.value)).length > 0 ? (
            options
              .filter(option => option.label.toLowerCase().includes(pendingDataPoint.toLowerCase()) && !value.includes(option.value))
              .map(option => (
                <li
                  key={option.value}
                  className="cursor-pointer select-none px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => addPendingDataPoint(option)}
                >
                  {option.label}
                </li>
              ))
          ) : (
            <li className="cursor-not-allowed select-none px-4 py-2 text-muted-foreground">No options found</li>
          )}
        </ul>
      )}
    </div>
  )
})

SelectTagInput.displayName = 'SelectTagInput'

export { SelectTagInput }
