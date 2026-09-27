import {imgSizesFormat} from '@/lib/utils'
import {resolveHref} from '@/sanity/lib/utils'
import type {PbLatestNewsSection} from '@/types'
import type {Image as SanityImageType} from 'sanity'
import Button from '../shared/Button'
import ImageBasic from '../shared/ImageBasic'
import SiteWidth from '../shared/SiteWidth'

export default function SectionLatestNews({section}: {section: PbLatestNewsSection}) {
  const {slug, title, edition, coverImage, teaserText} = section?.newsletter ?? {}

  if (!section?.newsletter) return null

  return (
    <SiteWidth className="py-gut-50">
      <div className="border-y-2 border-divider border-dotted py-gut grid grid-cols-1 md:grid-cols-12 gap-gut">
        <ImageBasic
          className="aspect-4/3 md:col-span-5 lg:col-span-6"
          image={coverImage as SanityImageType}
          alt={coverImage?.alt ?? `Cover image from ${edition}`}
          ratio={4 / 3}
          sizes={imgSizesFormat(88, 93, 46)}
          priority={section.priority}
          maxDimension={640}
        />
        <div className="md:col-span-7 lg:col-span-6 flex flex-col gap-gut md:justify-between">
          <div className="flex flex-col gap-gut-25">
            <div className="ts-h5">{edition}</div>
            <div className="ts-h2 text-balance md:line-clamp-2 lg:line-clamp-3">{title}</div>
          </div>
          <div className="flex flex-col gap-gut-50">
            {teaserText && (
              <div className="ts-body-serif md:line-clamp-2 lg:line-clamp-6">{teaserText}</div>
            )}
            <Button path={resolveHref('newsletter', slug)} text="Read The Latest" width="full" />
          </div>
        </div>
      </div>
    </SiteWidth>
  )
}
