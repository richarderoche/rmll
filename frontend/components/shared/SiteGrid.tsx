import {cn} from '@/lib/utils'

interface SiteGridProps {
  children: React.ReactNode
  className?: string
  yGaps?: boolean
  yAlignment?: string
}

export default function SiteGrid({children, className, yGaps = false, yAlignment}: SiteGridProps) {
  const gapClasses = yGaps ? 'gap-gut' : 'gap-x-gut'

  return (
    <div className={cn('grid grid-cols-12', gapClasses, yAlignment, className)}>{children}</div>
  )
}
