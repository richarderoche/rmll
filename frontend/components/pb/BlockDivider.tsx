'use client'

import type {PbBlockDivider} from '@/sanity.types'
import Divider from '../shared/Divider'

export default function BlockDivider({
  block,
  ...rest
}: {
  block: PbBlockDivider
} & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <Divider
      {...rest}
      showOnMobile={block.showOnMobile ?? true}
      showOnTablet={block.showOnTablet ?? true}
      showOnDesktop={block.showOnDesktop ?? true}
      showDividerLine={block.showDividerLine ?? true}
      size={block.size ?? 1}
    />
  )
}
