import {cn, imgSizesFormat} from '@/lib/utils'
import type {PbEventsCarouselSection} from '@/types'
import Button from '../shared/Button'
import ImageBasic from '../shared/ImageBasic'
import {formatDate, Tag} from './EventCard'

export type EventSlideType = NonNullable<NonNullable<PbEventsCarouselSection['events']>[number]>

export default function EventSlide({event}: {event: EventSlideType}) {
  const {title, subtitle, date, tags, link, locations, btnText, thumbnailMain, thumbnailBook} =
    event
  const hasLink = Boolean(link && link.linkType && link.path)
  const href = hasLink && (link?.linkType === 'sitePage' ? `/${link?.path}` : link?.path)

  return (
    <div className="md:grid md:grid-cols-12 bg-sage-900">
      {thumbnailMain && (
        <div className="md:hidden">
          <ImageBasic
            image={thumbnailMain}
            alt={thumbnailMain.alt || title}
            ratio={2}
            sizes="88vw"
            maxDimension={600}
          />
        </div>
      )}
      {thumbnailMain && (
        <div className="max-md:hidden col-span-4">
          <ImageBasic
            image={thumbnailMain}
            alt={thumbnailMain.alt || title}
            ratio={1}
            sizes="31vw"
            maxDimension={1000}
          />
        </div>
      )}
      <div className="col-span-8 flex flex-col justify-between gap-gut-50 max-md:min-h-250">
        <div className="flex justify-between items-center gap-gut pt-gut-50 px-gut-50 md:pl-gut">
          <p className="ts-h5 text-sage-100">
            <span className="lg:hidden">{formatDate(date).short}</span>
            <span className="max-lg:hidden">{formatDate(date).long}</span>
          </p>
          <div className="flex flex-row gap-gut-25">
            {locations &&
              locations.map((location) => (
                <Tag
                  key={location.slug}
                  text={location.title || location.slug}
                  className="border bg-offwhite border-offwhite"
                />
              ))}
            {tags &&
              tags.map((tag) => (
                <Tag
                  key={tag.slug}
                  text={tag.title || tag.slug}
                  className="border border-bg-subtle bg-bg-subtle"
                />
              ))}
          </div>
        </div>

        <div
          className={cn(
            'text-sage-100 px-gut-50 md:px-gut lg:flex lg:flex-row lg:gap-gut',
            !href && 'pb-gut',
          )}
        >
          {thumbnailBook && (
            <div className="max-lg:hidden shrink-0 grow-0 basis-1/8">
              <ImageBasic
                image={thumbnailBook}
                alt={thumbnailBook.alt || 'Book Cover'}
                sizes="7vw"
                maxDimension={200}
              />
            </div>
          )}
          <div className="flex flex-1 flex-col gap-gut-33 lg:gap-gut-25 self-center">
            <div className="ts-h2 text-balance line-clamp-2 mt-[-.15em]">{title}</div>
            {subtitle && (
              <div className="max-lg:flex gap-gut-66">
                {thumbnailBook && (
                  <div className="lg:hidden shrink-0 grow-0 basis-1/10 md:basis-1/14 lg:basis-1/8">
                    <ImageBasic
                      image={thumbnailBook}
                      alt={thumbnailBook.alt || 'Book Cover'}
                      sizes={imgSizesFormat(8, 4, null)}
                      maxDimension={80}
                    />
                  </div>
                )}
                <div className="ts-p-sm text-pretty line-clamp-3 max-w-max-ch self-center">
                  {subtitle}
                </div>
              </div>
            )}
          </div>
        </div>

        {href && <Button path={href} text={btnText || 'Learn More'} />}
      </div>
    </div>
  )
}
