'use client'

import {cn} from '@/lib/utils'
import type {PbBlockQuote} from '@/sanity.types'

export default function BlockQuote({block}: {block: PbBlockQuote}) {
  const {quoteText, quoteCredit, showQuoteMarks, textStyle} = block
  const quote = showQuoteMarks ? `“${quoteText}”` : quoteText
  const hasCredit = quoteCredit && (quoteCredit.name || quoteCredit.subtitle)
  if (!quoteText) return null

  return (
    <div className="@container relative flex flex-col gap-gut-50">
      <div
        className={cn(
          'text-pretty text-sage-800 indent-[1.25em] @7xl:indent-200',
          textStyle || 'ts-quote',
        )}
      >
        {quote || ''}
      </div>
      {hasCredit && (
        <div className="@7xl:absolute @7xl:top-9 @9xl:top-12 @10xl:top-14 @7xl:w-200 @7xl:pr-24 text-balance">
          <div className="ts-h6">{quoteCredit.name}</div>
          <div className="ts-p-xs">{quoteCredit.subtitle}</div>
        </div>
      )}
    </div>
  )
}
