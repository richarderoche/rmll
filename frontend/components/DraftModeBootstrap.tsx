'use client'

import {useEffect, useState, type ComponentType} from 'react'

/** Thin client shell — keeps @sanity/visual-editing out of the published bundle. */
export function DraftModeBootstrap() {
  const [DraftTools, setDraftTools] = useState<ComponentType | null>(null)

  useEffect(() => {
    void import('./DraftModeTools').then((mod) => {
      setDraftTools(() => mod.DraftModeTools)
    })
  }, [])

  if (!DraftTools) return null
  return <DraftTools />
}
