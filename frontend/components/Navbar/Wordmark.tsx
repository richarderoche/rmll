'use client'
import {useStore} from '@/lib/store'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/all'
import Link from 'next/link'
import {useRef} from 'react'
import LogoLandLibrary from './LogoLandLibrary'
import LogoRockyMountain from './LogoRockyMountain'
import LogoThe from './LogoThe'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Wordmark({siteTitle}: {siteTitle: string}) {
  const wordmarkRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const setWordmark = (collapsed: boolean, animate = true) => {
        const state = {
          wm1: {yPercent: collapsed ? -100 : 0, autoAlpha: collapsed ? 0 : 1},
          wm2: {yPercent: collapsed ? -100 : 0},
        }

        if (!animate) {
          gsap.set('.wordmark-1', state.wm1)
          gsap.set('.wordmark-2', state.wm2)
          return
        }

        const vars = {duration: 0.3, ease: 'circ.out', overwrite: 'auto'} as const
        gsap.to('.wordmark-1', {...state.wm1, ...vars})
        gsap.to('.wordmark-2', {...state.wm2, ...vars})
      }

      const st = ScrollTrigger.create({
        start: 25,
        onEnter: () => {
          if (!useStore.getState().isMobileNavOpen) setWordmark(true)
        },
        onLeaveBack: () => {
          if (!useStore.getState().isMobileNavOpen) setWordmark(false)
        },
        onRefresh: (self) => {
          setWordmark(useStore.getState().isMobileNavOpen || self.isActive, false)
        },
      })

      const unsub = useStore.subscribe((state, prev) => {
        if (state.isMobileNavOpen === prev.isMobileNavOpen) return
        if (state.isMobileNavOpen) setWordmark(true)
        else setWordmark(st.isActive)
      })

      return () => unsub()
    },
    {scope: wordmarkRef},
  )

  return (
    <div className="relative z-10 flex overflow-visible" aria-label={siteTitle}>
      <LogoThe className="h-header w-auto relative top-[7.5%] mr-[calc(var(--header-height)*0.3)]" />
      <div ref={wordmarkRef} className="flex flex-col w-fit overflow-visible">
        <Link className="wordmark-1 pointer-events-auto w-fit" href="/">
          <LogoRockyMountain className="h-header w-auto block" />
        </Link>
        <Link className="wordmark-2 pointer-events-auto w-fit" href="/">
          <LogoLandLibrary className="h-header w-auto block" />
        </Link>
      </div>
    </div>
  )
}
