'use client'
import {cn} from '@/lib/utils'
import {Select} from '@base-ui/react/select'
import IconCaret from '../icons/IconCaret'
import IconCheck from '../icons/IconCheck'

export type SelectOption = {
  value: string
  label: string
}

export type SelectProps = {
  label: string
  /** `null` means the empty option (“All”) is selected. */
  value: SelectOption | null
  onValueChange: (next: string | null) => void
  options: SelectOption[]
  includeAllOption?: boolean
  emptyLabel?: string | null
  className?: string
  colorClasses?: string
}

export default function SelectComponent({
  label,
  value,
  onValueChange,
  options,
  includeAllOption = false,
  emptyLabel = 'All',
  colorClasses = 'bg-bg-subtle',
  className,
}: SelectProps) {
  const allOptionLabel = emptyLabel ?? 'All'
  const listItems = includeAllOption ? [{value: '', label: allOptionLabel}, ...options] : options
  const rootValue = value?.value ?? (includeAllOption ? '' : null)

  return (
    <div className={cn('flex flex-col w-full', colorClasses, className)}>
      <Select.Root
        items={listItems}
        value={rootValue}
        onValueChange={(v) => onValueChange(v === '' ? null : v)}
        modal={false}
      >
        <Select.Label className="sr-only">{label}</Select.Label>
        <Select.Trigger className="flex w-full max-w-full items-center justify-between gap-[.2em] text-left ts-h5 py-button-y px-button-x">
          <Select.Value placeholder={emptyLabel ?? 'Select an option'}>
            {(selectedValue) => {
              const placeholder = emptyLabel ?? 'Select an option'
              const isEmpty =
                selectedValue == null ||
                selectedValue === '' ||
                (Array.isArray(selectedValue) && selectedValue.length === 0)

              if (isEmpty) {
                if (includeAllOption) {
                  return `${label}: ${allOptionLabel}`
                }
                return placeholder
              }

              const activeLabel =
                listItems.find((option) => option.value === selectedValue)?.label ??
                String(selectedValue)

              return `${label}: ${activeLabel}`
            }}
          </Select.Value>
          <Select.Icon>
            <IconCaret className="size-18" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className="outline-hidden select-none" alignItemWithTrigger={false}>
            <Select.Popup
              className={cn(
                'max-h-[min(18rem,40vh)] min-w-(--anchor-width) overflow-auto',
                'transition-all origin-top duration-400 ease-gleasing',
                'data-ending-style:translate-y-none data-ending-style:opacity-1 data-starting-style:-translate-y-button-y data-starting-style:opacity-0',
                colorClasses,
              )}
            >
              <Select.List>
                {listItems.map(({label, value}) => (
                  <Select.Item
                    key={value === '' ? '__all__' : value}
                    value={value}
                    className="ts-h5 flex justify-between gap-[.2em] items-center cursor-pointer py-button-y px-button-x text-left hover:bg-olive"
                  >
                    <Select.ItemText className="col-start-1">{label}</Select.ItemText>
                    <Select.ItemIndicator className="col-start-2">
                      <IconCheck className="size-18" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}
