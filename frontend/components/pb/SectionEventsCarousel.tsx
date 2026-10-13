'use client'

import {cn} from '@/lib/utils'
import type {PbEventsCarouselSection} from '@/types'
import {EmblaOptionsType} from 'embla-carousel'
import Accessibility from 'embla-carousel-accessibility'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import {useEffect} from 'react'
import {useAccessibility} from '../events/EventsCarouselAccessibility'
import {DotButton, useDotButton} from '../events/EventsCarouselDotButton'
import EventSlide, {EventSlideType} from '../events/EventSlide'
import SiteWidth from '../shared/SiteWidth'

const SectionEventsCarousel = ({section}: {section: PbEventsCarouselSection}) => {
  const {title, events} = section
  const options: EmblaOptionsType = {
    loop: true,
    align: 'start',
    breakpoints: {
      '(prefers-reduced-motion: reduce)': {duration: 0},
    },
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Accessibility({
      announceChanges: true,
      rootNode: (emblaRoot) => emblaRoot.parentElement,
    }),
    Autoplay({
      delay: 5000,
    }),
  ])

  const {selectedIndex, scrollSnaps, onDotButtonClick} = useDotButton(emblaApi)

  useAccessibility(emblaApi)

  useEffect(() => {
    if (emblaApi) {
      emblaApi.plugins().autoplay?.play()
    }
  }, [emblaApi])

  return (
    <SiteWidth>
      <div className="embla">
        <div className="embla__viewport overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex -ml-gut touch-pan-y touch-pinch-zoom select-none cursor-grab active:cursor-grabbing">
            {events?.map((event: EventSlideType) => (
              <div
                key={event._id}
                className="embla__slide grow-0 shrink-0 basis-full min-w-0 pl-gut"
              >
                <EventSlide event={event} />
              </div>
            ))}
          </div>
        </div>

        <div className="embla__controls flex gap-gut justify-between items-center mt-gut-50">
          {title && <p className="ts-h6">{title}</p>}
          {scrollSnaps.length > 1 && (
            <div className="embla__dots justify-end">
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={cn('embla__dot', index === selectedIndex && 'current')}
                />
              ))}
            </div>
          )}
        </div>

        <div className="embla__live-region visually-hidden" />
      </div>
    </SiteWidth>
  )
}

export default SectionEventsCarousel
