'use client'

import ImageBasic from '@/components/shared/ImageBasic'
import {usePrefersReducedMotion} from '@/lib/hooks'
import {cn, imgSizesFormat} from '@/lib/utils'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {useRef} from 'react'
import {Image as SanityImageType} from 'sanity'

const DURATION = 1.4
const STAGGER = 0.2
const EASE = 'power3.out'
const MOVE_OFFSET = '0.25em'
const IMAGE_SCALE_FROM = 0.95

/** Opacity only in CSS; motion start values live in `heroHiddenStyle` + GSAP. */
const heroHiddenStyle = (
  motion: 'edition' | 'newsletter' | 'image',
  reducedMotion: boolean,
): React.CSSProperties | undefined => {
  if (reducedMotion) return undefined
  if (motion === 'edition') return {transform: `translateX(${MOVE_OFFSET})`}
  if (motion === 'newsletter') return {transform: `translateX(-${MOVE_OFFSET})`}
  if (motion === 'image') return {transform: `scale(${IMAGE_SCALE_FROM})`}
  return undefined
}

export default function NewsletterHero({
  edition,
  coverImage,
  dataAttribute,
}: {
  edition: string
  coverImage: SanityImageType
  dataAttribute?: string
}) {
  const scopeRef = useRef<HTMLDivElement>(null)
  const editionRef = useRef<HTMLSpanElement>(null)
  const newsletterRef = useRef<HTMLSpanElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion() ?? false
  const coverImageKey = coverImage?.asset?._ref ?? ''

  useGSAP(
    () => {
      const editionEl = editionRef.current
      const newsletterEl = newsletterRef.current
      const imageEl = imageRef.current
      if (!editionEl || !newsletterEl || !imageEl) return

      gsap.set(editionEl, {
        opacity: 0,
        x: reducedMotion ? 0 : MOVE_OFFSET,
      })
      gsap.set(newsletterEl, {
        opacity: 0,
        x: reducedMotion ? 0 : `-${MOVE_OFFSET}`,
      })
      gsap.set(imageEl, {
        opacity: 0,
        scale: reducedMotion ? 1 : IMAGE_SCALE_FROM,
        transformOrigin: 'center center',
      })

      gsap
        .timeline()
        .to(editionEl, {
          opacity: 1,
          x: 0,
          duration: DURATION,
          ease: EASE,
        })
        .to(
          newsletterEl,
          {
            opacity: 1,
            x: 0,
            duration: DURATION,
            ease: EASE,
          },
          `<${STAGGER}`,
        )
        .to(
          imageEl,
          {
            opacity: 1,
            scale: 1,
            duration: DURATION,
            ease: EASE,
          },
          `<${STAGGER}`,
        )
    },
    {
      scope: scopeRef,
      dependencies: [edition, coverImageKey, reducedMotion],
      revertOnUpdate: true,
    },
  )

  return (
    <div ref={scopeRef} className="contents">
      <div className="col-span-12 lg:col-span-5 ts-h1 flex flex-col lg:mt-em relative z-1">
        <span
          ref={editionRef}
          className="opacity-0"
          style={heroHiddenStyle('edition', reducedMotion)}
        >
          {edition}
        </span>
        <span
          ref={newsletterRef}
          className={cn('opacity-0 pl-col-1/6 lg:pl-col-2/5 whitespace-nowrap overflow-visible')}
          style={heroHiddenStyle('newsletter', reducedMotion)}
        >
          Newsletter
        </span>
      </div>
      <div
        ref={imageRef}
        data-sanity={dataAttribute}
        className="opacity-0 col-span-12 lg:col-span-7 aspect-4/3 max-md:-mt-gut-66 max-lg:-mt-gut origin-center"
        style={heroHiddenStyle('image', reducedMotion)}
      >
        <ImageBasic
          className="size-full"
          image={coverImage as SanityImageType}
          alt={(coverImage?.alt ?? `Cover image from ${edition}`) as string}
          ratio={4 / 3}
          sizes={imgSizesFormat(88, 93, 46)}
          priority={true}
          maxDimension={640}
        />
      </div>
    </div>
  )
}
