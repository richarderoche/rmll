'use client'

import {cn} from '@/lib/utils'
import type {PbBlockImage} from '@/sanity.types'
import type {Image as SanityImageType} from 'sanity'
import ImageBasic from '../shared/ImageBasic'
import ToneOverlays from '../shared/ToneOverlays'

export default function BlockImage({block, trueSizes}: {block: PbBlockImage; trueSizes: string}) {
  const {image, imageWidth, imageCrop, priority, caption, colorTone, screenVisibility} = block
  const {showOnMobile, showOnTablet, showOnDesktop} = screenVisibility || {}
  // For forcing lazy if not visible on all screens
  const visibleOnAllScreens =
    (showOnMobile ?? true) && (showOnTablet ?? true) && (showOnDesktop ?? true)

  return (
    <>
      <div
        className="relative group"
        style={{
          width: imageWidth ? imageWidth + '%' : 'auto',
        }}
      >
        <ImageBasic
          image={image as SanityImageType}
          alt={image?.alt || ''}
          sizes={trueSizes}
          ratio={imageCrop || 0}
          priority={visibleOnAllScreens ? (priority ?? false) : false}
          maxDimension={1000}
          className={cn(
            colorTone === 'green' ? 'brightness-110 contrast-110' : '',
            colorTone === 'grayscale' ? 'contrast-110' : '',
          )}
        />
        <ToneOverlays colorTone={block.colorTone} />
      </div>
      {caption && <div className="ts-p-sm text-pretty text-body-subtle mt-gut-50">{caption}</div>}
    </>
  )
}
