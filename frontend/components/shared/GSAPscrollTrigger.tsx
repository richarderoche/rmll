'use client'

import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/all'
import {useLenis} from 'lenis/react'
import {useEffect, useLayoutEffect} from 'react'

export function GSAPscrollTrigger() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.clearScrollMemory('manual')
    ScrollTrigger.defaults({
      markers: false,
    })
  }, [])

  const lenis = useLenis(ScrollTrigger.update)
  useEffect(() => ScrollTrigger.refresh(), [lenis])

  return null
}
