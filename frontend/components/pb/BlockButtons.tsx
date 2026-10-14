'use client'

import {NavItem, PbColBlock} from '@/types'
import type {FilterByType, Get} from '@sanity/codegen'
import Button from '../shared/Button'

export type BlockButtonsType = FilterByType<PbColBlock, 'pbBlockButtons'>

type BlockButtonFromQuery = Get<BlockButtonsType, 'buttons', number>

export type BlockButtonType = Omit<BlockButtonFromQuery, '_key'> & {
  _key?: string
}

export default function BlockButtons({block}: {block: BlockButtonsType}) {
  const buttons = block.buttons ?? []
  if (buttons.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {buttons.map((btn, index) => {
        return <BlockButton key={btn._key ?? index} btn={btn} />
      })}
    </div>
  )
}

export function BlockButton({btn}: {btn: BlockButtonType}) {
  const {linkType, sitePage, externalLink, fileLink, style, width = 'full'} = btn
  if (linkType === 'sitePage' && sitePage) {
    return <Button navItem={sitePage as NavItem} style={style} width={width} />
  }
  if ((linkType === 'externalLink' || linkType === 'subscribe') && externalLink) {
    return <Button navItem={externalLink as NavItem} style={style} width={width} />
  }
  if (linkType === 'file') {
    return (
      <Button
        path={fileLink?.url || ''}
        text={fileLink?.buttonText || 'Download'}
        download
        style={style}
        width={width}
      />
    )
  }
  return null
}
