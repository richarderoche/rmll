import {cn, imgSizesFormat} from '@/lib/utils'
import type {PbEventsFeedSection} from '@/types'
import Link from 'next/link'
import Button from '../shared/Button'
import ImageBasic from '../shared/ImageBasic'

export type EventCardEvent = NonNullable<NonNullable<PbEventsFeedSection['events']>[number]>

export default function EventCard({event}: {event: EventCardEvent}) {
  const {_id, link} = event
  const hasLink = Boolean(link && link.linkType && link.path)
  const href = hasLink && (link?.linkType === 'sitePage' ? `/${link?.path}` : link?.path)
  const contentWrapClasses = 'max-md:pt-gut-50 md:p-gut-33'
  return (
    <div
      data-event-id={_id}
      className="border-divider max-md:border md:border-t-2 md:border-dotted last:md:border-b-2 md:py-gut-50"
    >
      {hasLink && href ? (
        <Link
          className={cn('block group relative z-1', contentWrapClasses)}
          href={href}
          target={link?.linkType === 'externalLink' ? '_blank' : undefined}
          rel={link?.linkType === 'externalLink' ? 'noopener noreferrer' : undefined}
          aria-label={`View event ${event.title}`}
        >
          <EventCardContent event={event} hasLink={hasLink} />
          <div className="max-md:hidden bg-bg-subtle absolute inset-0 -z-1 corner opacity-0 scale-x-99 scale-y-90 group-hover:opacity-100 group-hover:scale-100 transition-all ease-gleasing duration-400 pointer-events-none"></div>
        </Link>
      ) : (
        <div className={cn(contentWrapClasses)}>
          <EventCardContent event={event} hasLink={hasLink} />
        </div>
      )}
    </div>
  )
}

function EventCardContent({event, hasLink}: {event: EventCardEvent; hasLink: boolean}) {
  const {title, subtitle, date, tags, locations, btnText, thumbnailMain, thumbnailBook} = event
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-gut-50 md:gap-gut">
      <div className="md:col-span-8 lg:col-span-9 max-md:px-gut-50">
        <div className="max-md:flex max-md:justify-between md:grid md:grid-cols-8 lg:grid-cols-9 items-center gap-gut mb-gut-50">
          <p className="ts-h5 md:col-span-2 lg:col-span-3">
            <span className="lg:hidden">{formatDate(date).short}</span>
            <span className="max-lg:hidden">{formatDate(date).long}</span>
          </p>
          <div className="md:col-span-6 lg:col-span-5 flex flex-row gap-gut-25">
            {locations &&
              locations.map((location) => Tag(location.title || location.slug, 'border'))}
            {tags &&
              tags.map((tag) =>
                Tag(
                  tag.title || tag.slug,
                  'border border-bg-subtle bg-bg-subtle group-hover:bg-sage-100 group-hover:border-sage-100 transition-colors ease-gleasing duration-400',
                ),
              )}
          </div>
        </div>
        <div className="grid grid-cols-8 lg:grid-cols-9 gap-gut-50 md:gap-gut">
          {thumbnailMain && (
            <div className="md:hidden col-span-3">
              <ImageBasic
                image={thumbnailMain}
                alt={thumbnailMain.alt || 'Main Image'}
                ratio={1.5}
                sizes="25vw"
                maxDimension={300}
              />
            </div>
          )}
          <div className="max-md:hidden md:col-span-2 lg:col-span-3">
            {thumbnailBook && (
              <div className="md:max-w-55 lg:max-w-70">
                <ImageBasic
                  image={thumbnailBook}
                  alt={thumbnailBook.alt || 'Book Cover'}
                  sizes="65px"
                  maxDimension={120}
                />
              </div>
            )}
          </div>
          <div className="col-span-6 md:col-span-6 lg:col-span-5 text-balance max-md:self-center">
            <span className="md:hidden ts-p-lg">{title}</span>
            <span className="max-md:hidden ts-h3 ">{title}</span>
            {subtitle && (
              <p className="ts-p-sm max-md:hidden text-pretty max-w-max-ch mt-em">{subtitle}</p>
            )}
          </div>
          {(subtitle || thumbnailBook) && (
            <div className="md:hidden col-span-9 flex flex-row gap-gut-50">
              {subtitle && <p className="ts-p-sm text-pretty flex-1">{subtitle}</p>}
              {thumbnailBook && (
                <div className="w-50">
                  <ImageBasic
                    image={thumbnailBook}
                    alt={thumbnailBook.alt || 'Book Cover'}
                    sizes="50px"
                    maxDimension={100}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="md:col-span-4 lg:col-span-3">
        {thumbnailMain && (
          <div className="max-md:hidden">
            <ImageBasic
              image={thumbnailMain}
              alt={thumbnailMain.alt || 'Main Image'}
              ratio={16 / 9}
              sizes={imgSizesFormat(28, null, 21)}
              maxDimension={600}
            />
          </div>
        )}
        {hasLink && <Button text={btnText || 'View Event'} width="full" />}
      </div>
    </div>
  )
}

function Tag(text: string, className: string) {
  return (
    <div className={cn('ts-h6 corner w-fit px-[0.5em] py-[0.3em]', className)}>
      <span>{text}</span>
    </div>
  )
}

function formatDate(date: string) {
  const parsed = new Date(date)
  return {
    long: parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    short: parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }
}
