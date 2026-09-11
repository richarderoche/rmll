'use client'

import DraftModeToast from '@/components/DraftModeToast'
import dynamic from 'next/dynamic'

const VisualEditing = dynamic(
  () => import('next-sanity/visual-editing').then((mod) => mod.VisualEditing),
  {ssr: false},
)

export function DraftModeTools() {
  return (
    <>
      <DraftModeToast />
      <VisualEditing />
    </>
  )
}
