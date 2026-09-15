import {cn} from '@/lib/utils'

export default function SepiaOverlays({
  colorTone,
  className,
}: {
  colorTone?: string
  className?: string
}) {
  if (!colorTone || colorTone === 'original') return null
  return (
    <>
      <div
        className={cn(
          'absolute inset-0 pointer-events-none z-1 bg-black mix-blend-color',
          className,
        )}
      />
      {colorTone === 'green' && (
        <div
          className={cn(
            'absolute inset-0 pointer-events-none z-1 bg-photo-tint mix-blend-screen',
            className,
          )}
        />
      )}
    </>
  )
}
