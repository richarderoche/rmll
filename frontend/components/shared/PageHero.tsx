'use client'
import {useStore} from '@/lib/store'
import {cn} from '@/lib/utils'
import type {PageHero as PageHeroType} from '@/sanity.types'
import {useGSAP} from '@gsap/react'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/all'
import {useWindowSize} from 'hamo'
import Image from 'next/image'
import {useRef, useState} from 'react'
import {CustomPortableText} from './CustomPortableText'
import PageHeroPicture from './PageHeroPicture'
import RichTextWrap from './RichTextWrap'
import SiteGrid from './SiteGrid'
import SiteWidth from './SiteWidth'

gsap.registerPlugin(ScrollTrigger)

const SCROLL = 1000 // px of scroll for segment + image clip
const INTRO_OVERLAP = SCROLL / 5
const INTRO_BOTTOM = 0.2 // intro bottom rests this fraction of the viewport up from the screen bottom

export default function PageHero({enableHero, hero}: {enableHero: boolean; hero: PageHeroType}) {
  const {headingColor, headingSegments, image, introText, filmStrip} = hero || {}
  const hasHeading = headingSegments && headingSegments.length > 0
  const hasIntroText = introText && introText.length > 0
  // Empty Sanity image objects are truthy but have no asset — treat as missing
  const hasImage = Boolean(image?.asset?._ref)

  const ref = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const {width: winW, height: winH} = useWindowSize(250)
  const setPauseLenis = useStore((state) => state.setPauseLenis)
  const bumpHeroPinEpoch = useStore((state) => state.bumpHeroPinEpoch)
  const [entranceDone, setEntranceDone] = useState(false)

  const useScrollHero = Boolean(winW && winW >= 1024 && !filmStrip)

  // Entrance
  useGSAP(
    () => {
      setPauseLenis(true)

      const mm = gsap.matchMedia()
      mm.add(
        {
          all: 'all',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const {reduceMotion} = context.conditions as {reduceMotion: boolean}

          gsap.set(ref.current, {visibility: 'visible'})

          //if (!hero) return

          const tl = gsap.timeline({
            defaults: {ease: 'expo.out'},
            onComplete: () => {
              setPauseLenis(false)
              setEntranceDone(true)
            },
          })
          tl.from('.gs-image-wrapper', {
            autoAlpha: 0,
            scale: 0.9,
            duration: 1.2,
          })
          if (hasHeading) {
            tl.from(
              '.gs-segment',
              {
                x: reduceMotion ? 0 : 30,
                autoAlpha: 0,
                stagger: reduceMotion ? 0 : 0.15,
                duration: 1,
                ease: 'power2.inOut',
              },
              '< .3',
            )
          }
        },
      )

      return () => {
        mm.revert()
        setPauseLenis(false)
      }
    },
    {scope: ref},
  )

  // Scroll
  useGSAP(
    () => {
      if (!entranceDone || winW == null || winH == null) return

      const mm = gsap.matchMedia()
      mm.add(
        {
          isWide: '(min-width: 1024px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const {isWide, reduceMotion} = context.conditions as {
            isWide: boolean
            reduceMotion: boolean
          }

          if (!isWide || filmStrip || reduceMotion) return

          const stage = stageRef.current
          const container = ref.current?.querySelector('.gs-segments')
          const segments = gsap.utils.toArray<HTMLElement>('.gs-segment')
          const imageWrapper = ref.current?.querySelector<HTMLElement>('.gs-image-wrapper')
          const clipRef = ref.current?.querySelector<HTMLElement>('.gs-clip-ref')
          const intro = ref.current?.querySelector<HTMLElement>('.gs-intro-text')
          if (!stage || !imageWrapper || !intro) return

          // Timeline units === scroll px so intro travel is 1:1 with scroll.
          const getIntroY = () => {
            if (!intro) return 0
            const currentY = Number(gsap.getProperty(intro, 'y'))
            const layoutBottom = intro.getBoundingClientRect().bottom - currentY
            return window.innerHeight * (1 - INTRO_BOTTOM) - layoutBottom
          }
          const getIntroTravel = () => Math.abs(getIntroY())
          const introStart = SCROLL - INTRO_OVERLAP
          const getPinDistance = () =>
            intro ? Math.max(SCROLL, introStart + getIntroTravel()) : SCROLL

          let introTween: gsap.core.Tween | undefined

          const scrollTl = gsap.timeline({
            defaults: {ease: 'none'},
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: () => `+=${getPinDistance()}`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
              refreshPriority: -1,
              onRefresh: () => {
                introTween?.duration(getIntroTravel())
              },
            },
          })

          segments.forEach((segment) => {
            if (!container) return

            scrollTl.fromTo(
              segment,
              {x: 0},
              {
                x: () => {
                  const currentX = Number(gsap.getProperty(segment, 'x'))
                  const layoutLeft = segment.getBoundingClientRect().left - currentX
                  return container.getBoundingClientRect().left - layoutLeft
                },
                duration: SCROLL,
              },
              0,
            )
          })

          if (imageWrapper && clipRef) {
            scrollTl.fromTo(
              imageWrapper,
              {clipPath: 'inset(0 0px 0 0)'},
              {
                clipPath: () => {
                  const rect = imageWrapper.getBoundingClientRect()
                  const scale = Number(gsap.getProperty(imageWrapper, 'scale')) || 1
                  const layoutWidth = imageWrapper.offsetWidth
                  const layoutRight = rect.left - (layoutWidth * (1 - scale)) / 2 + layoutWidth
                  const insetRight = Math.max(
                    0,
                    layoutRight - clipRef.getBoundingClientRect().right,
                  )
                  return `inset(0 ${insetRight}px 0 0)`
                },
                duration: SCROLL,
              },
              0,
            )
          }

          if (intro) {
            scrollTl.fromTo(
              intro,
              {autoAlpha: 0, y: 0},
              {
                autoAlpha: 1,
                y: getIntroY,
                duration: getIntroTravel(),
              },
              introStart,
            )
            const children = scrollTl.getChildren(false, true, false)
            introTween = children[children.length - 1] as gsap.core.Tween
          }

          // Rebuild Revealers after pin spacer exists so their starts are correct
          requestAnimationFrame(() => {
            ScrollTrigger.refresh()
            bumpHeroPinEpoch()
          })
        },
      )

      return () => mm.revert()
    },
    {
      scope: ref,
      revertOnUpdate: true,
      dependencies: [hero, entranceDone, winW, winH, bumpHeroPinEpoch],
    },
  )

  if (!enableHero) return null

  return (
    <div ref={ref} className="invisible">
      <div
        ref={stageRef}
        className={cn('relative', useScrollHero && 'lg:h-screen lg:overflow-hidden')}
      >
        <div className="relative">
          <div className="gs-image-wrapper">
            {hasImage ? (
              <PageHeroPicture image={image} />
            ) : (
              <Image
                src="/hero-fallback.jpg"
                alt=""
                width={1920}
                height={1080}
                priority
                className="hero-image object-cover w-full h-screen"
              />
            )}
          </div>
          {hasHeading && (
            <div className="absolute inset-0 z-5 flex items-end">
              <SiteWidth className={cn(headingColor, 'ts-h1 ')}>
                <div className="gs-segments flex flex-col pb-header">
                  {headingSegments.map((segment) => {
                    const {_key, text, alignment, indent} = segment
                    return (
                      <div
                        className={cn(
                          'gs-segment',
                          alignment === 'right' ? 'self-end' : 'self-start',
                          indent && alignment === 'right' && 'mr-sm-col lg:mr-col-2',
                          indent && alignment === 'left' && 'ml-sm-col lg:ml-col-2',
                          'inline-flex w-content whitespace-nowrap',
                        )}
                        key={_key}
                      >
                        {text}
                      </div>
                    )
                  })}
                </div>
              </SiteWidth>
            </div>
          )}
        </div>
        <div
          className={cn(
            'gs-intro-text pointer-events-none z-10',
            useScrollHero ? 'lg:absolute lg:inset-x-0 lg:top-full' : 'max-lg:mt-header-2',
            'lg:motion-reduce:static lg:motion-reduce:mt-header-2',
          )}
        >
          <SiteWidth className="w-full">
            <SiteGrid>
              <div
                className={cn(
                  'max-lg:mt-header-2 lg:motion-reduce:mt-header-2 col-span-12 md:col-span-7 lg:col-span-4 pointer-events-auto',
                  filmStrip ? 'lg:col-start-8' : 'lg:col-start-9',
                )}
              >
                {hasIntroText ? (
                  <RichTextWrap>
                    <CustomPortableText value={introText} />
                  </RichTextWrap>
                ) : (
                  <div className="ts-p-sm">
                    <p>Add content in the CMS to override this placeholder image and text.</p>
                  </div>
                )}
              </div>
              <div className="gs-clip-ref lg:col-span-7"></div>
            </SiteGrid>
          </SiteWidth>
        </div>
      </div>
    </div>
  )
}
