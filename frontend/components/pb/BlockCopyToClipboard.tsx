'use client'

import {cn} from '@/lib/utils'
import type {PbBlockCopyToClipboard} from '@/sanity.types'
import {useState} from 'react'
import IconCheck from '../icons/IconCheck'
import IconCopy from '../icons/IconCopy'
import {ButtonInner} from '../shared/Button'

export default function BlockCopyToClipboard({block}: {block: PbBlockCopyToClipboard}) {
  const {textToCopy = ''} = block
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  if (!textToCopy) return null

  return (
    <button
      type="button"
      className="ts-h5 py-button-y px-button-x bg-bg-subtle hover:bg-olive flex items-center justify-between corner w-full"
      onClick={handleCopy}
      aria-label="Copy email address"
    >
      <ButtonInner text={isCopied ? 'Copied!' : textToCopy} />
      <div className="size-18 grid relative group">
        <IconCopy
          className={cn('grid-stack transition-all', {
            'opacity-0 scale-0': isCopied,
          })}
        />
        <IconCheck
          className={cn('grid-stack transition-all opacity-0 scale-0', {
            'opacity-100 scale-100': isCopied,
          })}
        />
      </div>
    </button>
  )
}
