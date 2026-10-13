'use client'
import {cn} from '@/lib/utils'
import {PbCarouselSection} from '@/types'
import {EmblaOptionsType} from 'embla-carousel'
import Accessibility from 'embla-carousel-accessibility'
import useEmblaCarousel from 'embla-carousel-react'
import {Image as SanityImageType} from 'sanity'
import {useAccessibility} from '../events/EventsCarouselAccessibility'
import {DotButton, useDotButton} from '../events/EventsCarouselDotButton'
import ImageBasic from '../shared/ImageBasic'
import SiteGrid from '../shared/SiteGrid'
import SiteWidth from '../shared/SiteWidth'
import ToneOverlays from '../shared/ToneOverlays'
import BlockQuote from './BlockQuote'
import BlockText from './BlockText'
import {useSanityDataAttribute} from './SanityVisualEditingContext'

type PbCarouselSlide = NonNullable<PbCarouselSection['slides']>[number]

export default function SectionCarousel({section}: {section: PbCarouselSection}) {
  const {slides} = section
  const {path: sectionPath} = useSanityDataAttribute()
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
  ])

  const {selectedIndex, scrollSnaps, onDotButtonClick} = useDotButton(emblaApi)

  useAccessibility(emblaApi)

  // Skip if no slides yet
  if (!slides || slides.length === 0) {
    return null
  }

  return (
    <SiteWidth className="relative">
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container flex -ml-gut touch-pan-y touch-pinch-zoom select-none cursor-grab active:cursor-grabbing">
            {slides?.map((slide, index) => (
              <div
                key={slide._key}
                className={`embla__slide grow-0 shrink-0 basis-10/12 md:basis-${slide.slideWidthDesktop > 5 ? 9 : 6}/12 lg:basis-${slide.slideWidthDesktop}/12 min-w-0 pl-gut`}
              >
                <SlideContent slide={slide} isActive={index === selectedIndex} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-gut">
          {scrollSnaps.length > 1 && (
            <div className="embla__dots">
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={cn(
                    'embla__dot',
                    'size-10 xl:size-12 rounded-full border-sage-800 border',
                    index === selectedIndex && 'current',
                  )}
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

function SlideContent({slide, isActive}: {slide: PbCarouselSlide; isActive: boolean}) {
  const {yAlignment, slideBlocks} = slide
  return (
    <div
      className={cn(
        'h-full flex flex-col gap-gut-50',
        yAlignment === 'self-start' && 'justify-start',
        yAlignment === 'self-center' && 'justify-center',
        yAlignment === 'self-end' && 'justify-end',
      )}
    >
      {slideBlocks?.map((block) => (
        <div key={block._key}>
          {block._type === 'pbBlockText' ? (
            <BlockText block={block} />
          ) : block._type === 'imageBasic' ? (
            <div className="relative group">
              <ImageBasic
                image={block.image as SanityImageType}
                alt={block.image?.alt || ''}
                sizes="100vw"
                ratio={block.imageCrop || 0}
                maxDimension={1000}
                className={cn(
                  'transition-all duration-300',
                  isActive && 'brightness-110 contrast-110',
                )}
              />
              <ToneOverlays
                colorTone="green"
                className={cn('transition-opacity duration-300', isActive && 'opacity-0')}
              />
            </div>
          ) : block._type === 'pbBlockQuote' ? (
            <BlockQuote block={block} />
          ) : null}
        </div>
      ))}
    </div>
  )
}

function GridDebug() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <SiteWidth className="h-full">
        <SiteGrid className="h-full">
          {Array.from({length: 12}, (_, index) => index + 1).map((col) => (
            <div key={col} className="bg-red-500/7 h-full w-full min-h-1"></div>
          ))}
        </SiteGrid>
      </SiteWidth>
    </div>
  )
}
