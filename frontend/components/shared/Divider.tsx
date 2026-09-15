import {cn} from '@/lib/utils'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  showDividerLine?: boolean
  size?: number
  sizeBelow?: number
}

export default function Divider({
  showDividerLine = true,
  size = 0,
  sizeBelow = 0,
  className,
  ...props
}: DividerProps) {
  return (
    <div
      style={{
        marginTop: `calc(var(--spacing-gut-50) * ${size})`,
        marginBottom: showDividerLine ? `calc(var(--spacing-gut-50) * ${sizeBelow})` : '0',
      }}
      className={cn(
        'h-2 w-full',
        !showDividerLine && 'opacity-0',
        className ? className : 'border-b-2 border-divider border-dotted',
      )}
      {...props}
    />
  )
}
