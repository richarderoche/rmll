'use client'

import { cn } from '@/lib/utils'
import type { PbBlockText } from '@/sanity.types'

export default function BlockText({ block }: { block: PbBlockText }) {
  return (
    <div
      className={cn(
        block.textStyle || 'ts-p-md',
        block.color,
        block.balanceLines ? 'text-balance' : 'text-pretty'
      )}
    >
      {block.textContent || ''}
    </div>
  )
}
