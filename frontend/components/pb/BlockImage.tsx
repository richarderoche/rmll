'use client'

import {cn} from '@/lib/utils'
import type {PbBlockImage} from '@/sanity.types'
import type {Image as SanityImageType} from 'sanity'
import ImageBasic from '../shared/ImageBasic'
import {SITE_MAX_WIDTH} from '../shared/SiteWidth'

export default function BlockImage({block, trueSizes}: {block: PbBlockImage; trueSizes: string}) {
  return (
    <>
      <div
        className={cn('relative group', !block.disableCorners ? 'corner' : '')}
        style={{
          width: block.imageWidth ? block.imageWidth + '%' : 'auto',
        }}
      >
        <ImageBasic
          image={block.image as SanityImageType}
          alt={block.image?.alt || ''}
          sizes={trueSizes}
          ratio={block.imageCrop || 0}
          priority={block.priority ?? false}
          maxDimension={SITE_MAX_WIDTH / 2}
        />
      </div>
      {block.caption && (
        <div className="ts-p-sm text-pretty text-body-subtle mt-gut-50">{block.caption}</div>
      )}
    </>
  )
}
