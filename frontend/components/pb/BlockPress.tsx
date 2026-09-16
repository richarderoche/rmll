'use client'

import {cn} from '@/lib/utils'
import type {PbBlockPress} from '@/sanity.types'
import Link from 'next/link'
import IconArrowUpRight from '../icons/IconArrowUpRight'
import {ButtonInner} from '../shared/Button'
import ImageBasic from '../shared/ImageBasic'
import ToneOverlays from '../shared/ToneOverlays'

export default function BlockPress({block, trueSizes}: {block: PbBlockPress; trueSizes: string}) {
  const {format = 'textOnly', title, source, logo, url, image} = block
  if (!title || !url) return null

  if (format === 'textOnly') {
    return (
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="@container flex flex-col gap-gut-25 p-gut-33 hover:bg-bg-subtle transition-colors corner group"
      >
        {source && (
          <div className="ts-h6 text-sage-800 group-hover:text-body transition-colors">
            {source}
          </div>
        )}
        <div className={cn('@xs:px-gut-33 ts-p-lg text-pretty')}>{title || ''}</div>
      </Link>
    )
  }

  return (
    <div className="flex flex-col gap-gut-33 py-gut-25">
      {logo && (
        <div className="max-w-200">
          <ImageBasic image={logo} alt={source || 'Source Logo'} sizes="200px" maxDimension={200} />
        </div>
      )}
      {!logo && source && <div className="ts-h6 text-sage-800">{source}</div>}
      <Link href={url} target="_blank" rel="noopener noreferrer" className="ts-h4 text-pretty">
        {title || ''}
      </Link>
      {image && (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col group"
          aria-hidden="true"
        >
          <div className="aspect-5/2 relative w-full overflow-hidden">
            <div className="absolute -inset-1 transition-transform ease-gleasing duration-400 group-hover:scale-105">
              <ImageBasic
                image={image}
                alt={title || ''}
                ratio={5 / 2}
                sizes={trueSizes}
                maxDimension={600}
                fitTo="manual"
                className="block h-full w-full max-w-none object-cover"
              />
            </div>
            <ToneOverlays
              colorTone="green"
              className="opacity-0 group-hover:opacity-100 transition-opacity ease-gleasing duration-400"
            />
          </div>
          <div className="ts-h5 py-button-y px-button-x bg-olive group-hover:bg-sage-800 group-hover:text-bg transition-colors ease-gleasing duration-400 flex items-center justify-between">
            <ButtonInner text="Read More" />
            <IconArrowUpRight className="size-18" />
          </div>
        </Link>
      )}
    </div>
  )
}
