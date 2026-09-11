'use client'

import type { PbBlockRichText } from '@/sanity.types'
import { PortableTextBlock } from 'next-sanity'
import { CustomPortableText } from '../shared/CustomPortableText'
import RichTextWrap from '../shared/RichTextWrap'

export default function BlockRichText({
  block,
  ...rest
}: {
  block: PbBlockRichText
} & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <RichTextWrap {...rest}>
      <CustomPortableText
        value={block.textContent as PortableTextBlock[]}
      />
    </RichTextWrap>
  )
}
