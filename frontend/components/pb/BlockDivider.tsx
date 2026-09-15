'use client'

import Divider, {DividerProps} from '../shared/Divider'

export default function BlockDivider({
  block,
}: {
  block: DividerProps
} & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <Divider
      showDividerLine={block.showDividerLine}
      size={block.size}
      sizeBelow={block.sizeBelow}
    />
  )
}
