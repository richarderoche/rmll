'use client'

import type { ScriptsQueryResult } from '@/sanity.types'
import dynamic from 'next/dynamic'

const CustomScripts = dynamic(() => import('./CustomScripts'), { ssr: false })

export default function CustomScriptsLoader({
  customScripts,
  enableProdScripts,
}: {
  customScripts: NonNullable<ScriptsQueryResult>['customScripts']
  enableProdScripts: boolean
}) {
  return (
    <CustomScripts
      customScripts={customScripts}
      enableProdScripts={enableProdScripts}
    />
  )
}
