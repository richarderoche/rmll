'use client'
import {useStore} from '@/lib/store'
import {cn} from '@/lib/utils'
import type {PageHero as PageHeroType} from '@/sanity.types'
import {useGSAP} from '@gsap/react'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/all'
import {useWindowSize} from 'hamo'
import {useRef, useState} from 'react'
import {CustomPortableText} from './CustomPortableText'
import PageHeroPicture from './PageHeroPicture'
import RichTextWrap from './RichTextWrap'
import SiteGrid from './SiteGrid'
import SiteWidth from './SiteWidth'

gsap.registerPlugin(ScrollTrigger)

export default function PageHero({enableHero, hero}: {enableHero: boolean; hero: PageHeroType}) {
  const {headingColor, headingSegments, image, introText, filmStrip} = hero || {}
  const hasHeading = headingSegments && headingSegments.length > 0
  const hasIntroText = introText && introText.length > 0

  const ref = useRef<HTMLDivElement>(null)
  const {width: winW, height: winH} = useWindowSize(250)
  const setPauseLenis = useStore((state) => state.setPauseLenis)
  const [entranceDone, setEntranceDone] = useState(false)

  // Entrance — only rebuilds when hero changes (not on resize)
  useGSAP(
    () => {
      if (!hero) return

      setEntranceDone(false)
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
        },
      )

      return () => {
        mm.revert()
        setPauseLenis(false)
      }
    },
    {scope: ref, revertOnUpdate: true, dependencies: [hero, setPauseLenis]},
  )

  // Scroll — waits for entrance; rebuilds on hero + viewport size
  useGSAP(
    () => {
      if (!hero || !entranceDone || winW == null || winH == null) return

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

          if (!isWide || hero.filmStrip || reduceMotion) return

          const SCROLL = 1000 // Text + Image Clip Length
          const INTRO_OVERLAP = SCROLL / 5
          const INTRO_BOTTOM = 0.2 // percentage from screen bottom
          const container = ref.current?.querySelector('.gs-segments')
          const segments = gsap.utils.toArray<HTMLElement>('.gs-segment')
          const imageWrapper = ref.current?.querySelector<HTMLElement>('.gs-image-wrapper')
          const clipRef = ref.current?.querySelector<HTMLElement>('.gs-clip-ref')
          const intro = ref.current?.querySelector<HTMLElement>('.gs-intro-text')
          if (!segments.length && !(imageWrapper && clipRef) && !intro) return

          // Timeline units === scroll px so intro travel is 1:1 with scroll.
          // Pin distance must be >= SCROLL (hero tween length) or scrub compresses
          // the timeline into a shorter range and everything runs too fast.
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
              trigger: ref.current,
              start: 'top top',
              end: () => `+=${getPinDistance()}`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
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
        },
      )

      return () => mm.revert()
    },
    {scope: ref, revertOnUpdate: true, dependencies: [hero, entranceDone, winW, winH]},
  )

  if (!enableHero) return null

  return (
    <div ref={ref} className="invisible">
      <div className="relative">
        {image && (
          <div className="gs-image-wrapper">
            <PageHeroPicture image={image} />
          </div>
        )}
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
      {hasIntroText && (
        <div className="gs-intro-text pointer-events-none">
          <SiteWidth>
            <SiteGrid>
              <div
                className={cn(
                  'max-lg:mt-header-2 lg:motion-reduce:mt-header-2 col-span-12 md:col-span-7 lg:col-span-4 pointer-events-auto',
                  filmStrip ? 'lg:col-start-8' : 'lg:col-start-9',
                )}
              >
                <RichTextWrap>
                  <CustomPortableText value={introText} />
                </RichTextWrap>
              </div>
              <div className="gs-clip-ref lg:col-span-7"></div>
            </SiteGrid>
          </SiteWidth>
        </div>
      )}
    </div>
  )
}
