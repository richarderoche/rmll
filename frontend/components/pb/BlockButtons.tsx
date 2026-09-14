'use client'

import {NavItem, PbBlocksQueryResult} from '@/types'
import Button from '../shared/Button'

export type BlockButtonsType = Extract<PbBlocksQueryResult[number], {_type: 'pbBlockButtons'}>

/** Resolved `button` object from GROQ (`pbButton` projection). `_key` only exists on array items. */
type BlockButtonFromQuery = NonNullable<BlockButtonsType['buttons']>[number]

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
  const {linkType, sitePage, externalLink, fileLink, style} = btn
  if (linkType === 'sitePage' && sitePage) {
    return <Button navItem={sitePage as NavItem} style={style} />
  }
  if (linkType === 'externalLink' && externalLink) {
    return <Button navItem={externalLink as NavItem} style={style} />
  }
  if (linkType === 'file') {
    return (
      <Button
        path={fileLink?.url || ''}
        text={fileLink?.buttonText || 'Download'}
        download
        style={style}
      />
    )
  }
  return null
}
