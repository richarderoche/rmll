'use client'

import {usePrefersReducedMotion} from '@/lib/hooks'
import {useStore} from '@/lib/store'
import type {PbBlockTeam} from '@/sanity.types'
import {useGSAP} from '@gsap/react'
import {Get} from '@sanity/codegen'
import {FocusTrap} from 'focus-trap-react'
import gsap from 'gsap'
import {useEffect, useRef} from 'react'
import IconClose from '../icons/IconClose'
import {CustomPortableText} from '../shared/CustomPortableText'
import ImageBasic from '../shared/ImageBasic'
import RichTextWrap from '../shared/RichTextWrap'
import SiteGrid from '../shared/SiteGrid'
import SiteWidth from '../shared/SiteWidth'

type TeamMember = Get<PbBlockTeam, 'teamMembers', number>

const BACKDROP_DURATION = 0.22
const PANEL_DURATION = 0.5
const ITEM_DURATION = 0.4
const ITEM_STAGGER = 0.05
const PANEL_SCALE_FROM = 0.95
const ITEM_Y_FROM = 10

export default function TeamMemberOverlay({
  member,
  onClose,
}: {
  member: TeamMember
  onClose: () => void
}) {
  const {image, name, role, bio} = member
  const setPauseLenis = useStore((state) => state.setPauseLenis)
  const reducedMotion = usePrefersReducedMotion() ?? false

  const rootRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef(false)
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const closeRef = useRef<() => void>(() => {})

  useGSAP(
    () => {
      if (closingRef.current) return

      const items = gsap.utils
        .toArray<HTMLElement>('.modal-item')
        .filter((el) => getComputedStyle(el).display !== 'none')

      const panelFrom = reducedMotion ? {autoAlpha: 0} : {autoAlpha: 0, scale: PANEL_SCALE_FROM}
      const panelTo = reducedMotion ? {autoAlpha: 1} : {autoAlpha: 1, scale: 1}
      const itemFrom = reducedMotion ? {autoAlpha: 0} : {autoAlpha: 0, y: ITEM_Y_FROM}
      const itemTo = reducedMotion ? {autoAlpha: 1} : {autoAlpha: 1, y: 0}

      if (!reducedMotion) gsap.set('.modal-panel', {transformOrigin: 'center center'})

      const tl = gsap.timeline()
      tl.fromTo(
        '.clickaway-backdrop',
        {autoAlpha: 0},
        {autoAlpha: 1, duration: BACKDROP_DURATION, ease: 'power2.out'},
      )
      tl.fromTo(
        '.modal-panel',
        panelFrom,
        {...panelTo, duration: PANEL_DURATION, ease: 'power2.out'},
        '-=0.1',
      )
      if (items.length) {
        tl.fromTo(
          items,
          itemFrom,
          {...itemTo, duration: ITEM_DURATION, stagger: ITEM_STAGGER, ease: 'power2.out'},
          '-=0.16',
        )
      }
    },
    {scope: rootRef, dependencies: [member, reducedMotion], revertOnUpdate: true},
  )

  const close = () => {
    if (closingRef.current) return
    closingRef.current = true

    const root = rootRef.current
    const backdrop = root?.querySelector('.clickaway-backdrop')
    const panel = root?.querySelector('.modal-panel')

    if (!backdrop || !panel) {
      onClose()
      return
    }

    gsap.killTweensOf([backdrop, panel])

    const panelTo = reducedMotion ? {autoAlpha: 0} : {autoAlpha: 0, scale: PANEL_SCALE_FROM}

    exitTimelineRef.current = gsap.timeline({onComplete: onClose})
    exitTimelineRef.current
      .to(panel, {
        ...panelTo,
        duration: PANEL_DURATION / 2,
        ease: 'power2.in',
      })
      .to(backdrop, {
        autoAlpha: 0,
        duration: BACKDROP_DURATION,
        ease: 'power2.in',
      })
  }

  closeRef.current = close

  useEffect(() => {
    setPauseLenis(true)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      exitTimelineRef.current?.kill()
      setPauseLenis(false)
    }
  }, [setPauseLenis])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-9999"
      role="dialog"
      aria-modal="true"
      aria-label={name || 'Team member'}
    >
      <FocusTrap>
        <div className="flex h-full items-center justify-center">
          <button
            type="button"
            className="clickaway-backdrop absolute inset-0 bg-sage-900/90 cursor-auto opacity-0"
            onClick={close}
            aria-label="Close"
          ></button>
          <SiteWidth className="pointer-events-none">
            <SiteGrid>
              <div className="modal-panel pointer-events-auto col-span-12 lg:col-span-10 lg:col-start-2 3xl:col-span-8 3xl:col-start-3 corner opacity-0">
                <div
                  className="flex gap-gut-75 p-gut-75 lg:gap-gut lg:p-gut pb-0 bg-bg-subtle  max-h-[85vh] overflow-y-auto relative"
                  data-lenis-prevent
                >
                  <button
                    type="button"
                    className="absolute top-gut-25 right-gut-25 z-10"
                    onClick={close}
                    aria-label="Close"
                  >
                    <IconClose />
                  </button>
                  {image && (
                    <div className="modal-item w-1/4 max-md:hidden">
                      <ImageBasic
                        image={image}
                        alt={name || ''}
                        sizes="auto, 20vw"
                        maxDimension={250}
                        ratio={1}
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-gut-50">
                    <div className="flex flex-wrap items-center md:items-baseline gap-x-gut-33">
                      <div className="modal-item ts-h4 w-[2em] corner md:hidden mr-gut-25">
                        {image && (
                          <ImageBasic
                            image={image}
                            alt={name || ''}
                            sizes="auto, 50px"
                            maxDimension={50}
                            ratio={1}
                          />
                        )}
                      </div>
                      {name && <div className="modal-item ts-h4">{name}</div>}
                      {role && <div className="modal-item ts-h6 text-sage-800">{role}</div>}
                    </div>
                    {bio && (
                      <div className="modal-item pb-gut-75 lg:pb-gut">
                        <RichTextWrap className="ts-p-sm">
                          <CustomPortableText value={bio as any} />
                        </RichTextWrap>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SiteGrid>
          </SiteWidth>
        </div>
      </FocusTrap>
    </div>
  )
}
