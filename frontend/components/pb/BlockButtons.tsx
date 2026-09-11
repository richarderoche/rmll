'use client'

import {NavItem, PbBlocksQueryResult} from '@/types'
import Button from '../shared/Button'

type BlockButtonData = Extract<PbBlocksQueryResult[number], {_type: 'pbBlockButtons'}>

export default function BlockButtons({block}: {block: BlockButtonData}) {
  return (
    <div className="flex flex-col gap-2">
      {block.buttons.map((btn) => {
        const {_key, linkType, sitePage, externalLink, fileLink} = btn
        if (linkType === 'sitePage' && sitePage) {
          return <Button key={_key} navItem={sitePage as NavItem} />
        }
        if (linkType === 'externalLink' && externalLink) {
          return <Button key={_key} navItem={externalLink as NavItem} />
        }
        if (linkType === 'file') {
          return (
            <Button
              key={_key}
              path={fileLink?.url || ''}
              text={fileLink?.buttonText || 'Download'}
              download
            />
          )
        }
        return null
      })}
    </div>
  )
}
